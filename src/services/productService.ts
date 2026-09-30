import { update } from "./state";
import type { Product, Service } from "../types";
export function saveProduct(item: Product): void {
  update((s) => {
    const i = s.products.findIndex((p) => p.id === item.id);
    if (i < 0) s.products.push(item);
    else s.products[i] = item;
  });
}
export function saveService(item: Service): void {
  update((s) => {
    const i = s.services.findIndex((p) => p.id === item.id);
    if (i < 0) s.services.push(item);
    else s.services[i] = item;
  });
}
export function deleteItem(kind: "products" | "services", id: string): void {
  update((s) => {
    if (kind === "products") s.products = s.products.filter((p) => p.id !== id);
    else s.services = s.services.filter((p) => p.id !== id);
  });
}
