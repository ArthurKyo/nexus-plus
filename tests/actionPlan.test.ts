import { describe, it, expect } from "vitest";
import { actionPlan } from "../src/services/actionPlan";
import { newState } from "../src/data/defaults";
import { questions } from "../src/data/questions";
import {
  calculateScore,
  currentScore,
} from "../src/services/diagnosticService";
function diagnosed(value = 0) {
  const s = newState();
  const answers = Object.fromEntries(questions.map((q) => [q.id, value]));
  s.diagnostics.push({
    id: "test",
    date: "2026-09-30",
    answers,
    score: calculateScore(answers),
    level: "Teste",
  });
  return s;
}
describe("plano personalizado", () => {
  it("não inventa recomendações antes do diagnóstico", () => {
    expect(actionPlan(newState())).toEqual([]);
  });
  it("prioriza lacunas ponderadas e oferece exatamente três tarefas distintas", () => {
    const s = diagnosed();
    expect(actionPlan(s).map((t) => t.id)).toEqual([
      "catalog",
      "page",
      "contact",
    ]);
    s.diagnostics[0].answers.catalog = 1;
    s.diagnostics[0].answers.site = 1;
    expect(actionPlan(s).map((t) => t.id)).toEqual([
      "contact",
      "twofactor",
      "location",
    ]);
  });
  it("mantém a seleção, atualiza conclusão e permite desfazer sem inflar a nota", () => {
    const s = diagnosed();
    const ids = actionPlan(s).map((t) => t.id);
    s.services.push({
      id: "s",
      name: "Corte",
      description: "",
      price: 20,
      startingPrice: false,
      duration: 30,
      category: "",
      available: true,
    });
    s.published = true;
    s.business.whatsapp = "85999999999";
    expect(actionPlan(s).map((t) => t.id)).toEqual(ids);
    expect(actionPlan(s).every((t) => t.done)).toBe(true);
    expect(currentScore(s)).toBe(0);
    s.services = [];
    expect(actionPlan(s)[0].done).toBe(false);
    expect(actionPlan(JSON.parse(JSON.stringify(s)))).toEqual(actionPlan(s));
  });
  it("usa o diagnóstico mais recente e agrupa lacunas com a mesma ação", () => {
    const s = diagnosed(1);
    s.diagnostics.push({
      ...s.diagnostics[0],
      id: "new",
      answers: {
        ...s.diagnostics[0].answers,
        messages: 0,
        links: 0,
        passwords: 0,
        backup: 0,
      },
    });
    expect(actionPlan(s).map((t) => t.id)).toEqual([
      "passwords",
      "practice",
      "backup",
    ]);
    expect(actionPlan(s).every((t) => !t.done)).toBe(true);
    s.securityCompleted = ["passwords", "data"];
    s.quiz = { date: "2026-09-30", answers: [], correct: 0 };
    expect(actionPlan(s).every((t) => t.done)).toBe(true);
  });
  it("ainda oferece três passos de manutenção com todas as respostas positivas", () => {
    expect(actionPlan(diagnosed(1))).toHaveLength(3);
  });
});
