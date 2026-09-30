import type { AppState } from "../types";
import { questions } from "../data/questions";

export interface PlanAction {
  id: string;
  title: string;
  reason: string;
  minutes: number;
  route: string;
  label: string;
  done: boolean;
}
/** Selection stays tied to the latest diagnosis; completion follows saved work. */
export function actionPlan(s: AppState): PlanAction[] {
  const diagnosis = s.diagnostics.at(-1);
  if (!diagnosis) return [];
  const actions: (PlanAction & { questions: string[] })[] = [
    {
      id: "catalog",
      questions: ["catalog"],
      title: "Cadastre seu primeiro produto ou serviço",
      reason: "Um catálogo ajuda o cliente a entender o que você oferece.",
      minutes: 2,
      route: "produtos",
      label: "Cadastrar produto",
      done: s.products.length + s.services.length > 0,
    },
    {
      id: "page",
      questions: ["site"],
      title: "Prepare sua página digital",
      reason:
        "Personalize sua página e baixe o HTML. A publicação na internet é uma etapa posterior.",
      minutes: 4,
      route: "pagina",
      label: "Preparar minha página",
      done: s.published,
    },
    {
      id: "contact",
      questions: ["whatsapp"],
      title: "Adicione seu contato de atendimento",
      reason:
        "Informe o WhatsApp do negócio para facilitar o contato. Isso não configura o WhatsApp Business por você.",
      minutes: 2,
      route: "perfil",
      label: "Adicionar contato",
      done: !!s.business.whatsapp.trim(),
    },
    {
      id: "twofactor",
      questions: ["twofactor"],
      title: "Aprenda a proteger o acesso às contas",
      reason:
        "Conclua o módulo “Uma camada extra de proteção”. Depois, aplique o aprendizado nos seus aplicativos.",
      minutes: 3,
      route: "seguranca",
      label: "Aprender sobre duas etapas",
      done: s.securityCompleted.includes("twofactor"),
    },
    {
      id: "location",
      questions: ["location", "maps"],
      title: "Informe onde você atende",
      reason:
        "Adicione endereço e cidade ao perfil. O cadastro no Google Maps é feito separadamente.",
      minutes: 2,
      route: "perfil",
      label: "Informar localização",
      done: !!s.business.address.trim() && !!s.business.city.trim(),
    },
    {
      id: "social",
      questions: ["instagram"],
      title: "Conecte seu Instagram ao perfil",
      reason:
        "Adicione o endereço do perfil profissional para os clientes conhecerem seu trabalho.",
      minutes: 2,
      route: "perfil",
      label: "Adicionar Instagram",
      done: !!s.business.instagram.trim(),
    },
    {
      id: "passwords",
      questions: ["passwords"],
      title: "Aprenda a criar senhas seguras",
      reason:
        "Conclua o módulo de senhas e veja como proteger cada conta com uma senha diferente.",
      minutes: 3,
      route: "seguranca",
      label: "Aprender sobre senhas",
      done: s.securityCompleted.includes("passwords"),
    },
    {
      id: "practice",
      questions: ["messages", "links"],
      title: "Pratique a identificação de golpes",
      reason:
        "Complete oito situações fictícias e leia as explicações para reconhecer sinais suspeitos.",
      minutes: 5,
      route: "treinamento",
      label: "Praticar agora",
      done: !!s.quiz,
    },
    {
      id: "backup",
      questions: ["backup"],
      title: "Aprenda a cuidar dos seus dados",
      reason:
        "Conclua o módulo “Cuide dos dados dos clientes”, que inclui cuidados com cópias de segurança.",
      minutes: 3,
      route: "seguranca",
      label: "Aprender sobre cópias seguras",
      done: s.securityCompleted.includes("data"),
    },
  ];
  const priority = (action: (typeof actions)[number]) =>
    Math.max(
      ...action.questions.map((id) => {
        const weight = questions.find((q) => q.id === id)!.weight;
        const answer = Math.max(
          0,
          Math.min(1, Number(diagnosis.answers[id]) || 0),
        );
        return weight * (1 - answer);
      }),
    );
  // Highest weighted gaps first; ties preserve the practical order above.
  return actions.sort((a, b) => priority(b) - priority(a)).slice(0, 3);
}
