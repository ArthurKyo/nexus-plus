import { esc, icon } from "../utils/html";
export function button(
  label: string,
  action: string,
  style = "primary",
  ic = "",
): string {
  return `<button class="btn ${style ? "btn-" + style : ""}" data-action="${esc(action)}">${ic ? icon(ic) : ""}${esc(label)}</button>`;
}
export function toast(message: string, error = false): void {
  const host = document.getElementById("toasts");
  if (!host) return;
  const el = document.createElement("div");
  el.className = `toast-message${error ? " toast-error" : ""}`;
  el.setAttribute("role", error ? "alert" : "status");
  el.innerHTML =
    icon(error ? "exclamation-circle" : "check-circle") + esc(message);
  host.append(el);
  setTimeout(() => el.remove(), 6000);
}
export async function confirmDialog(
  title: string,
  body: string,
  confirmText = "Confirmar",
  danger = false,
): Promise<boolean> {
  const dialog = document.createElement("dialog");
  dialog.className = "modal-dialog-native";
  dialog.setAttribute("aria-labelledby", "dialog-title");
  dialog.innerHTML = `<h2 id="dialog-title">${esc(title)}</h2><p>${esc(body)}</p><div class="actions"><button class="btn" value="cancel">Cancelar</button><button class="btn btn-${danger ? "danger" : "primary"}" value="confirm">${esc(confirmText)}</button></div>`;
  document.getElementById("modal-root")!.append(dialog);
  return new Promise((resolve) => {
    dialog.addEventListener("click", (e) => {
      const b = (e.target as HTMLElement).closest("button");
      if (b) dialog.close(b.value);
    });
    dialog.addEventListener("close", () => {
      resolve(dialog.returnValue === "confirm");
      dialog.remove();
    });
    dialog.showModal();
    (dialog.querySelector("button") as HTMLButtonElement).focus();
  });
}
export function emptyState(
  title: string,
  description: string,
  label: string,
  action: string,
  ic = "box-seam",
): string {
  return `<div class="empty-state">${icon(ic)}<h3>${esc(title)}</h3><p>${esc(description)}</p>${button(label, action)}</div>`;
}
export function progress(value: number, label = "Progresso"): string {
  return `<div class="progress-track" role="progressbar" aria-label="${esc(label)}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill" style="width:${value}%"></div></div>`;
}
export function scoreCard(score: number): string {
  return `<div class="score-ring" style="--score:${score}" role="img" aria-label="Índice digital: ${score} de 100"><div class="score-inside"><strong>${score}</strong><span>de 100 pontos</span></div></div>`;
}
export function field(
  name: string,
  label: string,
  value: unknown = "",
  type = "text",
  rules = "",
  help = "",
  wide = false,
): string {
  const id = `field-${name}`;
  return `<div class="field${wide ? " wide" : ""}"><label for="${id}">${esc(label)}${rules.includes("required") ? ' <span aria-hidden="true">*</span>' : ""}</label><input id="${id}" name="${esc(name)}" type="${type}" value="${esc(value)}" ${rules.includes("required") ? "required" : ""} ${type === "number" ? 'min="0" step="0.01"' : ""} ${type === "text" ? 'maxlength="200"' : ""} aria-describedby="error-${name}${help ? " help-" + name : ""}"><span id="error-${name}" class="field-error" data-error="${name}"></span>${help ? `<span id="help-${name}" class="field-help">${esc(help)}</span>` : ""}</div>`;
}
export function textarea(
  name: string,
  label: string,
  value = "",
  wide = true,
): string {
  return `<div class="field${wide ? " wide" : ""}"><label for="field-${name}">${esc(label)}</label><textarea id="field-${name}" name="${name}" maxlength="1500">${esc(value)}</textarea><span class="field-error" data-error="${name}"></span></div>`;
}
export function select(
  name: string,
  label: string,
  values: string[],
  value = "",
  wide = false,
): string {
  return `<div class="field${wide ? " wide" : ""}"><label for="field-${name}">${esc(label)}</label><select id="field-${name}" name="${name}">${values.map((v) => `<option value="${esc(v)}" ${v === value ? "selected" : ""}>${esc(v)}</option>`).join("")}</select></div>`;
}
export const pageHeader = (
  title: string,
  description: string,
  actions = "",
): string =>
  `<header class="page-header"><div><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${actions}</header>`;
export function setLoading(
  button: HTMLButtonElement,
  loading: boolean,
  label?: string,
): void {
  button.disabled = loading;
  button.setAttribute("aria-busy", String(loading));
  if (loading) {
    button.dataset.original = button.innerHTML;
    button.innerHTML =
      '<span class="loading-spinner" aria-hidden="true"></span> Preparando…';
  } else
    button.innerHTML = label ? esc(label) : (button.dataset.original ?? "");
}
