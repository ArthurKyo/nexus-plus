import "./styles/fonts.css";
import "@fontsource/fira-sans/latin-400.css";
import "@fontsource/fira-sans/latin-500.css";
import "@fontsource/fira-sans/latin-600.css";
import "@fontsource/fira-sans/latin-700.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/app.css";
import { mountExperience } from "./services/experience";
import { registerWebTools } from "./services/webmcp";
import { landing, brand } from "./pages/landing";
import {
  state,
  update,
  enterDemo,
  exitDemo,
  erase,
  consent,
} from "./services/state";
import { dashboard } from "./pages/dashboard";
import { shell } from "./components/shell";
import { toast, confirmDialog, setLoading } from "./components/ui";
import {
  diagnostic,
  diagnosticResult,
  diagnosticAction,
} from "./pages/diagnostic";
import { onboarding, bindOnboarding } from "./pages/onboarding";
import { profile, bindProfile } from "./pages/profile";
import {
  catalog,
  bindCatalog,
  itemDialog,
  removeItem,
  refreshCatalog,
  type CatalogKind,
} from "./pages/catalog";
import { editor, bindEditor } from "./pages/editor";
import { businessPage } from "./pages/public";
import { qrPage, cardPage, bindShare, shareAction } from "./pages/share";
import {
  security,
  training,
  completeModule,
  answerQuiz,
  advanceQuiz,
} from "./pages/security";
import {
  evolution,
  impact,
  summary,
  team,
  bindTeam,
  downloadSummary,
} from "./pages/reports";
import {
  settings,
  privacy,
  standalonePrivacy,
  applyTheme,
  changeMode,
} from "./pages/settings";
import { exportBusiness, exportData } from "./services/exportService";
import { track } from "./services/analyticsService";
import { questions } from "./data/questions";
import type { Analytics, ColorMode } from "./types";
const app = document.getElementById("app")!;
const basePath = import.meta.env.BASE_URL;
let route = "";
let installPrompt:
  | (Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: string }>;
    })
  | null = null;
applyTheme();
matchMedia("(prefers-color-scheme:dark)").addEventListener("change", () =>
  applyTheme(),
);
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installPrompt = e as typeof installPrompt;
});
function currentRoute(): string {
  if (location.pathname.endsWith("negocio.html")) return "publica";
  if (location.pathname.endsWith("equipe.html")) return "equipe";
  return location.hash.startsWith("#/")
    ? location.hash.slice(2).split("?")[0]
    : "";
}
function renderContent(): void {
  route = currentRoute();
  const s = state();
  const publicRoutes = [
    "",
    "diagnostico",
    "resultado",
    "cadastro",
    "privacidade",
    "equipe",
    "publica",
  ];
  if (!publicRoutes.includes(route) && !s.business.name) {
    location.hash = "/diagnostico";
    return;
  }
  if (route === "cadastro" && !s.consent?.accepted) {
    location.hash = "/diagnostico";
    return;
  }
  document.title = `nexus+ · ${route === "publica" ? s.business.name || "Página digital" : route === "" ? "Seu próximo passo é digital" : "Seu espaço digital"}`;
  if (route === "") {
    app.innerHTML = landing();
    return;
  }
  if (route === "diagnostico") {
    app.innerHTML = diagnostic();
    return;
  }
  if (route === "resultado") {
    app.innerHTML = diagnosticResult();
    return;
  }
  if (route === "cadastro") {
    app.innerHTML = onboarding();
    bindOnboarding(render);
    return;
  }
  if (route === "privacidade" && !s.business.name) {
    app.innerHTML = standalonePrivacy();
    return;
  }
  if (route === "publica") {
    const id = new URLSearchParams(location.search).get("id");
    if (!s.business.name || (id && id !== s.business.id)) {
      app.innerHTML = `<main id="main" class="flow-layout" style="display:block;max-width:750px"><section class="card-box"><a href="/">${brand}</a><h1 class="mt-4">Esta página não está neste dispositivo.</h1><p>Os dados da prévia ficam no navegador em que o negócio foi criado. Peça ao responsável o arquivo HTML exportado ou o endereço da página hospedada.</p><a class="btn btn-primary" href="/">Conhecer a nexus+</a></section></main>`;
    } else {
      app.innerHTML = businessPage(s);
      track("profile_view");
    }
    return;
  }
  const pages: Record<string, () => string> = {
    dashboard,
    perfil: profile,
    produtos: () => catalog("products"),
    servicos: () => catalog("services"),
    pagina: editor,
    qr: qrPage,
    cartao: cardPage,
    seguranca: security,
    treinamento: training,
    evolucao: evolution,
    impacto: impact,
    resumo: summary,
    equipe: team,
    configuracoes: settings,
    privacidade: privacy,
  };
  if (!pages[route]) {
    app.innerHTML = shell(
      '<section class="empty-state"><h1>Não encontramos esta página.</h1><a class="btn btn-primary" href="#/dashboard">Voltar ao meu espaço</a></section>',
      route,
    );
    return;
  }
  if (route === "equipe" && !s.business.name)
    app.innerHTML = `<header class="onboarding-header"><a href="/">${brand}</a><a class="btn" href="/#/privacidade">Privacidade</a></header><main class="workspace-main" id="main">${team()}</main>`;
  else app.innerHTML = shell(pages[route](), route);
  if (route === "perfil") bindProfile();
  if (route === "produtos" || route === "servicos")
    bindCatalog(route === "produtos" ? "products" : "services");
  if (route === "pagina") bindEditor();
  if (route === "qr" || route === "cartao")
    void bindShare(route, render).catch(handleError);
  if (route === "equipe") bindTeam();
}
export function render(): void {
  renderContent();
  app.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((link) => {
    const href = link.getAttribute("href")!;
    if (!href.startsWith("//"))
      link.setAttribute("href", basePath + href.slice(1));
  });
  mountExperience(route);
}
function handleError(error: unknown): void {
  toast(
    error instanceof Error
      ? error.message
      : "Não foi possível concluir a ação. Tente novamente.",
    true,
  );
}
window.addEventListener("hashchange", () => {
  if (location.hash.startsWith("#/")) {
    render();
    window.scrollTo(0, 0);
    document.getElementById("main")?.focus({ preventScroll: true });
  }
});
window.addEventListener("online", () => toast("Conexão restabelecida."));
window.addEventListener("offline", () =>
  toast("Você está offline. Seus dados continuam neste dispositivo."),
);
window.addEventListener("nexus:saved", () => {
  const el = document.getElementById("save-status");
  if (el) el.textContent = "✓ Salvo neste dispositivo";
});
window.addEventListener("error", (e) => {
  if (e.message.includes("armazenamento")) toast(e.message, true);
});
document.addEventListener("click", (e) => {
  void handleClick(e).catch(handleError);
});
async function handleClick(event: MouseEvent): Promise<void> {
  const target = event.target as HTMLElement;
  const internal = target.closest<HTMLAnchorElement>('a[href^="#/"]');
  if (internal && location.pathname !== basePath) {
    event.preventDefault();
    location.href = basePath + internal.getAttribute("href");
    return;
  }
  const tracked = target.closest<HTMLElement>("[data-track]");
  if (tracked && !tracked.closest("#live-preview"))
    track(tracked.dataset.track as Analytics["type"], tracked.dataset.itemId);
  const answer = target.closest<HTMLElement>("[data-answer]");
  if (answer) {
    update((s) => {
      s.diagnosticDraft[questions[s.diagnosticStep].id] = Number(
        answer.dataset.answer,
      );
    });
    render();
    document
      .querySelector<HTMLButtonElement>('[data-answer][aria-pressed="true"]')
      ?.focus();
    return;
  }
  const edit = target.closest<HTMLElement>("[data-edit-item]");
  if (edit) {
    itemDialog(edit.dataset.kind as CatalogKind, edit.dataset.editItem, render);
    return;
  }
  const del = target.closest<HTMLElement>("[data-delete-item]");
  if (del) {
    await removeItem(
      del.dataset.kind as CatalogKind,
      del.dataset.deleteItem!,
      render,
    );
    return;
  }
  const module = target.closest<HTMLElement>("[data-complete-module]");
  if (module) {
    completeModule(module.dataset.completeModule!, render);
    return;
  }
  const quiz = target.closest<HTMLElement>("[data-quiz-answer]");
  if (quiz) {
    answerQuiz(quiz.dataset.quizAnswer === "true");
    return;
  }
  const theme = target.closest<HTMLElement>("[data-color-mode]");
  if (theme) {
    changeMode(theme.dataset.colorMode as ColorMode);
    render();
    return;
  }
  const removeImage = target.closest<HTMLElement>("[data-remove-image]");
  if (removeImage) {
    update((s) => {
      s.business[removeImage.dataset.removeImage as "logo" | "cover"] = "";
    });
    document.getElementById(
      `preview-${removeImage.dataset.removeImage}`,
    )!.innerHTML = "";
    toast("Imagem removida.");
    return;
  }
  const el = target.closest<HTMLButtonElement>("[data-action]");
  if (!el) return;
  const action = el.dataset.action!;
  if (diagnosticAction(action, render)) return;
  if (action === "demo") {
    enterDemo();
    if (location.pathname !== basePath)
      location.href = basePath + "#/dashboard";
    else {
      location.hash = "/dashboard";
      render();
    }
    return;
  }
  if (action === "exit-demo") {
    exitDemo();
    location.hash = state().business.name ? "/dashboard" : "/";
    render();
    return;
  }
  if (action === "menu") {
    const menu = document.getElementById("sidebar")!;
    menu.classList.toggle("open");
    el.setAttribute("aria-expanded", String(menu.classList.contains("open")));
    return;
  }
  if (action === "cycle-theme") {
    changeMode(
      document.documentElement.dataset.theme === "dark" ? "light" : "dark",
    );
    return;
  }
  if (action === "onboarding-back") {
    update((s) => {
      s.onboardingStep = Math.max(0, s.onboardingStep - 1);
    });
    render();
    return;
  }
  if (action === "add-products" || action === "add-services") {
    itemDialog(
      action === "add-products" ? "products" : "services",
      undefined,
      render,
    );
    return;
  }
  if (action === "clear-filters") {
    render();
    return;
  }
  if (action === "redo-diagnostic") {
    if (
      Object.keys(state().diagnosticDraft).length &&
      !(await confirmDialog(
        "Recomeçar este diagnóstico?",
        "Suas respostas em andamento serão substituídas. Os diagnósticos concluídos serão preservados.",
        "Recomeçar",
      ))
    )
      return;
    update((s) => {
      s.diagnosticDraft = {};
      s.diagnosticStep = 0;
    });
    location.hash = "/diagnostico";
    return;
  }
  if (action === "export-page") {
    setLoading(el, true);
    try {
      await exportBusiness();
      update((s) => {
        s.published = true;
      });
      toast("Página HTML exportada com sucesso.");
    } finally {
      setLoading(el, false);
    }
    return;
  }
  if (action === "next-quiz") {
    advanceQuiz(el.dataset.answerValue === "true");
    render();
    return;
  }
  if (action === "restart-quiz") {
    update((s) => {
      s.quizDraft = [];
    });
    render();
    return;
  }
  if (action === "summary") {
    location.hash = "/resumo";
    return;
  }
  if (action === "download-summary") {
    downloadSummary();
    return;
  }
  if (action === "print-summary") {
    window.print();
    return;
  }
  if (action === "export-data") {
    exportData();
    toast("Cópia dos dados exportada.");
    return;
  }
  if (action === "privacy-consent") {
    if (
      await confirmDialog(
        "Autorizar o armazenamento local?",
        "Vamos guardar neste navegador as informações do negócio, respostas e progresso para oferecer as funcionalidades descritas no termo. Você pode retirar essa autorização apagando seus dados.",
        "Concordar",
      )
    ) {
      consent();
      render();
      toast("Consentimento registrado.");
    }
    return;
  }
  if (action === "erase-data") {
    if (
      await confirmDialog(
        "Apagar todos os seus dados?",
        "Os dados reais e de demonstração da nexus+ serão apagados deste navegador. Exporte uma cópia antes, se desejar. Esta ação não pode ser desfeita.",
        "Apagar definitivamente",
        true,
      )
    ) {
      erase();
      applyTheme();
      location.href = basePath;
    }
    return;
  }
  if (action === "install") {
    if (installPrompt) {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      toast(
        result.outcome === "accepted"
          ? "Instalação solicitada."
          : "Você pode instalar quando quiser.",
      );
      installPrompt = null;
    } else {
      document.getElementById("install-help")!.textContent =
        "Se a opção não aparecer: no Android/Chrome, abra o menu e escolha “Instalar aplicativo”; no iPhone/Safari, use Compartilhar → Adicionar à Tela de Início. A instalação exige HTTPS ou localhost e a versão de produção. Se já instalou, abra pelo ícone do aplicativo.";
    }
    return;
  }
  setLoading(el, true);
  try {
    await shareAction(action, render);
  } finally {
    if (el.isConnected) setLoading(el, false);
  }
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape")
    document.getElementById("sidebar")?.classList.remove("open");
});
if (import.meta.env.PROD && "serviceWorker" in navigator)
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(basePath + "service-worker.js", { scope: basePath })
      .catch(() =>
        toast(
          "A instalação offline não está disponível neste navegador.",
          true,
        ),
      );
  });
render();

registerWebTools();
