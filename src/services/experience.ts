import { drawBackgroundScene } from "./backgroundScene";
import { mountLandingMotion } from "./landingMotion";
import { StorageService } from "../storage/storageService";
import { journeyPanel } from "../pages/landing";
import { openGuide, guideFor } from "../components/guide";
import { icon } from "../utils/html";
let dispose: () => void = () => {};
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
export function motionPaused(): boolean {
  return reduced.matches || StorageService.get<boolean>("motion-paused", false);
}
export function syncMotion(): void {
  const paused = motionPaused();
  document.documentElement.dataset.motion = paused ? "paused" : "active";
  document
    .querySelectorAll<HTMLButtonElement>("[data-motion-toggle]")
    .forEach((b) => {
      b.setAttribute("aria-pressed", String(paused));
      b.innerHTML =
        icon(paused ? "play-circle" : "pause-circle") +
        `<span>${paused ? "Efeitos pausados" : "Pausar efeitos"}</span>`;
      b.title = reduced.matches
        ? "O seu dispositivo está configurado para reduzir movimentos."
        : paused
          ? "Ativar efeitos de movimento"
          : "Pausar efeitos de movimento";
    });
}
export function toggleMotion(): void {
  if (!reduced.matches) StorageService.set("motion-paused", !motionPaused());
  syncMotion();
  window.dispatchEvent(new Event("nexus:motion"));
}
export function mountExperience(route: string): void {
  dispose();
  const lifecycle = new AbortController();
  const { signal } = lifecycle;
  const cleanup: (() => void)[] = [];
  syncMotion();
  document.body.dataset.route = route || "landing";
  const help = guideFor(route);
  if (help) {
    document
      .querySelector(".page-header")
      ?.insertAdjacentHTML(
        "afterend",
        `<details class="context-guide no-print"><summary>${icon("compass")}<span><strong>Seu guia nesta etapa</strong><span>${help.short}</span></span>${icon("plus-lg")}</summary><div><p>${help.text}</p><button class="btn btn-sm" data-open-guide>${icon("lightbulb")} Me mostre o caminho</button></div></details>`,
      );
  }
  document.addEventListener(
    "click",
    (e) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-motion-toggle]")) toggleMotion();
      if (target.closest("[data-open-guide]")) openGuide(route);
    },
    { signal },
  );
  document.addEventListener(
    "keydown",
    (e) => {
      const target = e.target as HTMLElement;
      if (
        e.key === "?" &&
        !target.closest("input,textarea,select,[contenteditable]") &&
        !document.querySelector("dialog[open]")
      ) {
        e.preventDefault();
        openGuide(route);
      }
    },
    { signal },
  );
  const sidebar = document.getElementById("sidebar");
  const mobile = matchMedia("(max-width:767px)");
  const syncSidebar = () => {
    if (sidebar)
      sidebar.inert = mobile.matches && !sidebar.classList.contains("open");
  };
  syncSidebar();
  mobile.addEventListener("change", syncSidebar, { signal });
  if (sidebar) {
    const observer = new MutationObserver(syncSidebar);
    observer.observe(sidebar, { attributes: true, attributeFilter: ["class"] });
    cleanup.push(() => observer.disconnect());
  }
  {
    const canvas = document.getElementById(
      "nexus-cosmos",
    ) as HTMLCanvasElement | null;
    if (canvas) cleanup.push(mountCosmos(canvas, signal));
  }
  if (route === "") {
    bindJourney(signal);
    cleanup.push(mountLandingMotion(signal, motionPaused));
    const revealElements = [
      ...document.querySelectorAll<HTMLElement>("[data-reveal]"),
    ];
    if (!motionPaused() && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-visible");
              entry.target.classList.remove("reveal-pending");
              observer.unobserve(entry.target);
            }
          }),
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
      );
      revealElements.forEach((el) => {
        el.classList.add("reveal-pending");
        observer.observe(el);
      });
      cleanup.push(() => observer.disconnect());
    }
    document
      .querySelectorAll<HTMLElement>("[data-lesson-answer]")
      .forEach((b) =>
        b.addEventListener(
          "click",
          () => {
            const good = b.dataset.lessonAnswer === "safe";
            document.getElementById("lesson-feedback")!.innerHTML =
              `<strong>${icon(good ? "shield-check" : "lightbulb")} ${good ? "Boa percepção. Esse pedido é suspeito." : "Ainda bem que estamos praticando."}</strong><p>Códigos de verificação dão acesso à sua conta. Nunca os compartilhe, mesmo que alguém diga ser do suporte.</p>`;
            document
              .querySelectorAll("[data-lesson-answer]")
              .forEach((el) =>
                el.setAttribute("aria-pressed", String(el === b)),
              );
          },
          { signal },
        ),
      );
  }
  const onMotion = () => {
    syncMotion();
    if (motionPaused())
      document.querySelectorAll(".reveal-pending").forEach((el) => {
        el.classList.remove("reveal-pending");
        el.classList.add("reveal-visible");
      });
  };
  reduced.addEventListener("change", onMotion, { signal });
  window.addEventListener("nexus:motion", onMotion, { signal });
  dispose = () => {
    lifecycle.abort();
    cleanup.forEach((fn) => fn());
  };
}
function bindJourney(signal: AbortSignal): void {
  const buttons = [
    ...document.querySelectorAll<HTMLButtonElement>("[data-journey-step]"),
  ];
  const select = (index: number, focus = false) => {
    buttons.forEach((b, i) => {
      b.classList.toggle("selected", i === index);
      b.setAttribute("aria-selected", String(i === index));
      b.tabIndex = i === index ? 0 : -1;
    });
    const panel = document.getElementById("journey-panel")!;
    panel.innerHTML = journeyPanel(index);
    panel.setAttribute("aria-labelledby", `journey-tab-${index}`);
    if (focus) buttons[index].focus();
  };
  buttons.forEach((b, i) => {
    b.addEventListener("click", () => select(i), { signal });
    b.addEventListener(
      "keydown",
      (e) => {
        let next = i;
        if (e.key === "ArrowDown" || e.key === "ArrowRight")
          next = (i + 1) % buttons.length;
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
          next = (i + buttons.length - 1) % buttons.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = buttons.length - 1;
        else return;
        e.preventDefault();
        select(next, true);
      },
      { signal },
    );
  });
  document.getElementById("journey-panel")?.addEventListener(
    "click",
    (e) => {
      const target = (e.target as HTMLElement).closest<HTMLButtonElement>(
        "[data-sample-color]",
      );
      if (!target) return;
      document
        .getElementById("color-preview")!
        .style.setProperty("--sample", target.dataset.sampleColor!);
      document
        .querySelectorAll("[data-sample-color]")
        .forEach((el) =>
          el.setAttribute("aria-pressed", String(el === target)),
        );
    },
    { signal },
  );
}
/** Scroll-driven camera with a settling loop; stops when idle or hidden. */
function mountCosmos(
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  let width = 0,
    height = 0,
    frame = 0;
  let cameraScroll = window.scrollY;
  const root = document.querySelector<HTMLElement>(
    ".future-landing, .future-flow",
  )!;
  const depth = [...document.querySelectorAll<HTMLElement>("[data-depth]")];
  const draw = () => {
    frame = 0;
    if (document.hidden) return;
    const paused = motionPaused();
    cameraScroll = paused
      ? window.scrollY
      : cameraScroll + (window.scrollY - cameraScroll) * 0.12;
    const scroll = cameraScroll,
      max = document.documentElement.scrollHeight - height;
    const progress = Math.max(0, Math.min(1, scroll / Math.max(1, max)));
    const phase = paused ? 0 : (scroll / Math.max(height, 1)) * 1.8;
    root.style.setProperty("--reading", String(progress));
    root.style.setProperty(
      "--ambient-y",
      `${paused ? 0 : Math.sin(phase * 0.6) * height * 0.4}px`,
    );
    root.style.setProperty(
      "--ambient-x",
      `${paused ? 0 : Math.sin(phase * 0.5) * width * 0.35}px`,
    );
    root.style.setProperty(
      "--grid-y",
      `${paused ? 0 : -((scroll * 0.3) % 72)}px`,
    );
    root.style.setProperty("--spark-rotation", `${phase * 20}deg`);
    root.style.setProperty("--orbit-rotation", `${-35 + phase * 30}deg`);
    root.style.setProperty("--purpose-rotation", `${-12 + phase * 7}deg`);
    depth.forEach((el) =>
      el.style.setProperty(
        "--depth-y",
        `${paused ? 0 : Math.min(scroll, 800) * Number(el.dataset.depth)}px`,
      ),
    );
    ctx.clearRect(0, 0, width, height);
    const compact = width < 768;
    const count = compact ? 30 : 65;
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < count; i++) {
      const x =
        ((((i * 0.61803398875 + phase * ((i % 3) + 1) * 0.025) % 1) + 1) % 1) *
        width;
      const y =
        ((((i * i * 0.137 + -phase * ((i % 3) + 1) * 0.06) % 1) + 1) % 1) *
        height;
      points.push({ x, y });
      ctx.beginPath();
      ctx.arc(x, y, i % 5 === 0 ? 1.35 : 0.7, 0, Math.PI * 2);
      ctx.fillStyle =
        i % 7 === 0 ? "rgba(197,242,147,.7)" : "rgba(153,193,239,.5)";
      ctx.fill();
    }
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x,
          dy = points[i].y - points[j].y,
          d = Math.hypot(dx, dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.strokeStyle = `rgba(137,177,220,${(1 - d / 110) * 0.2})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    // The first camera move happens within one viewport; later poses span the story.
    const cameraProgress =
      scroll <= height
        ? (scroll / Math.max(1, height)) * 0.25
        : 0.25 + ((scroll - height) / Math.max(1, max - height)) * 0.75;
    drawBackgroundScene(ctx, width, height, paused ? 0 : cameraProgress);
    if (!paused && Math.abs(window.scrollY - cameraScroll) > 0.25) schedule();
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(draw);
  };
  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    schedule();
  };
  window.addEventListener("scroll", schedule, { passive: true, signal });
  window.addEventListener("resize", resize, { passive: true, signal });
  window.addEventListener("nexus:motion", schedule, { signal });
  reduced.addEventListener("change", schedule, { signal });
  document.addEventListener("visibilitychange", schedule, { signal });
  resize();
  return () => cancelAnimationFrame(frame);
}
