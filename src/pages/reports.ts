import { state, update } from "../services/state";
import { intervention, currentScore } from "../services/diagnosticService";
import { pageHeader, field, textarea, toast } from "../components/ui";
import { esc, icon, date, download } from "../utils/html";
import { brand } from "./landing";
export function evolution(): string {
  const s = state(),
    r = intervention(),
    baseline = s.baseline;
  const now = {
    site: s.published,
    catalog: s.products.length + s.services.length > 0,
    social: !!s.business.instagram,
    qr: s.qrGenerated,
    security: s.securityCompleted.length === 6,
  };
  const rows: [string, boolean, boolean][] = [
    ["Página digital", baseline?.site ?? false, now.site],
    ["Catálogo", baseline?.catalog ?? false, now.catalog],
    ["QR Code", baseline?.qr ?? false, now.qr],
    ["Rede social", baseline?.social ?? false, now.social],
    ["Aprendizado de segurança", baseline?.security ?? false, now.security],
  ];
  return `${pageHeader("Cada passo conta.", "Veja o caminho que seu negócio já percorreu.", `<button class="btn btn-primary" data-action="redo-diagnostic">${icon("arrow-repeat")} Refazer diagnóstico</button>`)}<div class="grid-2"><section class="card-box"><h3>Seu índice digital ao longo do tempo</h3><p class="small">Comparação entre o primeiro e o último diagnóstico respondido.</p><div class="chart" role="img" aria-label="Índice inicial ${r.initialScore} de 100, índice atual ${r.currentScore} de 100"><div class="chart-column"><strong>${r.initialScore}</strong><div class="chart-bar" style="height:${r.initialScore * 1.5}px"></div><span>Primeiro</span></div><div class="chart-column"><strong>${r.currentScore}</strong><div class="chart-bar" style="height:${r.currentScore * 1.5}px"></div><span>Mais recente</span></div></div><div class="notice">${s.diagnostics.length < 2 ? "Responda novamente depois da intervenção para medir a mudança. Seu primeiro resultado permanece preservado." : `Variação de ${r.currentScore - r.initialScore} pontos entre os diagnósticos.`}</div></section><section class="card-box"><h3>O que você construiu</h3><div class="table-wrap"><table class="data-table"><thead><tr><th>Etapa</th><th>Antes</th><th>Agora</th></tr></thead><tbody>${rows.map(([label, before, after]) => `<tr><td>${label}</td><td>${before ? "Sim" : "Ainda não"}</td><td><span class="badge-soft ${after ? "badge-green" : ""}">${after ? "Concluído" : "Em aberto"}</span></td></tr>`).join("")}</tbody></table></div><p class="small mt-3 mb-0">“Página digital” indica exportação da página. “Aprendizado” indica os módulos concluídos, não uma verificação técnica das contas.</p></section></div><section class="card-box mt-4"><div class="row-head"><h3>Seu histórico</h3><a href="#/impacto" class="small">Ver impacto da intervenção</a></div>${s.diagnostics.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Diagnóstico</th><th>Data</th><th>Índice</th><th>Nível</th></tr></thead><tbody>${s.diagnostics.map((d, i) => `<tr><td>${i === 0 ? "Inicial" : `Reavaliação ${i}`}</td><td>${date(d.date)}</td><td>${d.score} / 100</td><td>${esc(d.level)}</td></tr>`).join("")}</tbody></table></div>` : "<p>Seu primeiro diagnóstico aparecerá aqui.</p>"}</section>`;
}
export function impact(): string {
  const s = state(),
    r = intervention();
  return `${pageHeader("Impacto da intervenção.", "Uma visão transparente dos resultados registrados neste dispositivo.", `<button class="btn btn-primary" data-action="summary">${icon("file-earmark-text")} Gerar resumo da intervenção</button>`)}${s.demo ? '<div class="notice">Dados de demonstração. Não utilizar como evidência de atendimento real.</div>' : ""}<div class="stats">${[
    [r.initialScore, "Índice inicial"],
    [r.currentScore, "Índice atual"],
    [s.products.length + s.services.length, "Itens cadastrados"],
    [s.securityCompleted.length + " / 6", "Módulos concluídos"],
  ]
    .map(
      ([v, l]) =>
        `<article class="stat-card"><span class="stat-top">${l}</span><div class="stat-value">${v}</div></article>`,
    )
    .join(
      "",
    )}</div><div class="grid-2"><section class="card-box"><h3>Registro da participação</h3><table class="data-table"><tbody>${[
    ["Negócio", s.business.name || "Não preenchido"],
    ["Primeiro diagnóstico", r.date ? date(r.date) : "Não realizado"],
    ["Perfil criado", r.profileCreated ? "Sim" : "Não"],
    ["Produtos cadastrados", r.productCount],
    ["Serviços cadastrados", r.serviceCount],
    ["QR Code gerado", r.qrGenerated ? "Sim" : "Não"],
    [
      "Treinamento de segurança",
      r.trainingScore === null
        ? "Não concluído"
        : r.trainingScore + "% de acertos",
    ],
    [
      "Consentimento",
      s.consent?.accepted
        ? "Registrado em " + date(s.consent.date)
        : "Não registrado",
    ],
  ]
    .map(([k, v]) => `<tr><th>${k}</th><td>${esc(v)}</td></tr>`)
    .join(
      "",
    )}</tbody></table></section><section class="card-box"><h3>Como interpretar os indicadores</h3><p>O índice digital resume respostas autodeclaradas. A comparação usa o primeiro e o último diagnóstico, sem aumentar a nota por ações feitas no aplicativo.</p><p>Cadastros, exportações e conclusão de módulos são registros locais. Não representam vendas, alcance público nem uma auditoria de segurança.</p><p class="small">Não existem dados agregados de outras pessoas nesta instalação. A equipe deve coletar evidências de campo com consentimento e contexto.</p><a class="btn" href="/equipe.html">${icon("mortarboard")} Dados da equipe</a></section></div>`;
}
export function summary(): string {
  const s = state(),
    r = intervention();
  return `<article class="card-box summary-sheet" id="summary"><div class="row-head">${brand}<span class="badge-soft">${s.demo ? "DEMONSTRAÇÃO FICTÍCIA" : "REGISTRO LOCAL"}</span></div><div class="eyebrow mt-4">TECNOLOGIA E SOCIEDADE</div><h1 style="font-size:2rem">Resumo da intervenção</h1><p>Gerado em ${date(new Date().toISOString())}</p><h3>Contexto acadêmico</h3><table class="data-table"><tbody>${[
    ["Instituição", s.team.institution || "Não informado"],
    ["Disciplina", s.team.subject],
    ["Professor", s.team.professor || "Não informado"],
    ["Turma", s.team.className || "Não informado"],
    ["Equipe", s.team.name || "Não informado"],
    ["Comunidade", s.team.community || "Não informado"],
    ["Período", s.team.period || "Não informado"],
  ]
    .map(([k, v]) => `<tr><th>${k}</th><td>${esc(v)}</td></tr>`)
    .join(
      "",
    )}</tbody></table><h3 class="mt-4">Participação e resultados</h3><p>Negócio: <strong>${esc(s.business.name || "Não informado")}</strong><br>Data do diagnóstico inicial: ${r.date ? date(r.date) : "Não realizado"}</p><table class="data-table"><thead><tr><th>Indicador</th><th>Registro</th></tr></thead><tbody>${[
    ["Índice inicial", r.initialScore + "/100"],
    ["Índice mais recente", r.currentScore + "/100"],
    ["Variação", `${r.currentScore - r.initialScore} pontos`],
    ["Diagnósticos respondidos", s.diagnostics.length],
    ["Perfil criado", r.profileCreated ? "Sim" : "Não"],
    ["Produtos / serviços", r.productCount + " / " + r.serviceCount],
    ["Página exportada", s.published ? "Sim" : "Não"],
    ["QR gerado", r.qrGenerated ? "Sim" : "Não"],
    ["Módulos de segurança", r.modulesCompleted + "/6"],
    [
      "Simulador",
      r.trainingScore === null
        ? "Não concluído"
        : r.trainingScore + "% de acertos",
    ],
  ]
    .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
    .join(
      "",
    )}</tbody></table><h3 class="mt-4">Método e limites</h3><p class="small">Questionário de 11 itens com pesos de 8 a 12 pontos, normalizado para 0–100. Respostas: sim (1), parcialmente (0,5), não (0). Indicadores autodeclarados e registros deste navegador. ${s.diagnostics.length < 2 ? "Ainda não há reavaliação para medir o resultado após a intervenção." : ""} ${s.demo ? "Todos os dados deste resumo são fictícios." : ""}</p><p class="small">Este resumo não contém comprovação de vendas ou pessoas atendidas em campo. As evidências, relatos e autorizações devem ser documentados pela equipe responsável.</p><div class="actions mt-4 no-print"><button class="btn btn-primary" data-action="download-summary">${icon("download")} Baixar resumo HTML</button><button class="btn" data-action="print-summary">${icon("printer")} Imprimir / salvar PDF</button><a class="btn" href="#/impacto">Voltar</a></div></article>`;
}
export function downloadSummary(): void {
  const body = document
    .getElementById("summary")!
    .cloneNode(true) as HTMLElement;
  body.querySelectorAll(".no-print").forEach((e) => e.remove());
  download(
    new Blob(
      [
        `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>nexus+ · Resumo da intervenção</title><style>body{font-family:system-ui,sans-serif;color:#14213b;max-width:850px;margin:40px auto;padding:24px;line-height:1.6}table{width:100%;border-collapse:collapse}td,th{padding:10px;border-bottom:1px solid #ddd;text-align:left}h1,h3{margin-top:30px}.brand{font-size:28px;font-weight:bold}.badge-soft,.eyebrow{font-size:12px}p{color:#526079}@media print{body{margin:0}}</style>${body.outerHTML}</html>`,
      ],
      { type: "text/html;charset=utf-8" },
    ),
    "nexus-resumo-intervencao.html",
  );
}
export function team(): string {
  const s = state(),
    t = s.team,
    r = intervention(),
    participant = s.business.name ? 1 : 0;
  const variation = r.initialScore
    ? `${Math.round(((r.currentScore - r.initialScore) / r.initialScore) * 100)}%`
    : "Não calculável";
  return `${pageHeader("Conhecimento que chega à comunidade.", "Configure as informações da equipe e acompanhe esta instalação.")}<div class="notice">${s.demo ? "Demonstração: os números abaixo são fictícios." : "Escopo local: os indicadores consideram apenas o participante cadastrado neste navegador. Não são totais de uma pesquisa de campo."}</div><div class="stats">${[
    [participant, "Participantes locais"],
    [s.diagnostics.length, "Diagnósticos realizados"],
    [participant, "Perfis criados"],
    [`${r.initialScore} / ${r.currentScore}`, "Média antes / depois"],
  ]
    .map(
      ([v, l]) =>
        `<div class="stat-card"><span class="stat-top">${l}</span><div class="stat-value">${v}</div></div>`,
    )
    .join(
      "",
    )}</div><section class="card-box mb-4"><h3>Evolução relativa do índice: ${variation}</h3><p class="small mb-0">${r.initialScore ? "(Índice atual − índice inicial) ÷ índice inicial × 100." : "Quando o índice inicial é zero ou não há diagnóstico, a variação percentual não é calculada."} Pessoas atendidas em campo: não informado. Não é possível deduzir atendimentos reais de um cadastro local.</p></section><form id="team-form" class="card-box"><h3 class="mb-4">Informações do projeto</h3><div class="form-grid">${field("institution", "Instituição", t.institution)}${field("subject", "Disciplina", t.subject)}${field("professor", "Professor(a)", t.professor)}${field("className", "Turma", t.className)}${field("name", "Nome da equipe", t.name)}${field("period", "Período", t.period)}${textarea("members", "Integrantes", t.members)}${textarea("community", "Comunidade atendida", t.community)}${textarea("objective", "Objetivo da intervenção", t.objective)}</div><div class="form-actions"><button class="btn btn-primary" type="submit">Salvar informações da equipe</button></div></form>`;
}
export function bindTeam(): void {
  const form = document.getElementById("team-form") as HTMLFormElement | null;
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!state().consent?.accepted) {
      toast(
        "Para salvar, autorize o armazenamento em Privacidade e seus dados.",
        true,
      );
      return;
    }
    const data = new FormData(form);
    update((s) => {
      for (const [key, value] of data)
        if (key in s.team)
          (s.team as unknown as Record<string, unknown>)[key] =
            String(value).trim();
    });
    toast("Informações da equipe salvas.");
  });
}
