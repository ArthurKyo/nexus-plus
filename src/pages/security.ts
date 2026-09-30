import { state, update } from "../services/state";
import { securityModules, scenarios } from "../data/security";
import { pageHeader, progress, toast } from "../components/ui";
import { esc, icon } from "../utils/html";
export function security(): string {
  const completed = state().securityCompleted;
  return `${pageHeader("Mais confiança em cada conexão.", "Aprenda a proteger suas contas, seu negócio e seus clientes.", `<a class="btn btn-primary" href="#/treinamento">${icon("controller")} Praticar no simulador</a>`)}<section class="card-box mb-4"><div class="row-head"><h3>Sua trilha de segurança digital</h3><span class="badge-soft badge-blue">${Math.round((completed.length / 6) * 100)}% concluído</span></div>${progress((completed.length / 6) * 100, "Segurança digital")}<p class="small mt-3 mb-0">${completed.length} de 6 módulos. Leia, confira os passos e marque o que aprendeu. Concluir um módulo não altera automaticamente seu diagnóstico.</p></section><div class="security-grid">${securityModules.map((m) => `<article class="card-box security-module"><div class="row-head"><div class="feature-icon mb-0">${icon(m.icon)}</div>${completed.includes(m.id) ? '<span class="badge-soft badge-green">Concluído</span>' : ""}</div><h3>${m.title}</h3><p>${m.explanation}</p><details><summary>Veja um exemplo e uma dica</summary><p><strong>Exemplo:</strong> ${m.example}</p><p><strong>Dica:</strong> ${m.tip}</p></details><div class="stack" style="gap:12px;margin:20px 0">${m.checklist.map((check, i) => `<label class="small d-flex gap-2 align-items-start"><input type="checkbox" data-module-check="${m.id}" data-check-index="${i}" ${completed.includes(m.id) ? "checked" : ""}> ${check}</label>`).join("")}</div><button class="btn btn-sm ${completed.includes(m.id) ? "" : "btn-primary"}" data-complete-module="${m.id}">${completed.includes(m.id) ? "Reabrir módulo" : "Concluir aprendizado"}</button></article>`).join("")}</div><div class="notice">Conteúdo educativo. As configurações podem variar entre aplicativos. Consulte a ajuda oficial do serviço ao aplicar uma medida. Saiba mais na <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">Cartilha de Segurança para Internet do CERT.br</a>.</div>`;
}
export function training(): string {
  const answers = state().quizDraft,
    index = answers.length,
    done = index >= scenarios.length;
  if (done) {
    const correct = answers.filter(
      (v, i) => v === scenarios[i].suspicious,
    ).length;
    return `${pageHeader("Você deu mais um passo.", "Reconhecer sinais de risco é uma habilidade que melhora com a prática.")}<section class="card-box" style="max-width:680px;margin:auto;text-align:center"><div class="feature-icon mx-auto">${icon("trophy")}</div><h2>${correct} de ${scenarios.length} acertos</h2><p>Treinamento concluído. Não existe proteção perfeita: continue confirmando pedidos e protegendo suas contas.</p>${progress((correct / scenarios.length) * 100, "Acertos no treinamento")}<div class="actions justify-content-center mt-4"><button class="btn btn-primary" data-action="restart-quiz">Praticar novamente</button><a class="btn" href="#/evolucao">Ver minha evolução</a></div><div class="text-start mt-4">${scenarios.map((s, i) => `<details class="notice"><summary>${icon(answers[i] === s.suspicious ? "check-circle" : "exclamation-circle")} Situação ${i + 1} · ${s.suspicious ? "Suspeita" : "Sem sinal evidente de golpe"}</summary><p class="mt-2 small">${s.explanation}</p></details>`).join("")}</div></section>`;
  }
  const q = scenarios[index];
  return `${pageHeader("Você reconhece os sinais?", "Um treino rápido para tomar decisões com mais confiança.")}<section class="card-box" style="max-width:730px;margin:auto"><div class="row-head"><span class="badge-soft">${icon("chat-dots")} SIMULAÇÃO · MENSAGEM FICTÍCIA</span><span class="small muted">${index + 1} de 8</span></div>${progress((index / 8) * 100, "Treinamento")}<div class="quiz-message">“${esc(q.message)}”</div><h3>Como você avaliaria esta mensagem?</h3><div class="actions mt-4" id="quiz-buttons"><button class="btn" data-quiz-answer="false">${icon("shield-check")} Seguro</button><button class="btn btn-primary" data-quiz-answer="true">${icon("shield-exclamation")} Suspeito</button></div><div id="quiz-feedback" aria-live="polite"></div><p class="small mt-4 mb-0">“Seguro” significa sem sinal evidente neste exemplo. O contexto e a identidade de quem envia ainda precisam ser conferidos.</p></section>`;
}
export function completeModule(id: string, render: () => void): void {
  const completed = state().securityCompleted.includes(id);
  if (
    !completed &&
    [
      ...document.querySelectorAll<HTMLInputElement>(
        `[data-module-check="${id}"]`,
      ),
    ].some((c) => !c.checked)
  ) {
    toast("Confira os dois passos antes de concluir este módulo.", true);
    return;
  }
  update((s) => {
    s.securityCompleted = completed
      ? s.securityCompleted.filter((v) => v !== id)
      : [...s.securityCompleted, id];
  });
  render();
  toast(completed ? "Módulo reaberto." : "Mais um aprendizado concluído!");
}
export function answerQuiz(answer: boolean): void {
  const index = state().quizDraft.length,
    q = scenarios[index];
  if (!q || document.querySelector('[data-action="next-quiz"]')) return;
  document
    .querySelectorAll<HTMLButtonElement>("[data-quiz-answer]")
    .forEach((b) => (b.disabled = true));
  const feedback = document.getElementById("quiz-feedback")!;
  feedback.innerHTML = `<div class="quiz-feedback"><strong>${icon(answer === q.suspicious ? "check-circle" : "lightbulb")} ${answer === q.suspicious ? "Boa leitura da situação!" : "Vamos olhar mais de perto."}</strong><p class="mt-2 mb-0">${q.explanation}</p></div><button class="btn btn-primary" data-action="next-quiz" data-answer-value="${answer}">${index === 7 ? "Ver resultado" : "Próxima situação"}</button>`;
}
export function advanceQuiz(answer: boolean): void {
  update((s) => {
    s.quizDraft.push(answer);
    if (s.quizDraft.length === 8)
      s.quiz = {
        date: new Date().toISOString(),
        answers: [...s.quizDraft],
        correct: s.quizDraft.filter((v, i) => v === scenarios[i].suspicious)
          .length,
      };
  });
}
