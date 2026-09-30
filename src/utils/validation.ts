export type Rule = "required" | "email" | "phone" | "url" | "cep" | "price";
export function validate(value: string, rules: Rule[]): string {
  const v = value.trim();
  if (!v) return rules.includes("required") ? "Preencha este campo." : "";
  for (const rule of rules) {
    if (rule === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      return "Informe um email válido.";
    if (rule === "phone" && !/^(?:55)?\d{10,11}$/.test(v.replace(/\D/g, "")))
      return "Informe DDD e número, com 10 ou 11 dígitos.";
    if (rule === "url") {
      try {
        const u = new URL(v);
        if (!["https:", "http:"].includes(u.protocol))
          return "Use um endereço começando com https://.";
      } catch {
        return "Use um endereço completo, como https://exemplo.com.";
      }
    }
    if (rule === "cep" && !/^\d{5}-?\d{3}$/.test(v))
      return "Informe os 8 dígitos do CEP.";
    if (
      rule === "price" &&
      (!Number.isFinite(Number(v)) || Number(v) < 0 || Number(v) > 10000000)
    )
      return "Informe um preço entre 0 e 10 milhões.";
  }
  return "";
}
export function validateForm(
  form: HTMLFormElement,
  schema: Record<string, Rule[]>,
): boolean {
  let valid = true;
  let first: HTMLElement | null = null;
  for (const [name, rules] of Object.entries(schema)) {
    const input = form.elements.namedItem(name) as HTMLInputElement | null;
    if (!input) continue;
    const error = validate(input.value, rules);
    const target = form.querySelector(`[data-error="${name}"]`);
    if (target) target.textContent = error;
    input.setAttribute("aria-invalid", String(!!error));
    if (error) {
      valid = false;
      first ??= input;
    }
  }
  first?.focus();
  return valid;
}
