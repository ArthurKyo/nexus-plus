import { actionPlanPanel } from "../components/actionPlan";
import { journeyOverview } from "../components/guide";
import { state } from "../services/state";
import { completeness, checklist } from "../services/businessService";
import { currentScore, scoreLevel } from "../services/diagnosticService";
import { eventCount } from "../services/analyticsService";
import { pageHeader, progress, scoreCard } from "../components/ui";
import { esc, icon } from "../utils/html";
export function dashboard(): string {
  const s = state(),
    score = currentScore(),
    list = checklist(),
    done = list.filter((v) => v.done).length;
  return `${pageHeader(`Olá, ${s.business.owner || s.business.name || "empreendedor"}!`, "Seu negócio está ficando digital. Vamos dar o próximo passo?", `<span class="date-label">${new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(new Date())}</span>`)}<section class="welcome-banner"><div><span class="badge-soft">${icon("stars")} CADA CONEXÃO É UMA POSSIBILIDADE</span><h2>Seu talento já existe.<br>Agora, mostre para o mundo.</h2><p>Uma página com a sua identidade, seus produtos e tudo que seus clientes precisam para encontrar você.</p><a class="btn btn-lime" href="#/pagina">${icon("palette")} Personalizar minha página</a></div><div class="banner-orbit" aria-hidden="true">${icon("cursor-fill")}</div></section>${journeyOverview()}${actionPlanPanel()}<div class="stats">${[
    [
      icon("speedometer2"),
      "Índice digital",
      `${score}<small> / 100</small>`,
      s.diagnostics.length
        ? scoreLevel(score)
        : "Faça seu primeiro diagnóstico",
    ],
    [
      icon("person-check"),
      "Perfil completo",
      `${completeness()}<small>%</small>`,
      "Sua identidade, mais completa",
    ],
    [
      icon("box-seam"),
      "Seu catálogo",
      String(s.products.length + s.services.length),
      `${s.products.length} produtos · ${s.services.length} serviços`,
    ],
    [
      icon("eye"),
      "Visitas locais",
      String(eventCount("profile_view")),
      "Acessos neste navegador",
    ],
  ]
    .map(
      ([ic, label, value, note]) =>
        `<article class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon">${ic}</span></div><div class="stat-value">${value}</div><div class="stat-note">${note}</div></article>`,
    )
    .join(
      "",
    )}</div><div class="dashboard-grid"><div class="stack"><section class="card-box"><div class="row-head"><h3>Seu próximo passo</h3><span class="badge-soft">${done} de ${list.length} concluídos</span></div>${progress((done / list.length) * 100, "Passos concluídos")}<div class="checklist">${list.map((item) => `<a class="checklist-item" href="#/${item.route}"><span class="check-circle ${item.done ? "done" : ""}">${icon(item.done ? "check-lg" : "plus")}</span><div><strong>${item.title}</strong><small>${item.detail}</small></div>${icon("chevron-right")}</a>`).join("")}</div></section><section class="card-box"><div class="row-head"><h3>Atalhos para o seu dia a dia</h3></div><div class="quick-grid"><a class="quick-card" href="#/produtos">${icon("plus-square")}Adicionar produto</a><a class="quick-card" href="#/qr">${icon("qr-code-scan")}Gerar QR Code</a><a class="quick-card" href="#/cartao">${icon("person-vcard")}Meu cartão digital</a></div></section></div><div class="stack"><section class="card-box"><div class="row-head"><h3>Sua jornada digital</h3>${icon("graph-up-arrow")}</div><div class="score-detail">${scoreCard(score)}<div><span class="badge-soft badge-blue">${s.diagnostics.length ? scoreLevel(score) : "Seu ponto de partida"}</span><p class="small" style="margin:12px 0 0">${s.diagnostics.length ? "Um retrato das suas respostas. Cada aprendizado abre uma nova porta." : "Descubra como seu negócio está conectado hoje."}</p></div></div><a class="btn btn-sm w-100" href="#/evolucao">Acompanhar minha evolução</a></section><section class="card-box"><div class="row-head"><h3>Conexões com clientes</h3></div>${[
    ["whatsapp", "whatsapp_click", "Cliques no WhatsApp"],
    ["geo-alt", "location_click", "Cliques em localização"],
  ]
    .map(
      ([ic, event, label]) =>
        `<div class="row-head small"><span class="muted">${icon(ic)} ${label}</span><strong>${eventCount(event as "whatsapp_click" | "location_click")}</strong></div>`,
    )
    .join(
      "",
    )}<p class="small mb-0">Contagem local, sem rastrear pessoas em outros dispositivos.</p></section><section class="tip-card"><strong>${icon("lightbulb")} Uma dica para hoje</strong><p>Uma descrição clara e uma boa foto ajudam seus clientes a entender o que torna seu negócio especial.</p><a href="#/seguranca" class="small d-inline-block mt-3">Aprender a empreender com segurança</a></section></div></div>`;
}
