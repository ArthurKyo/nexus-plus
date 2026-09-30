import { state } from "../services/state";
import {
  saveProduct,
  saveService,
  deleteItem,
} from "../services/productService";
import {
  field,
  textarea,
  pageHeader,
  emptyState,
  toast,
  confirmDialog,
} from "../components/ui";
import { validateForm } from "../utils/validation";
import { readImage } from "../utils/images";
import { esc, icon, money, safeImage } from "../utils/html";
import type { Product, Service } from "../types";
export type CatalogKind = "products" | "services";
export function catalog(kind: CatalogKind): string {
  const products = kind === "products";
  return `${pageHeader(products ? "Seu catálogo de produtos." : "Seu talento em forma de serviço.", products ? "Apresente seus produtos e facilite a escolha dos seus clientes." : "Organize o que você oferece, com preços e informações claras.", `<button class="btn btn-primary" data-action="add-${kind}">${icon("plus-lg")} Adicionar ${products ? "produto" : "serviço"}</button>`)}<div class="catalog-tools"><div class="search-wrap">${icon("search")}<input class="search-input" id="catalog-search" type="search" aria-label="Pesquisar no catálogo" placeholder="Pesquisar ${products ? "produto" : "serviço"}…"></div><select class="filter-select" id="catalog-category" aria-label="Filtrar por categoria"><option value="">Todas as categorias</option>${[
    ...new Set(
      state()
        [kind].map((p) => p.category)
        .filter(Boolean),
    ),
  ]
    .map((c) => `<option>${esc(c)}</option>`)
    .join(
      "",
    )}</select><select class="filter-select" id="catalog-availability" aria-label="Filtrar por disponibilidade"><option value="all">Todos os itens</option><option value="yes">Disponíveis</option><option value="no">Indisponíveis</option></select><select class="filter-select" id="catalog-sort" aria-label="Ordenar catálogo"><option value="name">Nome A–Z</option><option value="low">Menor preço</option><option value="high">Maior preço</option></select></div><div id="catalog-results" aria-live="polite">${catalogItems(kind)}</div>`;
}
export function catalogItems(
  kind: CatalogKind,
  query = "",
  category = "",
  sort = "name",
  availability = "all",
): string {
  const items = state()
    [kind].filter(
      (p) =>
        (p.name + " " + p.description)
          .toLocaleLowerCase("pt-BR")
          .includes(query.toLocaleLowerCase("pt-BR")) &&
        (!category || p.category === category) &&
        (availability === "all" || p.available === (availability === "yes")),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name, "pt-BR")
        : sort === "low"
          ? a.price - b.price
          : b.price - a.price,
    );
  if (!items.length)
    return emptyState(
      state()[kind].length
        ? "Nenhum resultado encontrado."
        : `Você ainda não cadastrou nenhum ${kind === "products" ? "produto" : "serviço"}.`,
      state()[kind].length
        ? "Tente outro nome ou ajuste os filtros."
        : "Vamos mostrar aos seus clientes o que você faz de melhor?",
      state()[kind].length
        ? "Limpar filtros"
        : `Adicionar meu primeiro ${kind === "products" ? "produto" : "serviço"}`,
      state()[kind].length ? "clear-filters" : `add-${kind}`,
      kind === "products" ? "box-seam" : "scissors",
    );
  return `<div class="catalog-grid">${items.map((item) => itemCard(item, kind)).join("")}</div><p class="small muted mt-3">${items.length} ${items.length === 1 ? "item encontrado" : "itens encontrados"}</p>`;
}
function itemCard(item: Product | Service, kind: CatalogKind): string {
  const p = item as Product,
    s = item as Service;
  return `<article class="product-card"><div class="product-visual">${kind === "products" && safeImage(p.photo) ? `<img src="${safeImage(p.photo)}" alt="${esc(item.name)}">` : icon(kind === "products" ? "box-seam" : "scissors")}</div><div class="product-body"><div class="row-head mb-2"><span class="badge-soft">${esc(item.category || "Geral")}</span><span class="badge-soft ${item.available ? "badge-green" : ""}">${item.available ? "Disponível" : "Pausado"}</span></div><h3>${esc(item.name)}</h3><p>${esc(item.description || "Adicione uma descrição para apresentar este item.")}</p><div class="price">${kind === "services" && s.startingPrice ? "<small>A partir de </small>" : ""}${kind === "products" && p.promoPrice !== null ? `<del>${money(p.price)}</del>${money(p.promoPrice)}` : money(item.price)}</div>${kind === "services" ? `<span class="small muted">${s.duration} minutos</span>` : ""}<div class="product-actions"><button class="btn btn-sm" data-edit-item="${item.id}" data-kind="${kind}">${icon("pencil")} Editar</button><button class="btn btn-sm btn-ghost" data-delete-item="${item.id}" data-kind="${kind}" aria-label="Excluir ${esc(item.name)}">${icon("trash3")}</button></div></div></article>`;
}
export function bindCatalog(kind: CatalogKind): void {
  [
    "catalog-search",
    "catalog-category",
    "catalog-sort",
    "catalog-availability",
  ].forEach((id) => {
    document
      .getElementById(id)
      ?.addEventListener(id === "catalog-search" ? "input" : "change", () =>
        refreshCatalog(kind),
      );
  });
}
export function refreshCatalog(kind: CatalogKind): void {
  const value = (id: string) =>
    (document.getElementById(id) as HTMLInputElement | null)?.value ?? "";
  document.getElementById("catalog-results")!.innerHTML = catalogItems(
    kind,
    value("catalog-search"),
    value("catalog-category"),
    value("catalog-sort"),
    value("catalog-availability"),
  );
}
export function itemDialog(
  kind: CatalogKind,
  id: string | undefined,
  render: () => void,
): void {
  const products = kind === "products",
    existing = state()[kind].find((p) => p.id === id),
    p = existing as Product | undefined,
    s = existing as Service | undefined;
  const dialog = document.createElement("dialog");
  dialog.className = "modal-dialog-native";
  dialog.style.width = "620px";
  dialog.setAttribute("aria-labelledby", "item-dialog-title");
  let photo = products ? (p?.photo ?? "") : "";
  dialog.innerHTML = `<div class="row-head"><h2 id="item-dialog-title">${id ? "Editar" : "Adicionar"} ${products ? "produto" : "serviço"}</h2><button type="button" class="btn icon-btn btn-ghost" data-close-dialog aria-label="Fechar">${icon("x-lg")}</button></div><form id="item-form" novalidate><div class="form-grid">${field("name", "Nome", existing?.name ?? "", "text", "required", "", true)}${textarea("description", "Descrição", existing?.description ?? "")}${field("price", "Preço (R$)", existing?.price ?? "", "number", "required")}${products ? field("promoPrice", "Preço promocional (R$)", p?.promoPrice ?? "", "number", "", "Deixe vazio se não houver promoção.") : field("duration", "Duração em minutos", s?.duration ?? 30, "number", "required")}${field("category", "Categoria", existing?.category ?? "", "text", "", "", true)}${products ? `<div class="field wide"><label for="item-photo">Foto do produto</label><input id="item-photo" type="file" accept="image/png,image/jpeg,image/webp"><span class="field-help">JPG, PNG ou WebP, até 5 MB.</span><div id="item-photo-preview">${safeImage(photo) ? `<img class="image-preview" src="${safeImage(photo)}" alt="Foto atual">` : ""}</div><button class="btn btn-sm btn-ghost" type="button" id="remove-item-photo">Remover foto</button></div>` : `<label class="consent-box field wide"><input type="checkbox" name="startingPrice" ${s?.startingPrice ? "checked" : ""}> Exibir como preço inicial (a partir de)</label>`}<label class="consent-box field wide"><input type="checkbox" name="available" ${existing?.available !== false ? "checked" : ""}> Disponível para clientes</label></div><div class="form-actions"><button class="btn" type="button" data-close-dialog>Cancelar</button><button class="btn btn-primary" type="submit">Salvar ${products ? "produto" : "serviço"}</button></div></form>`;
  document.getElementById("modal-root")!.append(dialog);
  dialog
    .querySelectorAll("[data-close-dialog]")
    .forEach((b) => b.addEventListener("click", () => dialog.close()));
  dialog.addEventListener("close", () => dialog.remove());
  dialog.querySelector("#remove-item-photo")?.addEventListener("click", () => {
    photo = "";
    dialog.querySelector("#item-photo-preview")!.innerHTML = "";
  });
  dialog
    .querySelector<HTMLInputElement>("#item-photo")
    ?.addEventListener("change", async (e) => {
      const input = e.target as HTMLInputElement,
        file = input.files?.[0];
      if (!file) return;
      const submit = dialog.querySelector<HTMLButtonElement>("[type=submit]")!;
      submit.disabled = true;
      try {
        photo = await readImage(file);
        dialog.querySelector("#item-photo-preview")!.innerHTML =
          `<img class="image-preview" src="${photo}" alt="Foto selecionada">`;
      } catch (err) {
        toast(err instanceof Error ? err.message : "Imagem inválida.", true);
      } finally {
        submit.disabled = false;
        input.value = "";
      }
    });
  dialog.querySelector("form")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    if (
      !validateForm(form, {
        name: ["required"],
        price: ["required", "price"],
        ...(products
          ? { promoPrice: ["price"] as "price"[] }
          : { duration: ["required", "price"] as ("required" | "price")[] }),
      })
    )
      return;
    const data = new FormData(form),
      price = Number(data.get("price")),
      promo = data.get("promoPrice");
    if (products && promo !== "" && promo !== null && Number(promo) >= price) {
      const error = form.querySelector('[data-error="promoPrice"]')!;
      error.textContent =
        "O preço promocional deve ser menor que o preço normal.";
      return;
    }
    if (
      !products &&
      (Number(data.get("duration")) <= 0 || Number(data.get("duration")) > 1440)
    ) {
      form.querySelector('[data-error="duration"]')!.textContent =
        "Informe uma duração entre 1 e 1440 minutos.";
      return;
    }
    const common = {
      id: id ?? crypto.randomUUID(),
      name: String(data.get("name")).trim(),
      description: String(data.get("description")).trim(),
      price,
      category: String(data.get("category")).trim(),
      available: data.has("available"),
    };
    try {
      if (products)
        saveProduct({
          ...common,
          promoPrice: promo !== "" && promo !== null ? Number(promo) : null,
          photo,
        });
      else
        saveService({
          ...common,
          startingPrice: data.has("startingPrice"),
          duration: Number(data.get("duration")),
        });
      dialog.close();
      render();
      toast(
        `${products ? "Produto" : "Serviço"} ${id ? "atualizado" : "cadastrado"} com sucesso.`,
      );
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Não foi possível salvar.",
        true,
      );
    }
  });
  dialog.showModal();
}
export async function removeItem(
  kind: CatalogKind,
  id: string,
  render: () => void,
): Promise<void> {
  const item = state()[kind].find((p) => p.id === id);
  if (!item) return;
  if (
    await confirmDialog(
      "Excluir este item?",
      `“${item.name}” será removido do catálogo. Essa ação não pode ser desfeita.`,
      "Excluir",
      true,
    )
  ) {
    deleteItem(kind, id);
    refreshCatalog(kind);
    toast("Item excluído.");
  }
}
