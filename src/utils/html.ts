export function esc(value: unknown): string {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
}
export function icon(name: string): string {
  return `<i class="bi bi-${esc(name)}" aria-hidden="true"></i>`;
}
export const money = (v: number): string =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    v,
  );
export const date = (v: string): string =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(v));
export function safeUrl(value: string): string {
  try {
    const u = new URL(value);
    return ["https:", "http:"].includes(u.protocol) ? u.href : "";
  } catch {
    return "";
  }
}
export function safeImage(value: string): string {
  return /^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(value)
    ? value
    : "";
}
export function download(data: Blob | string, name: string): void {
  const url = typeof data === "string" ? data : URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  if (typeof data !== "string")
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Elemento ausente: ${id}`);
  return el as T;
}
