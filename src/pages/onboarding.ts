import { state, update } from "../services/state";
import { saveBusiness } from "../services/businessService";
import { flowShell } from "../components/shell";
import { field, select, textarea, progress, toast } from "../components/ui";
import { esc, icon } from "../utils/html";
import { validateForm } from "../utils/validation";
export const categories = [
  "Selecione uma categoria",
  "Alimentação",
  "Barbearia",
  "Beleza e bem-estar",
  "Artesanato",
  "Comércio",
  "Serviços profissionais",
  "Organização comunitária",
  "Outros",
];
const steps = [
  "Bem-vindo",
  "Sobre seu negócio",
  "Contato",
  "Presença digital",
  "Objetivos",
];
export function onboarding(): string {
  const s = state(),
    b = s.business,
    step = Math.min(s.onboardingStep, 4);
  let content = "";
  if (step === 0)
    content = `<div class="feature-icon">${icon("shop")}</div><h2>Vamos apresentar o seu negócio?</h2><p>Conte um pouco sobre você. Não precisa preencher tudo agora: depois, você pode completar seu perfil.</p>${field("owner", "Como podemos chamar você?", b.owner, "text", "required")}`;
  if (step === 1)
    content = `<h2>O que torna seu negócio especial?</h2><div class="form-grid">${field("name", "Nome do negócio", b.name, "text", "required", "", true)}${select("category", "Categoria", categories, b.category || categories[0], true)}${textarea("description", "Conte um pouco sobre seu trabalho", b.description)}</div>`;
  if (step === 2)
    content = `<h2>Como seus clientes encontram você?</h2><div class="form-grid">${field("whatsapp", "WhatsApp com DDD", b.whatsapp, "tel", "", "Exemplo: 85999999999", true)}${field("city", "Cidade", b.city)}${field("state", "Estado (UF)", b.state)}${field("email", "Email", b.email, "email", "", "Opcional", true)}</div>`;
  if (step === 3)
    content = `<h2>Vamos conectar sua presença digital.</h2><p>Se ainda não tiver redes sociais, pode continuar sem preencher.</p><div class="form-grid">${field("instagram", "Link do Instagram", b.instagram, "url", "", "Exemplo: https://instagram.com/seunegocio", true)}${field("facebook", "Link do Facebook", b.facebook, "url", "", "Opcional", true)}</div>`;
  if (step === 4)
    content = `<h2>O que você quer conquistar?</h2><p>Escolha os objetivos que mais combinam com seu momento.</p><div class="answer-options">${["Ser encontrado", "Organizar meu catálogo", "Receber mais contatos", "Aprender segurança digital"].map((goal) => `<label class="answer-option"><input type="checkbox" name="goals" value="${goal}" ${b.goals.includes(goal) ? "checked" : ""}>${goal}</label>`).join("")}</div>`;
  return flowShell(
    `<div class="row-head"><span class="eyebrow mb-0">${steps[step]}</span><span class="small muted">Etapa ${step + 1} de 5</span></div>${progress(((step + 1) / 5) * 100, "Cadastro do negócio")}<form id="onboarding-form" novalidate class="mt-4">${content}<div class="form-actions"><button class="btn" type="button" data-action="onboarding-back" ${step === 0 ? "disabled" : ""}>Voltar</button><button class="btn btn-primary" type="submit">${step === 4 ? "Abrir meu espaço" : "Continuar"}</button></div><p class="small mt-3 mb-0">${icon("cloud-check")} Seu progresso fica salvo neste dispositivo.</p></form>`,
    "Seu negócio",
  );
}
export function bindOnboarding(render: () => void): void {
  const form = document.getElementById(
    "onboarding-form",
  ) as HTMLFormElement | null;
  if (!form) return;
  form.addEventListener("input", () => {
    const data = new FormData(form);
    update((s) => {
      for (const [key, value] of data) {
        if (key !== "goals" && key in s.business)
          (s.business as unknown as Record<string, unknown>)[key] =
            String(value);
      }
      if (s.onboardingStep === 4)
        s.business.goals = data.getAll("goals").map(String);
    });
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const step = state().onboardingStep;
    if (
      !validateForm(
        form,
        step === 0
          ? { owner: ["required"] }
          : step === 1
            ? { name: ["required"] }
            : step === 2
              ? { whatsapp: ["phone"], email: ["email"] }
              : step === 3
                ? { instagram: ["url"], facebook: ["url"] }
                : {},
      )
    )
      return;
    if (step === 1 && state().business.category === categories[0]) {
      toast("Escolha uma categoria para o seu negócio.", true);
      return;
    }
    if (step === 4) {
      saveBusiness({
        createdAt: state().business.createdAt || new Date().toISOString(),
      });
      toast("Seu espaço está pronto. Bem-vindo à nexus+!");
      location.hash = "/dashboard";
    } else {
      update((s) => {
        s.onboardingStep++;
      });
      render();
    }
  });
}
