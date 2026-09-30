import { actionPlanPanel } from "../components/actionPlan";
import { state, update, consent } from "../services/state";
import { questions } from "../data/questions";
import { finishDiagnostic } from "../services/diagnosticService";
import { flowShell } from "../components/shell";
import { button, progress, scoreCard, toast } from "../components/ui";
import { esc, icon } from "../utils/html";
export function diagnostic(): string {
  const s = state();
  if (!s.consent?.accepted)
    return flowShell(
      `<div class="feature-icon">${icon("hand-thumbs-up")}</div><div class="eyebrow">BOAS-VINDAS À NEXUS+</div><h2>Seu negócio tem muito para mostrar.</h2><p>Em 11 perguntas simples, vamos entender seu momento digital e sugerir os próximos passos. Leva cerca de 3 minutos.</p><div class="notice"><strong>Antes de começar</strong><br>Guardamos suas respostas, informações do negócio e imagens apenas neste navegador. Não pedimos documentos. Você pode apagar ou exportar tudo a qualquer momento.</div><label class="consent-box"><input id="consent-checkbox" type="checkbox"><span>Concordo com o armazenamento local para utilizar a nexus+ e li o <a href="#/privacidade">termo de privacidade</a>.</span></label><div class="form-actions">${button("Concordar e começar", "accept-consent", "", "check2")}</div>`,
    );
  const index = Math.min(s.diagnosticStep, questions.length - 1),
    q = questions[index],
    selected = s.diagnosticDraft[q.id];
  return flowShell(
    `<div class="eyebrow">VAMOS CONHECER SEU MOMENTO</div><h2>Como está sua presença digital?</h2><p>Não existe resposta errada. Escolha o que faz sentido para você hoje.</p><div class="question-count">Pergunta ${index + 1} de ${questions.length}</div>${progress((index / questions.length) * 100, "Perguntas respondidas")}<h3 style="margin-top:30px;font-size:1.35rem">${q.text}</h3><p class="small">${q.help}</p><div class="answer-options" role="group" aria-label="Escolha sua resposta">${[
      [1, "Sim, já faço isso", "check-circle"],
      [0.5, "Um pouco / estou aprendendo", "circle-half"],
      [0, "Ainda não / não sei", "circle"],
    ]
      .map(
        ([value, label, ic]) =>
          `<button class="answer-option" data-answer="${value}" aria-pressed="${selected === value}">${icon(String(ic))}${label}</button>`,
      )
      .join(
        "",
      )}</div><div class="form-actions"><button class="btn" data-action="diagnostic-back" ${index === 0 ? "disabled" : ""}>Voltar</button><button class="btn btn-primary" data-action="diagnostic-next" ${selected === undefined ? "disabled" : ""}>${index === questions.length - 1 ? "Ver meu resultado" : "Continuar"}</button></div><p class="small mt-3 mb-0">${icon("cloud-check")} Suas respostas são salvas automaticamente.</p>`,
  );
}
export function diagnosticResult(): string {
  const result = state().diagnostics.at(-1);
  if (!result) return diagnostic();
  return flowShell(
    `<div class="eyebrow">SEU PONTO DE PARTIDA</div><h2>Todo grande caminho começa com um passo.</h2><div class="result-score">${scoreCard(result.score)}<h3 class="mt-3">${esc(result.level)}</h3><p>Seu índice digital, de acordo com suas respostas.</p></div>${actionPlanPanel()}<div class="form-actions"><a class="btn btn-primary" href="#/${state().business.name ? "evolucao" : "cadastro"}">${state().business.name ? "Ver minha evolução" : "Criar meu perfil de negócio"}</a></div>`,
    "Seu resultado",
  );
}
export function diagnosticAction(action: string, render: () => void): boolean {
  if (action === "accept-consent") {
    if (
      !(document.getElementById("consent-checkbox") as HTMLInputElement).checked
    ) {
      toast("Marque a opção para autorizar o armazenamento local.", true);
      return true;
    }
    consent();
    render();
    return true;
  }
  if (action === "diagnostic-back") {
    update((s) => {
      s.diagnosticStep = Math.max(0, s.diagnosticStep - 1);
    });
    render();
    return true;
  }
  if (action === "diagnostic-next") {
    if (!(questions[state().diagnosticStep].id in state().diagnosticDraft))
      return true;
    if (state().diagnosticStep === questions.length - 1) {
      finishDiagnostic();
      location.hash = "/resultado";
    } else {
      update((s) => {
        s.diagnosticStep++;
      });
      render();
    }
    return true;
  }
  return false;
}
