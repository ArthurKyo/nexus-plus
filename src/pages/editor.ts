import { state, update } from "../services/state";
import { pageHeader, field, select, toast } from "../components/ui";
import { businessPage } from "./public";
import { bindUploads } from "./profile";
import { esc, icon } from "../utils/html";
import type { Appearance } from "../types";
const themes: Record<
  Appearance["theme"],
  { name: string; primary: string; secondary: string }
> = {
  minimal: { name: "Minimal", primary: "#263a46", secondary: "#f0f3f5" },
  modern: { name: "Modern", primary: "#294b3e", secondary: "#eaf1e4" },
  classic: { name: "Classic", primary: "#71462d", secondary: "#f1e9dd" },
  vibrant: { name: "Vibrant", primary: "#6332b4", secondary: "#f3d2ff" },
};
export function editor(): string {
  const s = state(),
    a = s.appearance;
  return `${pageHeader("Uma página com a sua identidade.", "Escolha seu estilo e acompanhe cada mudança em tempo real.", `<a class="btn" href="#/publica">${icon("box-arrow-up-right")} Abrir prévia</a>`)}<div class="editor-grid"><div class="stack"><section class="card-box"><h3 class="mb-3">Comece com um estilo</h3><p class="small">O mesmo negócio, novas formas de se apresentar.</p><div class="theme-options">${Object.entries(
    themes,
  )
    .map(
      ([key, t]) =>
        `<button class="theme-option" data-theme-preset="${key}" aria-pressed="${a.theme === key}"><div class="theme-swatch" style="--swatch:${t.primary};--swatch2:${t.secondary}"></div>${t.name}</button>`,
    )
    .join(
      "",
    )}</div></section><section class="card-box"><h3 class="mb-4">Os detalhes fazem a diferença</h3><form id="appearance-form"><div class="form-grid">${field("primary", "Cor principal", a.primary, "color")}${field("secondary", "Cor secundária", a.secondary, "color")}<div class="field"><label for="buttonStyle">Estilo dos botões</label><select name="buttonStyle" id="buttonStyle">${[
    ["rounded", "Arredondado"],
    ["pill", "Pílula"],
    ["square", "Reto"],
  ]
    .map(
      ([v, t]) =>
        `<option value="${v}" ${a.buttonStyle === v ? "selected" : ""}>${t}</option>`,
    )
    .join(
      "",
    )}</select></div><div class="field"><label for="layout">Espaçamento</label><select name="layout" id="layout"><option value="comfortable" ${a.layout === "comfortable" ? "selected" : ""}>Confortável</option><option value="compact" ${a.layout === "compact" ? "selected" : ""}>Compacto</option></select></div><div class="field wide"><label for="editor-slogan">Seu slogan</label><input id="editor-slogan" name="slogan" value="${esc(s.business.slogan)}" maxlength="160"></div></div></form><div class="notice" id="contrast-note">${icon("eye")} Escolha uma cor principal escura para manter os textos dos botões legíveis.</div></section><section class="card-box"><h3 class="mb-4">Imagens do seu negócio</h3><div class="form-grid">${["logo", "cover"].map((name, i) => `<div class="field"><label for="editor-${name}">${i ? "Foto de capa" : "Logo ou foto"}</label><input id="editor-${name}" type="file" data-upload="${name}" accept="image/png,image/jpeg,image/webp"><span class="field-help">JPG, PNG ou WebP · Até 5 MB</span></div>`).join("")}</div></section><section class="card-box"><h3>Pronta para sair daqui?</h3><p class="small">Sua prévia funciona neste navegador. Baixe uma página HTML independente para enviar como arquivo ou hospedar. Depois informe o endereço publicado para usar no QR Code.</p><div class="actions"><button class="btn btn-primary" data-action="export-page">${icon("download")} Baixar minha página</button><a class="btn" href="#/qr">Preparar compartilhamento</a></div></section></div><aside class="editor-preview"><span class="badge-soft mb-3">${icon("phone")} PRÉVIA AO VIVO</span><div class="phone"><div class="phone-content" id="live-preview" tabindex="0" role="region" aria-label="Prévia da página do negócio">${businessPage(s, true)}</div></div><p class="small mt-3">${icon("cloud-check")} Alterações salvas automaticamente</p></aside></div>`;
}
export function refreshPreview(): void {
  const preview = document.getElementById("live-preview");
  if (preview) {
    const scroll = preview.parentElement!.scrollTop;
    preview.innerHTML = businessPage(state(), true);
    preview.parentElement!.scrollTop = scroll;
    preview.querySelectorAll("a").forEach((a) => {
      a.tabIndex = -1;
      a.addEventListener("click", (e) => e.preventDefault());
    });
  }
  const primary = state().appearance.primary;
  const rgb = primary
    .match(/\w\w/g)
    ?.map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)) ?? [
    0, 0, 0,
  ];
  const contrast =
    1.05 / (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] + 0.05);
  const note = document.getElementById("contrast-note");
  if (note) {
    note.textContent =
      contrast < 4.5
        ? "A cor está clara demais para o texto branco. Escolha uma cor mais escura para melhorar a leitura."
        : "Boa escolha: a cor principal oferece contraste adequado com texto branco.";
    note.style.color = contrast < 4.5 ? "var(--warning)" : "var(--success)";
  }
}
export function bindEditor(): void {
  const form = document.getElementById(
    "appearance-form",
  ) as HTMLFormElement | null;
  if (!form) return;
  form.addEventListener("submit", (e) => e.preventDefault());
  form.addEventListener("input", () => {
    const values = new FormData(form);
    update((s) => {
      s.appearance.primary = String(values.get("primary"));
      s.appearance.secondary = String(values.get("secondary"));
      s.appearance.buttonStyle = String(
        values.get("buttonStyle"),
      ) as Appearance["buttonStyle"];
      s.appearance.layout = String(
        values.get("layout"),
      ) as Appearance["layout"];
      s.business.slogan = String(values.get("slogan"));
    });
    refreshPreview();
  });
  document
    .querySelectorAll<HTMLButtonElement>("[data-theme-preset]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        const theme = button.dataset.themePreset as Appearance["theme"];
        update((s) => {
          s.appearance.theme = theme;
          s.appearance.primary = themes[theme].primary;
          s.appearance.secondary = themes[theme].secondary;
        });
        (form.elements.namedItem("primary") as HTMLInputElement).value =
          themes[theme].primary;
        (form.elements.namedItem("secondary") as HTMLInputElement).value =
          themes[theme].secondary;
        document
          .querySelectorAll("[data-theme-preset]")
          .forEach((b) =>
            b.setAttribute(
              "aria-pressed",
              String((b as HTMLElement).dataset.themePreset === theme),
            ),
          );
        refreshPreview();
      }),
    );
  bindUploads(refreshPreview);
  refreshPreview();
}
