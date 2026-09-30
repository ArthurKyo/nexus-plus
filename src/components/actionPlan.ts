import { state } from "../services/state";
import { actionPlan } from "../services/actionPlan";
import { esc, icon } from "../utils/html";
import { progress } from "./ui";

export function actionPlanPanel(): string {
  const s = state();
  const tasks = actionPlan(s);
  if (!tasks.length)
    return `<section class="card-box action-plan"><h2>Seu próximo passo começa aqui</h2><p>Responda ao diagnóstico para receber três ações para o seu momento.</p><a class="btn btn-primary" href="#/diagnostico">Descobrir meu próximo passo</a></section>`;
  const done = tasks.filter((t) => t.done).length;
  const next = tasks.find((t) => !t.done);
  const needsProfile = !s.business.name;
  const maintenance = Object.values(s.diagnostics.at(-1)!.answers).every(
    (value) => value === 1,
  );
  return `<section class="card-box action-plan" aria-labelledby="action-plan-title"><div class="row-head"><span class="guide-badge">${icon("compass")} SEU PLANO NEXUS+</span><span class="badge-soft">${done} de 3 concluídas</span></div><h2 id="action-plan-title">${done === 3 ? "Três passos dados. Novas possibilidades." : "Pequenos passos. Progresso de verdade."}</h2><p>${maintenance ? "Você relatou boas práticas em todas as áreas. Use estes passos para trazer sua presença digital para a nexus+." : "Três ações priorizadas pelas suas respostas no último diagnóstico. Faça no seu ritmo."}</p>${progress((done / 3) * 100, "Ações do plano concluídas")}${needsProfile ? '<p class="plan-prerequisite">Primeiro, crie seu perfil. Depois, os atalhos abaixo levam diretamente a cada tarefa.</p>' : ""}<ol class="plan-list">${tasks.map((task, i) => `<li class="plan-task ${task.done ? "is-done" : ""}"><span class="plan-number" aria-hidden="true">${task.done ? icon("check-lg") : `0${i + 1}`}</span><div class="plan-content"><div class="plan-meta">${task.done ? "Concluída" : task.id === next?.id ? "Seu próximo passo" : "Na sequência"} · cerca de ${task.minutes} min</div><h3>${esc(task.title)}</h3><p>${esc(task.reason)}</p><div class="actions"><a class="btn btn-sm ${task.id === next?.id ? "btn-primary" : ""}" href="#/${needsProfile ? "cadastro" : task.route}">${needsProfile ? "Criar perfil para começar" : task.done ? "Revisar tarefa" : esc(task.label)} ${icon("arrow-up-right")}</a>${task.id === "catalog" && !needsProfile && !task.done ? '<a class="btn btn-sm" href="#/servicos">Cadastrar serviço</a>' : ""}</div></div></li>`).join("")}</ol><p class="plan-note">Tempos estimados. O progresso acompanha os dados e aprendizados salvos neste navegador. Ele não altera sua nota do diagnóstico nem confirma configurações em outros aplicativos.</p>${done === 3 ? '<a class="btn" href="#/evolucao">Acompanhar evolução e refazer diagnóstico</a>' : ""}</section>`;
}
