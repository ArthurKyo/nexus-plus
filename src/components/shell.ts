import { brand } from "../pages/landing";
import { state } from "../services/state";
import { esc, icon, safeImage } from "../utils/html";
export const navigation = [
  ["dashboard", "grid-1x2", "Visão geral"],
  ["perfil", "shop", "Meu perfil"],
  ["produtos", "box-seam", "Produtos"],
  ["servicos", "scissors", "Serviços"],
  ["pagina", "layout-text-window", "Página digital"],
  ["qr", "qr-code", "QR Code"],
  ["cartao", "person-vcard", "Cartão digital"],
  ["seguranca", "shield-check", "Segurança"],
  ["evolucao", "graph-up-arrow", "Evolução"],
  ["impacto", "bar-chart", "Impacto da intervenção"],
  ["configuracoes", "gear", "Configurações"],
] as const;
export function shell(content: string, route: string): string {
  const s = state(),
    b = s.business;
  const title = navigation.find((n) => n[0] === route)?.[2] ?? "Meu espaço";
  return `<div class="app-shell"><aside class="sidebar" id="sidebar"><button class="btn icon-btn sidebar-close mobile-menu-button" data-action="menu" aria-label="Fechar menu">${icon("x-lg")}</button><a href="#/" aria-label="nexus+ início">${brand}</a><div class="nav-label">SEU NEGÓCIO</div><nav aria-label="Menu do espaço">${navigation.map(([path, ic, label], i) => `${i === 7 ? '<div class="nav-label">APRENDA E EVOLUA</div>' : ""}<a class="side-link ${route === path ? "active" : ""}" href="#/${path}" ${route === path ? 'aria-current="page"' : ""}>${icon(ic)}${label}</a>`).join("")}</nav><div class="side-bottom"><a class="side-link" href="/equipe.html">${icon("mortarboard")} Equipe universitária</a><div class="side-business"><div class="avatar">${safeImage(b.logo) ? `<img src="${safeImage(b.logo)}" alt="">` : esc((b.name || "N").slice(0, 2).toUpperCase())}</div><div><strong>${esc(b.name || "Seu negócio")}</strong><small>${s.demo ? "Espaço de demonstração" : "Seu espaço gratuito"}</small></div></div></div></aside><div class="workspace"><header class="topbar"><button class="btn icon-btn mobile-menu-button" data-action="menu" aria-label="Abrir menu" aria-expanded="false" aria-controls="sidebar">${icon("list")}</button><div class="breadcrumbs"><span>Meu espaço</span>${icon("chevron-right")}<b>${esc(title)}</b></div><div class="actions"><span class="badge-soft d-none d-lg-inline-flex" id="save-status">${icon("cloud-check")} Salvo neste dispositivo</span><button class="btn btn-sm help-button" data-open-guide aria-haspopup="dialog" title="Guia desta etapa (?)">${icon("compass")}<span>Guia</span></button><a class="btn btn-sm" href="#/publica">${icon("box-arrow-up-right")}<span>Ver minha página</span></a><button class="btn icon-btn btn-ghost" data-action="cycle-theme" aria-label="Alternar tema claro e escuro" title="Alternar aparência">${icon("moon")}</button><div class="avatar" aria-label="Seu perfil">${esc((b.owner || b.name || "N").slice(0, 1).toUpperCase())}</div></div></header>${s.demo ? '<div class="demo-strip">Demonstração com dados fictícios. Nenhum contato representa um negócio real. <button data-action="exit-demo">Sair da demonstração</button></div>' : ""}${!navigator.onLine ? '<div class="offline-note">Você está offline. Continue editando: os dados são salvos neste dispositivo.</div>' : ""}<main id="main" tabindex="-1" class="workspace-main">${content}</main></div><nav class="bottom-nav" aria-label="Navegação móvel">${[
    ["dashboard", "grid-1x2", "Início"],
    ["produtos", "box-seam", "Catálogo"],
    ["pagina", "layout-text-window", "Página"],
    ["seguranca", "shield-check", "Segurança"],
    ["configuracoes", "gear", "Ajustes"],
  ]
    .map(
      ([path, ic, label]) =>
        `<a href="#/${path}" class="${route === path ? "active" : ""}" ${route === path ? 'aria-current="page"' : ""}>${icon(ic)}${label}</a>`,
    )
    .join("")}</nav></div>`;
}
export function flowShell(content: string, step = "Diagnóstico"): string {
  return `<div class="future-flow"><div class="cosmic-backdrop" aria-hidden="true"><canvas id="nexus-cosmos"></canvas><div class="ambient-glow glow-one"></div><div class="ambient-glow glow-two"></div><div class="cosmic-grid"></div></div><header class="onboarding-header"><a href="#/" aria-label="nexus+ início">${brand}</a><a class="btn btn-ghost btn-sm" href="#/">${icon("x-lg")} Sair</a></header><main id="main" class="flow-layout"><aside class="flow-aside"><div class="eyebrow">SEU PRÓXIMO PASSO É DIGITAL</div><h1>Vamos construir novas possibilidades.</h1><p>Você não precisa entender de tecnologia. A gente caminha com você.</p><div class="flow-steps">${["Diagnóstico", "Seu resultado", "Seu negócio", "Tudo pronto"].map((v, i) => `<div class="flow-step ${v === step ? "active" : ""}"><span>${i + 1}</span>${v}</div>`).join("")}</div><div class="notice">${icon("shield-check")} Suas informações ficam neste navegador. Você pode exportar ou apagar quando quiser.</div></aside><section class="card-box flow-card">${content}</section></main><footer class="flow-footer"><span>SEU PRÓXIMO CAPÍTULO COMEÇA AQUI</span><button class="motion-toggle" data-motion-toggle aria-pressed="false">${icon("pause-circle")}<span>Pausar efeitos</span></button></footer></div>`;
}
