import { describe, it, expect } from "vitest";
import { calculateScore, scoreLevel } from "../src/services/diagnosticService";
import { questions } from "../src/data/questions";
import { validate } from "../src/utils/validation";
import { esc, safeUrl, safeImage } from "../src/utils/html";
import { newBusiness } from "../src/data/defaults";
import { isOpen } from "../src/services/businessService";
import { createDemo } from "../src/data/demo";
const answers = (n: number) =>
  Object.fromEntries(questions.map((q) => [q.id, n]));
describe("diagnóstico ponderado", () => {
  it("calcula os extremos e meio sem inflar resultados", () => {
    expect(calculateScore(answers(0))).toBe(0);
    expect(calculateScore(answers(0.5))).toBe(50);
    expect(calculateScore(answers(1))).toBe(100);
  });
  it("respeita pesos e limita entradas fora do intervalo", () => {
    expect(calculateScore({ site: 1 })).toBe(12);
    expect(calculateScore({ instagram: 1 })).toBe(8);
    expect(calculateScore(answers(9))).toBe(100);
    expect(calculateScore(answers(-1))).toBe(0);
  });
  it.each([
    [0, "Iniciante"],
    [25, "Iniciante"],
    [26, "Em desenvolvimento"],
    [50, "Em desenvolvimento"],
    [51, "Conectado"],
    [75, "Conectado"],
    [76, "Digitalmente preparado"],
    [100, "Digitalmente preparado"],
  ])("classifica %s", (n, label) => expect(scoreLevel(Number(n))).toBe(label));
  it("mantém o exemplo coerente com suas respostas", () => {
    const d = createDemo().diagnostics[0];
    expect(calculateScore(d.answers)).toBe(d.score);
  });
});
describe("validação e conteúdo seguro", () => {
  it("valida campos de contato brasileiros", () => {
    expect(validate("85999999999", ["phone"])).toBe("");
    expect(validate("+55 (85) 99999-9999", ["phone"])).toBe("");
    expect(validate("12", ["phone"])).not.toBe("");
    expect(validate("60000-000", ["cep"])).toBe("");
    expect(validate("600", ["cep"])).not.toBe("");
  });
  it("rejeita email, preço e URLs inválidos", () => {
    expect(validate("x@y.com", ["email"])).toBe("");
    expect(validate("x@y", ["email"])).not.toBe("");
    expect(validate("-1", ["price"])).not.toBe("");
    expect(validate("Infinity", ["price"])).not.toBe("");
    expect(validate("javascript:alert(1)", ["url"])).not.toBe("");
    expect(validate("", ["required"])).not.toBe("");
  });
  it("escapa ataques antes de renderizar", () => {
    expect(esc('<img src=x onerror="alert(1)">')).toBe(
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
    );
    expect(safeUrl("javascript:alert(1)")).toBe("");
    expect(safeUrl("https://example.com")).toBe("https://example.com/");
    expect(safeImage('data:image/svg+xml,<svg onload="alert(1)">')).toBe("");
  });
});
describe("horários do negócio", () => {
  it("calcula o status em um dia de funcionamento", () => {
    const b = newBusiness();
    expect(isOpen(b, new Date(2026, 8, 28, 10, 0))).toBe(true);
    expect(isOpen(b, new Date(2026, 8, 28, 18, 0))).toBe(false);
    expect(isOpen(b, new Date(2026, 8, 27, 10, 0))).toBe(false);
  });
  it("suporta o turno que termina no dia seguinte", () => {
    const b = newBusiness();
    b.openDays = [1];
    b.openTime = "22:00";
    b.closeTime = "02:00";
    expect(isOpen(b, new Date(2026, 8, 28, 23))).toBe(true);
    expect(isOpen(b, new Date(2026, 8, 29, 1))).toBe(true);
    expect(isOpen(b, new Date(2026, 8, 29, 23))).toBe(false);
  });
});
