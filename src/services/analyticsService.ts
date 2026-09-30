import { state, update } from "./state";
import type { Analytics } from "../types";
export function track(type: Analytics["type"], itemId?: string): void {
  if (!state().consent?.accepted && !state().demo) return;
  update((s) => {
    s.analytics.push({
      id: crypto.randomUUID(),
      type,
      date: new Date().toISOString(),
      ...(itemId ? { itemId } : {}),
    });
    s.analytics = s.analytics.slice(-2000);
  });
}
export const eventCount = (type: Analytics["type"]): number =>
  state().analytics.filter((e) => e.type === type).length;
