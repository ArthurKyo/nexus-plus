import { questions } from "../data/questions";
import { state, update } from "./state";
import type { AppState, Diagnostic, Intervention } from "../types";
export const scoreLevel = (score: number): string =>
  score <= 25
    ? "Iniciante"
    : score <= 50
      ? "Em desenvolvimento"
      : score <= 75
        ? "Conectado"
        : "Digitalmente preparado";
export function calculateScore(answers: Record<string, number>): number {
  const sum = questions.reduce(
    (n, q) =>
      n + q.weight * Math.max(0, Math.min(1, Number(answers[q.id]) || 0)),
    0,
  );
  return Math.round((sum / questions.reduce((n, q) => n + q.weight, 0)) * 100);
}
export function finishDiagnostic(): Diagnostic {
  const answers = { ...state().diagnosticDraft };
  if (questions.some((q) => !(q.id in answers)))
    throw new Error("Responda todas as perguntas para concluir.");
  const score = calculateScore(answers);
  const result = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    answers,
    score,
    level: scoreLevel(score),
  };
  update((s) => {
    s.diagnostics.push(result);
    s.diagnosticDraft = {};
    s.diagnosticStep = 0;
    if (!s.baseline)
      s.baseline = {
        site: answers.site === 1,
        catalog: answers.catalog === 1,
        social: answers.instagram === 1,
        security: answers.twofactor === 1 && answers.passwords === 1,
        qr: false,
      };
  });
  return result;
}
/** Reported maturity only changes when a participant answers a new diagnosis. */
export function currentScore(s: AppState = state()): number {
  return s.diagnostics.at(-1)?.score ?? 0;
}
export function recommendations(s: AppState = state()) {
  const a = s.diagnostics.at(-1)?.answers ?? {};
  return questions
    .filter((q) => (a[q.id] ?? 0) < 1)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 4);
}
export function intervention(s: AppState = state()): Intervention {
  return {
    date: s.diagnostics[0]?.date ?? "",
    initialScore: s.diagnostics[0]?.score ?? 0,
    currentScore: currentScore(s),
    profileCreated: !!s.business.name,
    productCount: s.products.length,
    serviceCount: s.services.length,
    qrGenerated: s.qrGenerated,
    modulesCompleted: s.securityCompleted.length,
    trainingScore: s.quiz ? Math.round((s.quiz.correct / 8) * 100) : null,
  };
}
