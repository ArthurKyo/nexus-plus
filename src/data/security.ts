import type { SecurityModule } from "../types";
export const securityModules: SecurityModule[] = [
  {
    id: "whatsapp",
    title: "Proteja seu WhatsApp",
    icon: "whatsapp",
    explanation:
      "Seu atendimento depende da sua conta. Nunca compartilhe o código de registro recebido por SMS.",
    example:
      "Alguém diz ser do suporte e pede um código de seis números. Esse código pode permitir que outra pessoa registre sua conta.",
    tip: "Confira os aparelhos conectados e encerre sessões que você não reconhece.",
    checklist: [
      "Não compartilho códigos de registro.",
      "Sei revisar os aparelhos conectados.",
    ],
  },
  {
    id: "passwords",
    title: "Crie senhas seguras",
    icon: "key",
    explanation:
      "Use senhas longas, únicas e difíceis de adivinhar. Um gerenciador pode ajudar a guardá-las.",
    example:
      "Nome do negócio e ano são fáceis de descobrir. Prefira uma senha gerada aleatoriamente ou uma frase longa e exclusiva.",
    tip: "Não envie senhas por mensagens e nunca reutilize a senha do seu email.",
    checklist: [
      "Uso senhas diferentes em cada serviço.",
      "Guardo senhas em um local seguro.",
    ],
  },
  {
    id: "twofactor",
    title: "Uma camada extra de proteção",
    icon: "shield-lock",
    explanation:
      "A verificação em duas etapas adiciona uma confirmação além da senha.",
    example:
      "Mesmo que alguém descubra sua senha, uma segunda confirmação dificulta o acesso à conta.",
    tip: "Guarde os códigos de recuperação em local seguro. Nunca os envie a terceiros.",
    checklist: [
      "Sei onde procurar a verificação em duas etapas.",
      "Sei guardar os códigos de recuperação.",
    ],
  },
  {
    id: "links",
    title: "Pense antes de clicar",
    icon: "link-45deg",
    explanation:
      "Links podem imitar páginas conhecidas para roubar dados. Um cadeado no navegador, sozinho, não garante legitimidade.",
    example:
      "Uma mensagem promete um prêmio e exige login em um endereço estranho. Abra o aplicativo oficial por conta própria.",
    tip: "Verifique o domínio completo. Se estiver em dúvida, não abra o link.",
    checklist: [
      "Confiro o endereço e o remetente.",
      "Acesso serviços pelo aplicativo ou endereço conhecido.",
    ],
  },
  {
    id: "scams",
    title: "Reconheça os sinais de golpe",
    icon: "chat-square-text",
    explanation:
      "Pressa, ameaça, segredo e pedidos inesperados de pagamento são sinais de atenção.",
    example:
      "Uma pessoa se passa por um fornecedor e informa uma nova chave de pagamento. Confirme em um canal que você já conhece.",
    tip: "Antes de transferir dinheiro, confira destinatário e valor no seu aplicativo.",
    checklist: [
      "Não decido pagamentos sob pressão.",
      "Confirmo pedidos por outro canal.",
    ],
  },
  {
    id: "data",
    title: "Cuide dos dados dos clientes",
    icon: "database-lock",
    explanation:
      "Colete apenas informações necessárias ao atendimento e limite quem pode acessá-las.",
    example:
      "Uma lista de clientes não deve ser compartilhada em grupos. Apague informações que já não são necessárias.",
    tip: "Faça cópias de segurança e teste a recuperação. Proteja também o dispositivo e o arquivo de backup.",
    checklist: [
      "Guardo apenas os dados necessários.",
      "Sei fazer e proteger uma cópia de segurança.",
    ],
  },
];
export const scenarios = [
  {
    message:
      "Central financeira: identificamos uma compra. Clique agora em conta-verificar.exemplo e informe sua senha para cancelar.",
    suspicious: true,
    explanation:
      "Há pressão e um pedido de senha em um link inesperado. Acesse sua conta pelo aplicativo conhecido, sem usar o link.",
  },
  {
    message:
      "Olá! Seu horário de amanhã às 14h está confirmado. Se precisar remarcar, responda por aqui.",
    suspicious: false,
    explanation:
      "Se você reconhece o estabelecimento e marcou esse horário, a mensagem é compatível com uma confirmação. Ela não pede dados sensíveis. Na dúvida, confirme por um canal conhecido.",
  },
  {
    message:
      "Sou do suporte. Envie o código que acabou de chegar no seu celular para evitar o bloqueio da conta.",
    suspicious: true,
    explanation:
      "Nunca compartilhe códigos de verificação. Esse pedido é um sinal forte de tentativa de tomada de conta.",
  },
  {
    message:
      "Ganhe divulgação grátis! Pague uma taxa de R$ 19,90 nos próximos cinco minutos para garantir seu prêmio.",
    suspicious: true,
    explanation:
      "Um prêmio inesperado condicionado a pagamento e urgência é suspeito. Não pague sem verificar a origem.",
  },
  {
    message:
      "Você solicitou a exportação dos seus dados dentro do sistema. O arquivo está disponível no mesmo painel em que fez a solicitação.",
    suspicious: false,
    explanation:
      "Quando corresponde a uma ação que você iniciou, é uma mensagem esperada. Acesse o painel pelo caminho que já conhece.",
  },
  {
    message:
      "Oi, troquei de número. Preciso que você faça uma transferência agora. Não posso falar por telefone.",
    suspicious: true,
    explanation:
      "Mudança de número, urgência e recusa de confirmação são sinais de alerta. Ligue para o contato que você já tinha salvo.",
  },
  {
    message: "Gostei do catálogo. Vocês atendem aos sábados e aceitam Pix?",
    suspicious: false,
    explanation:
      "É uma pergunta comum de um cliente e não solicita informações sensíveis. Continue atento se surgirem links ou comprovantes inesperados.",
  },
  {
    message:
      "Receba esta atualização de segurança. Instale o arquivo anexo fora da loja de aplicativos e desative a proteção do celular.",
    suspicious: true,
    explanation:
      "Desativar proteções e instalar anexos inesperados pode comprometer o dispositivo. Atualize pelos canais oficiais.",
  },
];
