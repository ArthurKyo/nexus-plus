/** A bounded progress value keeps offscreen objects from travelling indefinitely. */
export function sceneProgress(top: number, height: number): number {
  return Math.max(0, Math.min(1, (height - top) / Math.max(1, height * 1.6)));
}
export function mountLandingMotion(
  signal: AbortSignal,
  paused: () => boolean,
): () => void {
  const root = document.querySelector<HTMLElement>(".future-landing");
  if (!root) return () => {};
  const chart = root.querySelector<HTMLElement>(".progress-sculpture");
  const chartObserver =
    chart && "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            chart.classList.toggle("chart-in-view", entries[0].isIntersecting);
          },
          { threshold: 0.25 },
        )
      : null;
  if (chart && chartObserver) chartObserver.observe(chart);
  signal.addEventListener("abort", () => chartObserver?.disconnect(), {
    once: true,
  });
  const cards = [...root.querySelectorAll<HTMLElement>(".motion-chapter")];
  const stage = root.querySelector<HTMLElement>(".cosmic-stage");
  let frame = 0;
  let tiltX = 0,
    tiltY = 0,
    targetX = 0,
    targetY = 0;
  const draw = () => {
    frame = 0;
    if (document.hidden) return;
    const off = paused();
    const height = window.innerHeight;
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const p = off ? 0.5 : sceneProgress(rect.top, height);
      card.style.setProperty("--scene-turn", `${(p - 0.5) * 48}deg`);
      card.style.setProperty("--scene-lift", `${(p - 0.5) * -100}px`);
    });
    const y = off ? 0 : Math.min(window.scrollY, height * 2);
    root.style.setProperty("--type-shift", `${-y * 0.11}px`);
    root.style.setProperty(
      "--ribbon-shift",
      `${off ? 0 : -window.scrollY * 0.12}px`,
    );
    tiltX = off ? 0 : tiltX + (targetX - tiltX) * 0.14;
    tiltY = off ? 0 : tiltY + (targetY - tiltY) * 0.14;
    stage?.style.setProperty("--pointer-x", `${tiltX}deg`);
    stage?.style.setProperty("--pointer-y", `${tiltY}deg`);
    if (
      !off &&
      (Math.abs(targetX - tiltX) > 0.01 || Math.abs(targetY - tiltY) > 0.01)
    )
      schedule();
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(draw);
  };
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  stage?.addEventListener(
    "pointermove",
    (e) => {
      if (!fine.matches || paused()) return;
      const r = stage.getBoundingClientRect();
      targetY = ((e.clientX - r.left) / r.width - 0.5) * 16;
      targetX = -((e.clientY - r.top) / r.height - 0.5) * 12;
      schedule();
    },
    { signal },
  );
  stage?.addEventListener(
    "pointerleave",
    () => {
      targetX = targetY = 0;
      schedule();
    },
    { signal },
  );
  window.addEventListener("scroll", schedule, { passive: true, signal });
  window.addEventListener("resize", schedule, { passive: true, signal });
  window.addEventListener("nexus:motion", schedule, { signal });
  matchMedia("(prefers-reduced-motion: reduce)").addEventListener(
    "change",
    schedule,
    { signal },
  );
  document.addEventListener(
    "visibilitychange",
    () => {
      root.classList.toggle("motion-hidden", document.hidden);
      schedule();
    },
    { signal },
  );
  schedule();
  return () => cancelAnimationFrame(frame);
}
