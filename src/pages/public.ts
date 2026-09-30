import type { AppState, Product } from "../types";
import { esc, icon, money, safeUrl, safeImage } from "../utils/html";
import { isOpen } from "../services/businessService";
import { brand } from "./landing";
export function whatsappUrl(
  number: string,
  message = "Olá! Conheci seu negócio pela página digital.",
): string {
  const digits = number.replace(/\D/g, "");
  const phone = digits.length <= 11 ? "55" + digits : digits;
  return digits
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : "";
}
export function businessPage(
  s: AppState,
  preview = false,
  exported = false,
): string {
  const b = s.business,
    a = s.appearance,
    contact = whatsappUrl(b.whatsapp),
    primary = /^#[\da-f]{6}$/i.test(a.primary) ? a.primary : "#294b3e",
    secondary = /^#[\da-f]{6}$/i.test(a.secondary) ? a.secondary : "#eaf1e4";
  const radius = { pill: "30px", rounded: "10px", square: "3px" }[
    a.buttonStyle
  ];
  const availableProducts = s.products.filter((p) => p.available),
    availableServices = s.services.filter((p) => p.available);
  return `<div class="public-page theme-${esc(a.theme)} layout-${esc(a.layout)}" style="--business-primary:${primary};--business-secondary:${secondary};--button-radius:${radius}">${!preview && !exported ? `<div class="no-print" style="max-width:680px;margin:0 auto 15px"><a href="/#/pagina" class="btn btn-sm">${icon("pencil")} Editar minha página</a>${s.demo ? '<span class="badge-soft ms-2">Demonstração fictícia</span>' : '<span class="badge-soft ms-2">Prévia neste dispositivo</span>'}</div>` : ""}<main class="public-business" ${!preview ? 'id="main"' : ""}><div class="business-cover">${safeImage(b.cover) ? `<img src="${safeImage(b.cover)}" alt="Capa de ${esc(b.name)}">` : `<div class="cover-pattern">${icon("shop")}</div>`}</div><section class="business-info"><div class="business-logo">${safeImage(b.logo) ? `<img src="${safeImage(b.logo)}" alt="Logo de ${esc(b.name)}">` : icon(b.category === "Barbearia" ? "scissors" : "shop")}</div><h1>${esc(b.name || "Seu negócio")}</h1><p>${esc(b.slogan || b.category || "Sua história começa aqui.")}</p>${b.hours ? `<span class="badge-soft ${isOpen(b) ? "badge-green" : ""}">${icon("clock")} ${isOpen(b) ? "Aberto agora" : "Fora do horário"} · horário deste dispositivo</span>` : ""}<p class="mt-3">${esc(b.description)}</p><div class="business-buttons">${contact ? `<a href="${contact}" target="_blank" rel="noopener noreferrer" data-track="whatsapp_click">${icon("whatsapp")} Fale pelo WhatsApp</a>` : ""}${safeUrl(b.instagram) ? `<a class="secondary" href="${esc(safeUrl(b.instagram))}" target="_blank" rel="noopener noreferrer" data-track="instagram_click">${icon("instagram")} Instagram</a>` : ""}${b.phone ? `<a class="secondary" href="tel:${esc(b.phone.replace(/\D/g, ""))}">${icon("telephone")} Ligar</a>` : ""}</div></section>${availableServices.length ? `<section class="business-section"><h2>Serviços feitos para você</h2>${availableServices.map((item) => `<div class="public-item"><div class="item-image">${icon("scissors")}</div><div><strong>${esc(item.name)}</strong><p>${esc(item.description)}</p><p>${item.duration} min</p></div><span class="item-price">${item.startingPrice ? "A partir de<br>" : ""}${money(item.price)}</span></div>`).join("")}</section>` : ""}${availableProducts.length ? `<section class="business-section"><h2>Conheça nossos produtos</h2>${availableProducts.map((item) => `<a class="public-item" href="${contact ? whatsappUrl(b.whatsapp, `Olá! Tenho interesse em ${item.name}.`) : "#contato"}" ${contact ? 'target="_blank" rel="noopener noreferrer"' : ""} data-track="product_view" data-item-id="${esc(item.id)}"><div class="item-image">${safeImage(item.photo) ? `<img src="${safeImage(item.photo)}" alt="${esc(item.name)}">` : icon("box-seam")}</div><div><strong style="color:#182135">${esc(item.name)}</strong><p>${esc(item.description)}</p></div><span class="item-price">${item.promoPrice !== null ? `<del class="small muted">${money(item.price)}</del><br>${money(item.promoPrice)}` : money(item.price)}</span></a>`).join("")}</section>` : ""}<section class="business-section" id="contato"><h2>Vamos nos encontrar?</h2>${b.address || b.city ? `<p class="small">${icon("geo-alt")} ${esc([b.address, b.city, b.state].filter(Boolean).join(" · "))}</p><a class="small" style="color:var(--business-primary)" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([b.address, b.city, b.state].join(", "))}" target="_blank" rel="noopener noreferrer" data-track="location_click">Ver localização no mapa</a>` : ""}${b.hours ? `<p class="small mt-3">${icon("clock")} ${esc(b.hours)}</p>` : ""}${b.email ? `<p class="small"><a href="mailto:${esc(b.email)}">${esc(b.email)}</a></p>` : ""}${b.payments.length ? `<div class="actions mt-3">${b.payments.map((p) => `<span class="badge-soft">${esc(p)}</span>`).join("")}</div>` : ""}<div class="actions mt-3">${(["facebook", "tiktok"] as const).map((key) => (safeUrl(b[key]) ? `<a class="small" href="${esc(safeUrl(b[key]))}" target="_blank" rel="noopener noreferrer">${icon(key)} ${key === "facebook" ? "Facebook" : "TikTok"}</a>` : "")).join("")}</div></section><footer class="public-footer">Feito com cuidado. Conectado com ${brand}<br>${exported ? "Página independente · Entre em contato diretamente com o negócio." : "Uma iniciativa de tecnologia para a comunidade."}</footer></main>${contact && !preview ? `<a class="public-floating no-print" href="${contact}" target="_blank" rel="noopener noreferrer" aria-label="Conversar no WhatsApp" data-track="whatsapp_click">${icon("whatsapp")}</a>` : ""}</div>`;
}
