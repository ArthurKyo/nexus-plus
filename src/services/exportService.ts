import { state } from "./state";
import { businessPage } from "../pages/public";
import { download, esc } from "../utils/html";
import baseCss from "../styles/base.css?inline";
import publicCss from "../styles/public.css?inline";
const appCss = baseCss + publicCss;
import tokenCss from "../styles/tokens.css?inline";
/** Independent page embeds uploaded images and a text fallback for Bootstrap icon glyphs. */
export async function exportBusiness(): Promise<void> {
  const snapshot = structuredClone(state());
  const iconSymbols: Record<string, string> = {
    shop: "⌂",
    scissors: "✂",
    whatsapp: "◉",
    instagram: "◎",
    clock: "◷",
    telephone: "☎",
    "geo-alt": "⌖",
    "box-seam": "◇",
    facebook: "f",
    tiktok: "♪",
  };
  const body = businessPage(snapshot, false, true).replace(
    /<i class="bi bi-([\w-]+)"[^>]*><\/i>/g,
    (_, name: string) =>
      `<span aria-hidden="true">${iconSymbols[name] ?? "+"}</span>`,
  );
  const { exportFontCss } = await import("./exportFonts");
  const css = (exportFontCss + tokenCss + appCss).replace(/@import[^;]+;/g, "");
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(snapshot.business.description)}"><title>${esc(snapshot.business.name)} · Página digital</title><style>${css}body{font-family:var(--font)}.mt-3{margin-top:1rem}.small{font-size:.875rem}@media(max-width:767px){.public-page{padding:0}.public-business{border-radius:0}.business-cover{height:170px}.business-info{padding-inline:20px}.business-section{padding:22px 20px}}.business-info h1{overflow-wrap:anywhere}.business-buttons a{min-height:44px}</style></head><body>${body}</body></html>`;
  download(
    new Blob([html], { type: "text/html;charset=utf-8" }),
    `pagina-${slug(snapshot.business.name)}.html`,
  );
}
export const slug = (v: string): string =>
  v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "meu-negocio";
export function exportData(): void {
  download(
    new Blob(
      [
        JSON.stringify(
          { ...state(), exportedAt: new Date().toISOString() },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    ),
    "nexus-meus-dados.json",
  );
}
export async function share(url: string, title: string): Promise<void> {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return;
  }
  throw new Error(
    "Compartilhamento indisponível. Copie o endereço exibido na página.",
  );
}
