import { state, update } from "./state";
import type { Business } from "../types";
export function saveBusiness(values: Partial<Business>): void {
  update((s) => Object.assign(s.business, values));
}
export function completeness(): number {
  const b = state().business;
  const fields = [
    b.name,
    b.category,
    b.description,
    b.whatsapp,
    b.city,
    b.hours,
    b.logo,
    b.cover,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}
export function checklist() {
  const s = state();
  return [
    {
      title: "Adicionar uma foto ao perfil",
      detail: "Mostre a identidade do seu negócio",
      done: !!s.business.logo,
      route: "perfil",
    },
    {
      title: "Conectar seu WhatsApp",
      detail: "Facilite a conversa com seus clientes",
      done: !!s.business.whatsapp,
      route: "perfil",
    },
    {
      title: "Informar onde você atende",
      detail: "Ajude as pessoas a encontrarem você",
      done: !!s.business.city && !!s.business.address,
      route: "perfil",
    },
    {
      title: "Criar seu primeiro item",
      detail: "Apresente um produto ou serviço",
      done: s.products.length + s.services.length > 0,
      route: "produtos",
    },
    {
      title: "Gerar seu QR Code",
      detail: "Conecte sua loja à sua página",
      done: s.qrGenerated,
      route: "qr",
    },
  ];
}
export const publicLink = (): string =>
  new URL(
    `${import.meta.env.BASE_URL}negocio.html?id=${encodeURIComponent(state().business.id)}`,
    location.origin,
  ).href;
export function isOpen(b: Business, now = new Date()): boolean {
  const mins = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = b.openTime.split(":").map(Number);
  const [ch, cm] = b.closeTime.split(":").map(Number);
  const start = oh * 60 + om,
    end = ch * 60 + cm;
  if (start === end) return false;
  if (end > start)
    return b.openDays.includes(now.getDay()) && mins >= start && mins < end;
  return (
    (b.openDays.includes(now.getDay()) && mins >= start) ||
    (b.openDays.includes((now.getDay() + 6) % 7) && mins < end)
  );
}
