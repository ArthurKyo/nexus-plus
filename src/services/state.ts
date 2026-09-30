import type { AppState } from "../types";
import { newState } from "../data/defaults";
import { createDemo } from "../data/demo";
import { StorageService } from "../storage/storageService";
let demoMode = StorageService.get<string>("mode", "real") === "demo";
const initial = StorageService.get<AppState | null>(
  demoMode ? "demo" : "state",
  null,
);
let current: AppState = initial?.version === 1 ? initial : newState();
export const state = (): AppState => current;
export function update(change: (draft: AppState) => void): void {
  const draft = structuredClone(current);
  change(draft);
  if (draft.consent?.accepted || draft.demo)
    StorageService.set(draft.demo ? "demo" : "state", draft);
  current = draft;
  window.dispatchEvent(new Event("nexus:saved"));
}
export function enterDemo(): void {
  const demo =
    StorageService.get<AppState | null>("demo", null) ?? createDemo();
  StorageService.set("demo", demo);
  StorageService.set("mode", "demo");
  current = demo;
  demoMode = true;
}
export function exitDemo(): void {
  StorageService.set("mode", "real");
  current = StorageService.get<AppState | null>("state", null) ?? newState();
  demoMode = false;
}
export function erase(): void {
  StorageService.clear();
  current = newState();
  demoMode = false;
}
export function consent(): void {
  update((s) => {
    s.consent = {
      accepted: true,
      date: new Date().toISOString(),
      version: "1.0",
    };
  });
}
