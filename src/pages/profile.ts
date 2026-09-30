import { state, update } from "../services/state";
import {
  field,
  textarea,
  select,
  pageHeader,
  toast,
  setLoading,
} from "../components/ui";
import { validateForm } from "../utils/validation";
import { readImage } from "../utils/images";
import { categories } from "./onboarding";
import { esc, safeImage, icon } from "../utils/html";
export function profile(): string {
  const b = state().business;
  return `${pageHeader("O seu negócio, do seu jeito.", "Mantenha suas informações atualizadas para facilitar novas conexões.")}<form id="profile-form" class="stack" novalidate><section class="card-box"><h3 class="mb-4">Identidade do negócio</h3><div class="form-grid">${field("name", "Nome do negócio", b.name, "text", "required")}${field("owner", "Seu nome", b.owner)}${select("category", "Categoria", categories, b.category)}${field("slogan", "Slogan", b.slogan)}${textarea("description", "Descrição do negócio", b.description)}${["logo", "cover"].map((name, i) => `<div class="field"><label for="upload-${name}">${i ? "Imagem de capa" : "Logo ou foto do negócio"}</label><input type="file" id="upload-${name}" data-upload="${name}" accept="image/png,image/jpeg,image/webp"><span class="field-help">JPG, PNG ou WebP, até 5 MB. Salva ao selecionar.</span><div id="preview-${name}">${safeImage(b[name as "logo" | "cover"]) ? `<img class="image-preview" src="${safeImage(b[name as "logo" | "cover"])}" alt="${i ? "Capa atual" : "Logo atual"}"><button class="btn btn-sm btn-ghost" type="button" data-remove-image="${name}">Remover imagem</button>` : ""}</div></div>`).join("")}</div></section><section class="card-box"><h3 class="mb-4">Contatos e redes sociais</h3><div class="form-grid">${field("phone", "Telefone", b.phone, "tel", "", "DDD + número")}${field("whatsapp", "WhatsApp", b.whatsapp, "tel", "", "DDD + número")}${field("email", "Email", b.email, "email")}${field("instagram", "Instagram", b.instagram, "url", "", "Link completo com https://")}${field("facebook", "Facebook", b.facebook, "url")}${field("tiktok", "TikTok", b.tiktok, "url")}</div></section><section class="card-box"><h3 class="mb-4">Onde e quando você atende</h3><div class="form-grid">${field("address", "Endereço ou área de atendimento", b.address, "text", "", "Divulgue apenas informações comerciais.", true)}${field("city", "Cidade", b.city)}${field("state", "Estado (UF)", b.state)}${field("cep", "CEP", b.cep, "text", "", "8 dígitos")}${field("hours", "Descrição dos horários", b.hours, "text", "", "Exemplo: Segunda a sexta, das 9h às 18h")}${field("openTime", "Abre às", b.openTime, "time")}${field("closeTime", "Fecha às", b.closeTime, "time")}<div class="field wide"><label>Dias de funcionamento</label><div class="actions">${["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day, i) => `<label class="badge-soft"><input type="checkbox" name="openDays" value="${i}" ${b.openDays.includes(i) ? "checked" : ""}> ${day}</label>`).join("")}</div><span class="field-help">O status aberto/fechado usa estes horários e o horário local do dispositivo.</span></div><div class="field wide"><label>Formas de pagamento</label><div class="actions">${["Pix", "Dinheiro", "Cartão de débito", "Cartão de crédito", "Transferência"].map((p) => `<label class="badge-soft"><input type="checkbox" name="payments" value="${p}" ${b.payments.includes(p) ? "checked" : ""}> ${p}</label>`).join("")}</div></div></div><div class="form-actions"><button class="btn btn-primary" type="submit">${icon("check2")} Salvar alterações</button></div></section></form>`;
}
export function bindProfile(): void {
  const form = document.getElementById(
    "profile-form",
  ) as HTMLFormElement | null;
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (
      !validateForm(form, {
        name: ["required"],
        phone: ["phone"],
        whatsapp: ["phone"],
        email: ["email"],
        instagram: ["url"],
        facebook: ["url"],
        tiktok: ["url"],
        cep: ["cep"],
      })
    )
      return;
    const data = new FormData(form);
    if (data.get("category") === categories[0]) {
      toast("Escolha a categoria do negócio.", true);
      return;
    }
    update((s) => {
      for (const [key, value] of data) {
        if (!["openDays", "payments"].includes(key) && key in s.business)
          (s.business as unknown as Record<string, unknown>)[key] =
            String(value).trim();
      }
      s.business.openDays = data.getAll("openDays").map(Number);
      s.business.payments = data.getAll("payments").map(String);
    });
    toast("Alterações salvas.");
  });
  bindUploads();
}
export function bindUploads(onChange?: () => void): void {
  document
    .querySelectorAll<HTMLInputElement>("[data-upload]")
    .forEach((input) => {
      input.addEventListener("change", async () => {
        const file = input.files?.[0];
        if (!file) return;
        const key = input.dataset.upload as "logo" | "cover";
        input.disabled = true;
        try {
          const image = await readImage(file);
          update((s) => {
            s.business[key] = image;
          });
          const preview = document.getElementById(`preview-${key}`);
          if (preview)
            preview.innerHTML = `<img class="image-preview" src="${image}" alt="Imagem selecionada"><button class="btn btn-sm btn-ghost" type="button" data-remove-image="${key}">Remover imagem</button>`;
          onChange?.();
          toast("Imagem salva.");
        } catch (error) {
          toast(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar a imagem.",
            true,
          );
        } finally {
          input.disabled = false;
          input.value = "";
        }
      });
    });
}
