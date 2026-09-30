import { esc, icon } from "../utils/html";
import { state } from "../services/state";
interface Guide {
  title: string;
  short: string;
  text: string;
  steps: string[];
  label: string;
  route: string;
}
const guides: Record<string, Guide> = {
  dashboard: {
    title: "Seu espaço de possibilidades",
    short: "Um passo de cada vez. Comece pelo que falta.",
    text: "Você não precisa configurar tudo de uma vez. Seu checklist mostra o que já está pronto e qual pode ser o próximo passo.",
    steps: [
      "Veja os passos concluídos e escolha uma tarefa em aberto.",
      "Complete seu perfil com informações comerciais.",
      "Monte seu catálogo e personalize a página.",
    ],
    label: "Completar meu perfil",
    route: "perfil",
  },
  perfil: {
    title: "Apresente seu negócio",
    short: "Nome, contato e uma boa descrição fazem a diferença.",
    text: "Pense no que um novo cliente precisa saber: o que você faz, onde atende e como falar com você. Use contatos do negócio, não informações privadas.",
    steps: [
      "Preencha nome, categoria e uma descrição curta.",
      "Adicione um contato, uma foto e seus horários.",
      "Clique em Salvar alterações antes de sair.",
    ],
    label: "Ver como minha página está ficando",
    route: "publica",
  },
  produtos: {
    title: "Mostre o que você vende",
    short: "Comece com um produto. Você pode editar depois.",
    text: "Uma foto clara, um nome fácil de reconhecer e um preço ajudam na escolha. Use a descrição para explicar tamanho, material ou algum detalhe importante.",
    steps: [
      "Clique em Adicionar produto e preencha nome e preço.",
      "Adicione foto e descrição. A promoção é opcional.",
      "Salve. O produto disponível aparece na sua página automaticamente.",
    ],
    label: "Ver a página com meus produtos",
    route: "publica",
  },
  servicos: {
    title: "Dê forma ao seu serviço",
    short: "Explique o que está incluído e quanto tempo leva.",
    text: "Se o preço depende do trabalho, marque a opção “a partir de”. Assim, o cliente entende que aquele é um valor inicial.",
    steps: [
      "Adicione o nome e uma descrição do atendimento.",
      "Informe preço, duração e disponibilidade.",
      "Salve e confira o serviço na sua página.",
    ],
    label: "Ver meus serviços na página",
    route: "publica",
  },
  pagina: {
    title: "Explore a sua identidade",
    short: "Experimente. A prévia muda junto com você.",
    text: "Escolha um tema como ponto de partida e ajuste os detalhes. Suas escolhas são salvas automaticamente. Para ser acessada em outros dispositivos, a página precisa ser exportada e hospedada.",
    steps: [
      "Experimente um dos quatro temas e escolha as cores.",
      "Veja a prévia do celular. Role dentro dela para conferir tudo.",
      "Baixe o HTML da página. Depois de hospedar, configure o QR Code.",
    ],
    label: "Preparar meu QR Code",
    route: "qr",
  },
  qr: {
    title: "Uma câmera, uma conexão",
    short: "O endereço certo é o segredo de um QR que funciona.",
    text: "O QR guarda um endereço, não o cadastro do negócio. A prévia local só conhece os dados deste navegador. Para seus clientes, use a URL da página hospedada.",
    steps: [
      "Exporte sua página HTML e hospede o arquivo.",
      "Informe o endereço publicado, salve e gere o QR Code.",
      "Baixe ou imprima e teste a leitura com outro dispositivo.",
    ],
    label: "Criar meu cartão digital",
    route: "cartao",
  },
  cartao: {
    title: "Pronto para uma boa apresentação",
    short: "Confira seus contatos antes de baixar.",
    text: "O cartão reúne a identidade do seu negócio e um QR Code. Ao atualizar os dados, baixe um novo cartão para compartilhar a versão mais recente.",
    steps: [
      "Confira nome, categoria e contatos na frente e no verso.",
      "Garanta que o QR aponta para um endereço público.",
      "Baixe o PNG ou use a impressão do navegador.",
    ],
    label: "Revisar o endereço do QR",
    route: "qr",
  },
  seguranca: {
    title: "Aprenda a se proteger",
    short: "Leia, confira os passos e pratique.",
    text: "São seis módulos curtos. Você aprende com exemplos, confere um checklist e depois pratica com mensagens fictícias.",
    steps: [
      "Abra o exemplo e a dica de um módulo.",
      "Marque os dois passos que entendeu e conclua o aprendizado.",
      "Pratique no simulador. Cada resposta traz uma explicação.",
    ],
    label: "Praticar no simulador",
    route: "treinamento",
  },
  treinamento: {
    title: "Um lugar seguro para aprender",
    short: "Aqui, errar também ensina.",
    text: "Observe pedidos urgentes, códigos, links e pagamentos. Decida se a mensagem parece segura ou suspeita e leia o motivo antes de continuar.",
    steps: [
      "Leia a mensagem fictícia com calma.",
      "Escolha sua resposta e confira a explicação.",
      "Complete as oito situações para ver seu resultado.",
    ],
    label: "Revisar os módulos",
    route: "seguranca",
  },
  evolucao: {
    title: "Reconheça o seu caminho",
    short: "O índice muda quando você responde de novo.",
    text: "O gráfico compara o primeiro e o último diagnóstico. Já os passos concluídos mostram ações feitas na aplicação. São duas formas diferentes de acompanhar seu progresso.",
    steps: [
      "Observe seu primeiro resultado e os passos concluídos.",
      "Após aprender e colocar em prática, refaça o diagnóstico.",
      "Compare as respostas no histórico e veja seu progresso.",
    ],
    label: "Ver o impacto da intervenção",
    route: "impacto",
  },
  impacto: {
    title: "Resultados com contexto",
    short: "Registre o que aconteceu, sem inflar os números.",
    text: "Os indicadores consideram apenas este cadastro local. Dados de demonstração são fictícios e não devem ser apresentados como atendimentos reais.",
    steps: [
      "Confira os diagnósticos e as atividades registradas.",
      "Preencha as informações da equipe universitária.",
      "Gere o resumo para compor o relatório com as evidências de campo.",
    ],
    label: "Gerar resumo",
    route: "resumo",
  },
  configuracoes: {
    title: "Uma experiência do seu jeito",
    short: "Você escolhe a aparência e o ritmo.",
    text: "Altere o tema, pause os movimentos ou instale a aplicação. Seus dados ficam no navegador: faça uma exportação antes de trocar de dispositivo.",
    steps: [
      "Escolha entre Claro, Escuro e tema do dispositivo.",
      "Pause os efeitos se preferir uma experiência mais tranquila.",
      "Visite Privacidade para exportar ou apagar seus dados.",
    ],
    label: "Gerenciar meus dados",
    route: "privacidade",
  },
  privacidade: {
    title: "Você está no controle",
    short: "Entenda o que é salvo e escolha o que fazer.",
    text: "Os dados ficam neste navegador. A exportação inclui suas informações comerciais; o apagamento remove os dados locais, mas não arquivos já baixados ou publicados.",
    steps: [
      "Leia quais dados são armazenados.",
      "Exporte uma cópia se quiser guardar um registro.",
      "Para retirar o consentimento, use Apagar meus dados.",
    ],
    label: "Voltar ao início",
    route: "",
  },
  equipe: {
    title: "Conecte prática e conhecimento",
    short: "Preencha apenas informações reais do projeto.",
    text: "A equipe deve complementar os registros locais com evidências de campo autorizadas. Os indicadores desta tela não agregam outros participantes ou dispositivos.",
    steps: [
      "Informe instituição, disciplina e integrantes.",
      "Registre comunidade, período e objetivo.",
      "Salve as informações antes de gerar o resumo acadêmico.",
    ],
    label: "Ver impacto da intervenção",
    route: "impacto",
  },
};
export function guideFor(route: string): Guide | undefined {
  return guides[route];
}
export function openGuide(route: string): void {
  const guide = guides[route] ?? {
    title: "Seu próximo passo começa aqui",
    short: "",
    text: "Comece pelo diagnóstico para entender seu momento. Depois, crie seu perfil e aprenda fazendo.",
    steps: [
      "Responda às perguntas com base no que você faz hoje.",
      "Receba recomendações para o seu negócio.",
      "Monte sua página com a ajuda dos guias em cada etapa.",
    ],
    label: "Começar diagnóstico",
    route: "diagnostico",
  };
  if (document.querySelector("dialog[open]")) return;
  const dialog = document.createElement("dialog");
  dialog.className = "modal-dialog-native learning-dialog";
  dialog.setAttribute("aria-labelledby", "guide-title");
  dialog.innerHTML = `<div class="row-head"><span class="guide-badge">${icon("compass")} NEXUS GUIA</span><button class="btn icon-btn btn-ghost" data-guide-close aria-label="Fechar guia">${icon("x-lg")}</button></div><h2 id="guide-title">${esc(guide.title)}</h2><p>${esc(guide.text)}</p><ol class="guide-steps">${guide.steps.map((s, i) => `<li><span>${i + 1}</span><p>${esc(s)}</p></li>`).join("")}</ol><div class="guide-note">${icon("lightbulb")} Você pode abrir este guia a qualquer momento. No computador, pressione <kbd>?</kbd>.</div><div class="actions"><button class="btn" data-guide-close>Entendi, vou experimentar</button>${route === "privacidade" || state().business.name || guide.route === "diagnostico" ? `<a class="btn btn-primary" href="${import.meta.env.BASE_URL}#/${guide.route}">${esc(guide.label)}</a>` : ""}</div>`;
  document.getElementById("modal-root")!.append(dialog);
  dialog
    .querySelectorAll("[data-guide-close]")
    .forEach((b) => b.addEventListener("click", () => dialog.close()));
  dialog.querySelector("a")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => dialog.remove());
  dialog.showModal();
}
export function journeyOverview(): string {
  const s = state();
  const steps = [
    {
      label: "Descobrir",
      route: "evolucao",
      done: s.diagnostics.length > 0,
      icon: "radar",
    },
    {
      label: "Apresentar",
      route: "perfil",
      done: !!s.business.name && !!s.business.whatsapp,
      icon: "shop",
    },
    {
      label: "Criar",
      route: "pagina",
      done: s.products.length + s.services.length > 0,
      icon: "palette",
    },
    { label: "Conectar", route: "qr", done: s.qrGenerated, icon: "broadcast" },
    {
      label: "Evoluir",
      route: "seguranca",
      done: s.securityCompleted.length === 6,
      icon: "stars",
    },
  ];
  return `<nav class="journey-overview no-print" aria-label="Sua jornada digital">${steps.map((step, i) => `<a href="#/${step.route}" class="${step.done ? "completed" : ""}"><span class="journey-overview-icon">${icon(step.done ? "check-lg" : step.icon)}</span><span><small>0${i + 1} ${step.done ? "· Concluído" : ""}</small><strong>${step.label}</strong></span></a>`).join("")}</nav>`;
}
