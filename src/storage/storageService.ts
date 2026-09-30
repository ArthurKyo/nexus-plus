/** Boundary for a future HTTP repository. Only this file accesses browser storage. */
export class StorageService {
  static get<T>(key: string, fallback: T): T {
    try {
      const value = localStorage.getItem(`nexus:${key}`);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  }
  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`nexus:${key}`, JSON.stringify(value));
    } catch {
      throw new Error(
        "Não foi possível salvar. O armazenamento pode estar cheio ou bloqueado. Exporte uma cópia dos seus dados e reduza o tamanho das fotos.",
      );
    }
  }
  static remove(key: string): void {
    localStorage.removeItem(`nexus:${key}`);
  }
  static clear(): void {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("nexus:"))
      .forEach((k) => localStorage.removeItem(k));
  }
}
