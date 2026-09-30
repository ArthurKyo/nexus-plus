import QRCode from "qrcode";
import { toPng } from "html-to-image";
import { state, update } from "../services/state";
import { publicLink } from "../services/businessService";
import { track } from "../services/analyticsService";
import { pageHeader, field, toast } from "../components/ui";
import { esc, icon, download, safeUrl, safeImage } from "../utils/html";
import { validateForm } from "../utils/validation";
import { share } from "../services/exportService";
import { brand } from "./landing";
export const shareTarget = (): string =>
  safeUrl(state().publicUrl) || publicLink();
const localWarning = () =>
  `<div class="notice no-print">${icon("info-circle")} ${state().publicUrl ? "Este QR aponta para o endereço publicado informado abaixo. Confira o endereço antes de imprimir." : "Modo local: este endereço só encontra os dados neste navegador. Para clientes em outros dispositivos, hospede o HTML exportado e informe o endereço público abaixo."}</div>`;
export function qrPage(): string {
  return `${pageHeader("Do seu balcão para novas conexões.", "Crie um QR Code para facilitar o acesso à página do seu negócio.")}<div class="grid-2"><section class="card-box text-center" id="qr-print"><span class="eyebrow">${esc(state().business.name)}</span><h2>Aponte a câmera.<br>Conheça nosso negócio.</h2><div class="qr-wrap"><canvas id="qr-canvas" aria-label="QR Code da página do negócio"></canvas></div><p class="small" style="overflow-wrap:anywhere" id="qr-target-text">${esc(shareTarget())}</p><div>${brand}</div><div class="actions justify-content-center mt-4 no-print"><button class="btn btn-primary" data-action="generate-qr">${icon("qr-code")} Gerar QR Code</button><button class="btn" data-action="download-qr" ${!state().qrGenerated ? "disabled" : ""}>${icon("download")} Baixar</button><button class="btn" data-action="print-qr" ${!state().qrGenerated ? "disabled" : ""}>${icon("printer")} Imprimir</button></div></section><section class="card-box no-print"><h3>Qual página seus clientes vão abrir?</h3>${localWarning()}<form id="public-url-form" novalidate>${field("publicUrl", "Endereço da página publicada", state().publicUrl, "url", "", "Exemplo: https://meunegocio.com.br")}<div class="form-actions"><button class="btn" type="submit">Salvar endereço</button></div></form><div class="mt-4"><h3>Ainda não publicou?</h3><p class="small">Baixe sua página em HTML. Esse arquivo contém suas informações e fotos e pode ser hospedado em um serviço de sites estáticos.</p><button class="btn btn-sm" data-action="export-page">${icon("download")} Baixar página HTML</button></div><hr style="border-color:var(--border);margin:24px 0"><button class="btn btn-primary" data-action="share-page">${icon("share")} Compartilhar endereço</button><p class="small mt-3 mb-0">O QR Code não armazena seus dados. Ele abre o endereço configurado.</p></section></div>`;
}
export function cardPage(): string {
  const b = state().business;
  return `${pageHeader("Uma conexão que fica.", "Seu cartão digital, pronto para apresentar o que você faz.")}<div id="card-export" class="grid-2"><section class="business-card"><div class="row-head mb-0"><div class="avatar">${safeImage(b.logo) ? `<img src="${safeImage(b.logo)}" alt="Logo de ${esc(b.name)}">` : icon("shop")}</div>${brand}</div><div><h2>${esc(b.name)}</h2><p>${esc(b.category)}</p></div><span class="small" style="color:#c7ef75">${esc(b.slogan || "Vamos criar novas conexões.")}</span></section><section class="business-card business-card-back"><h3>Seu próximo contato começa aqui.</h3><div class="card-details"><div><p>${icon("whatsapp")} ${esc(b.whatsapp || "WhatsApp não informado")}</p><p>${icon("instagram")} ${esc(b.instagram ? new URL(safeUrl(b.instagram) || "https://instagram.com").pathname : "Instagram não informado")}</p><p style="font-size:.7rem;overflow-wrap:anywhere">${esc(shareTarget())}</p></div><canvas id="card-qr" aria-label="QR Code no cartão"></canvas></div><span class="small">${esc([b.city, b.state].filter(Boolean).join(" · "))}</span></section></div><div class="no-print">${localWarning()}<div class="actions"><button class="btn btn-primary" data-action="download-card">${icon("download")} Baixar cartão PNG</button><button class="btn" data-action="print-card">${icon("printer")} Imprimir cartão</button><a class="btn" href="#/qr">Alterar endereço do QR</a></div></div>`;
}
export async function drawQR(
  id: string,
  target = shareTarget(),
): Promise<void> {
  const canvas = document.getElementById(id) as HTMLCanvasElement | null;
  if (!canvas) return;
  await QRCode.toCanvas(canvas, target, {
    width: 600,
    margin: 4,
    errorCorrectionLevel: "M",
    color: { dark: "#14213b", light: "#ffffff" },
  });
}
export async function bindShare(
  route: string,
  render: () => void,
): Promise<void> {
  await drawQR(route === "qr" ? "qr-canvas" : "card-qr");
  const form = document.getElementById(
    "public-url-form",
  ) as HTMLFormElement | null;
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(form, { publicUrl: ["url"] })) return;
    const value = String(new FormData(form).get("publicUrl") ?? "").trim();
    if (value) {
      const u = new URL(value);
      if (["localhost", "127.0.0.1", "0.0.0.0"].includes(u.hostname)) {
        toast(
          "Informe o endereço hospedado na internet, não o endereço local.",
          true,
        );
        return;
      }
    }
    update((s) => {
      s.publicUrl = value;
      s.qrGenerated = false;
    });
    render();
    toast("Endereço salvo. Gere novamente o QR Code.");
  });
}
export async function shareAction(
  action: string,
  render: () => void,
): Promise<boolean> {
  if (action === "generate-qr") {
    await drawQR("qr-canvas");
    update((s) => {
      s.qrGenerated = true;
    });
    track("qr_generated");
    render();
    toast("QR Code gerado com sucesso.");
    return true;
  }
  if (action === "download-qr") {
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
    download(canvas.toDataURL("image/png"), "nexus-qr-code.png");
    return true;
  }
  if (action === "download-card") {
    const el = document.getElementById("card-export")!;
    const url = await toPng(el, {
      pixelRatio: 2,
      backgroundColor: "#f6f8fc",
      skipFonts: true,
    });
    download(url, "nexus-cartao-digital.png");
    toast("Cartão digital baixado.");
    return true;
  }
  if (action === "share-page") {
    if (!state().publicUrl) {
      toast(
        "Para compartilhar entre dispositivos, informe primeiro o endereço publicado.",
        true,
      );
      return true;
    }
    await share(shareTarget(), state().business.name);
    toast("Endereço pronto para compartilhar.");
    return true;
  }
  if (action === "print-card" || action === "print-qr") {
    const id = action === "print-card" ? "card-export" : "qr-print";
    document.querySelectorAll(".workspace-main > *").forEach((el) => {
      if (el.id !== id && !el.contains(document.getElementById(id)))
        el.classList.add("print-hidden");
    });
    window.print();
    document
      .querySelectorAll(".print-hidden")
      .forEach((el) => el.classList.remove("print-hidden"));
    return true;
  }
  return false;
}
