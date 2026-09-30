import { state } from "./state";
import { intervention } from "./diagnosticService";
interface WebTool {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown;
}
interface ModelDocument extends Document {
  modelContext?: {
    registerTool: (
      tool: WebTool,
      options?: { signal: AbortSignal },
    ) => void | Promise<void>;
  };
}
/** Optional progressive enhancement. No data is sent unless a browser agent calls a tool. */
export function registerWebTools(): void {
  const context = (document as ModelDocument).modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  window.addEventListener("pagehide", () => lifecycle.abort(), { once: true });
  const tools: WebTool[] = [
    {
      name: "nexus_read_progress",
      title: "Ler progresso digital",
      description:
        "Lê contagens locais e resultados de diagnóstico. Não retorna contatos, imagens ou dados da equipe.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input) {
        if (
          typeof input !== "object" ||
          input === null ||
          Array.isArray(input) ||
          Object.keys(input).length
        )
          throw new Error("Use um objeto vazio.");
        return { demo: state().demo, ...intervention() };
      },
    },
    {
      name: "nexus_start_diagnostic",
      title: "Abrir diagnóstico digital",
      description:
        "Abre o questionário existente. Não responde perguntas nem concede consentimento.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (
          typeof input !== "object" ||
          input === null ||
          Array.isArray(input) ||
          Object.keys(input).length
        )
          throw new Error("Use um objeto vazio.");
        location.href = "/#/diagnostico";
        return { route: "/#/diagnostico", status: "opened" };
      },
    },
  ];
  for (const tool of tools) {
    try {
      void Promise.resolve(
        context.registerTool(tool, { signal: lifecycle.signal }),
      ).catch(() => {
        /* Optional API: the visible application remains available. */
      });
    } catch {
      /* Unsupported experimental implementation: normal UI remains available. */
    }
  }
}
