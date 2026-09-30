# nexus+

**Transformando pequenos negócios através da presença digital.**

Aplicação web de extensão universitária que ajuda pequenos comerciantes, MEIs, profissionais autônomos e organizações comunitárias a entender sua maturidade digital, montar uma página comercial e aprender segurança digital. O projeto usa HTML, CSS, Bootstrap e TypeScript, sem React, Vue, Angular ou backend.

## Objetivo e problema

Pequenos negócios podem ter dificuldade para organizar informações comerciais, divulgar produtos e reconhecer riscos digitais. A nexus+ oferece um percurso guiado, do diagnóstico à criação de materiais de divulgação, preservando os registros necessários para avaliar a intervenção.

## Executar

Requisitos: **Node.js 22.12 ou superior** e npm. Desenvolvimento validado com Node 24.

```bash
npm ci
npm run dev
```

Abra o endereço exibido pelo Vite (normalmente `http://localhost:5173`). Não abra `index.html` diretamente pelo Finder: o código TypeScript precisa do Vite ou do build.

Na página inicial, **Explorar demonstração** abre a Barbearia Central com 3 produtos e 4 serviços fictícios. A demonstração não substitui os dados reais do navegador.

### Produção e PWA

```bash
npm run build
npm run preview
```

Abra `http://localhost:4173`. O build está em `dist/`, com service worker, manifesto, ícones, fontes, estilos e scripts locais. A primeira visita precisa de conexão; depois do cache concluído, as páginas da aplicação funcionam offline. Instalação depende do suporte do navegador, de HTTPS ou localhost e da versão de produção. O modo `npm run dev` não registra o service worker.

Publique **todo o conteúdo de `dist/` na raiz de uma hospedagem estática**. Inclua `negocio.html` e `equipe.html`. O service worker e os caminhos de ativos assumem a raiz `/`; para publicar em subdiretório, adapte a base, o manifesto e o gerador do service worker.

## Funcionalidades

- Landing page com fluxo guiado e demonstração isolada.
- Consentimento e diagnóstico de 11 perguntas com pesos, retomada automática e histórico.
- Onboarding em cinco etapas e perfil comercial completo.
- Produtos e serviços: criação, edição, exclusão confirmada, pesquisa, filtros e ordenação.
- Upload de JPG/PNG/WebP, validação de tipo/tamanho, redução de resolução e preview.
- Quatro temas, duas cores, estilos de botão, espaçamento e prévia móvel ao vivo.
- Página comercial local em `negocio.html?id=...`, contatos, catálogo, horário e pagamentos.
- Exportação de página HTML independente, com imagens incorporadas e sem dependência do aplicativo.
- QR Code real com download PNG, impressão e compartilhamento de endereço publicado.
- Cartão digital com frente/verso, download PNG e impressão.
- Seis módulos educativos e simulador de oito mensagens, com explicações e resultados.
- Evolução, impacto, resumo acadêmico em HTML e impressão/PDF pelo navegador.
- Dados configuráveis da equipe universitária em `equipe.html`.
- Preferências Claro/Escuro/Sistema, PWA e experiência offline.
- Exportação JSON dos dados e exclusão local com retirada do consentimento.

## Limites importantes do armazenamento local

**Uma URL de prévia local não publica os dados na internet.** Enviar `negocio.html?id=...` a outra pessoa não transmite o cadastro. Em um dispositivo sem esse cadastro, a aplicação explica essa limitação.

Para divulgar externamente:

1. Configure o perfil e o catálogo.
2. Na página digital, escolha **Baixar minha página**.
3. Envie o HTML como arquivo ou hospede-o em um serviço estático.
4. Informe o endereço hospedado na área **QR Code**.
5. Gere o QR novamente e teste o endereço antes de imprimir.

Alterações futuras exigem nova exportação e substituição do HTML hospedado. O aplicativo não oferece sincronização, autenticação, publicação automática de cada negócio ou estatísticas entre dispositivos. O endereço informado para o QR não é verificado como pertencente ao usuário.

O cartão e o QR são gerados localmente. A exportação de dados em JSON é um registro/backup para uso técnico; **não há importação de backup na interface nesta versão**. O armazenamento do navegador tem limites de capacidade e pode ser apagado pelo usuário ou pelo sistema. Exporte periodicamente.

## Índice digital e indicadores

As perguntas somam 100 pontos. Respostas: sim = 1; parcialmente = 0,5; não = 0. O índice é a soma ponderada, arredondada para inteiro:

| Índice | Nível                  |
| ------ | ---------------------- |
| 0–25   | Iniciante              |
| 26–50  | Em desenvolvimento     |
| 51–75  | Conectado              |
| 76–100 | Digitalmente preparado |

O índice inicial é o primeiro diagnóstico. O atual é o último diagnóstico concluído. Criar um produto ou concluir um módulo **não altera o índice automaticamente**. A evolução deve ser medida por nova aplicação do questionário. Cadastros, QR e módulos têm indicadores próprios.

Os indicadores da equipe consideram **um participante por perfil local do navegador**, sem inventar atendimentos reais ou totais de campo. A evolução relativa é `(atual − inicial) / inicial × 100`; com índice inicial zero, não é calculada. Dados de demonstração são identificados e não devem ser apresentados como resultados da intervenção.

Os eventos `profile_view`, `whatsapp_click`, `instagram_click`, `location_click`, `product_view` e `qr_generated` são contadores locais, limitados aos 2.000 eventos mais recentes. Não são analytics públicos nem vendas. O status aberto/fechado usa o relógio e fuso do dispositivo; a página HTML exportada é um retrato da exportação.

## Tecnologias

- HTML5 semântico, CSS Variables, layouts Grid/Flex e Bootstrap 5.
- TypeScript em modo estrito, módulos ES e Vite.
- Bootstrap Icons, Montserrat e Fira Sans empacotados localmente.
- `qrcode`: geração de QR no cliente, sem serviço externo.
- `html-to-image`: captura PNG do cartão digital.
- Web APIs: LocalStorage, Canvas, File, FormData, dialog, Clipboard, Web Share, Service Worker e Media Queries.
- Vitest, Playwright, axe-core e jsQR para verificação funcional, acessibilidade automatizada e decodificação do QR exportado.

## Arquitetura

```text
src/
  components/      componentes reutilizáveis, shell e fluxos
  data/            defaults, perguntas, educação e demonstração
  pages/           telas e vinculação de seus eventos
  services/        regras do negócio, estado, diagnóstico, analytics e exportação
  storage/         única camada com acesso direto ao LocalStorage
  styles/          tokens, base, landing, dashboard, workspace, público e responsividade
  types/           contratos TypeScript
  utils/           escaping, URLs, imagens e validações
public/            manifesto, ícones e fallback offline
scripts/           geração do service worker com cache versionado por conteúdo
 tests/            testes unitários e percursos de navegador
 docs/             documentação acadêmica e auditoria
```

O estado é atualizado transacionalmente: primeiro persiste uma cópia, depois troca o estado em memória. Erros de quota não geram sucesso falso. `StorageService` concentra a persistência; `businessService`, `productService`, `diagnosticService` e `analyticsService` separam as regras. Para adicionar API REST, substitua o repositório por métodos assíncronos e adapte as chamadas; não é necessário reescrever o algoritmo do diagnóstico nem os contratos do domínio.

Rotas internas usam hash (`/#/dashboard` etc.) para funcionarem em hospedagem estática. As duas páginas HTML adicionais oferecem entradas diretas.

## Design system e acessibilidade

A marca usa azul profundo, verde-lima e superfícies claras, com variante escura. Tokens em `src/styles/tokens.css` definem cores, espaçamento, tipografia, raios, bordas, sombras e transições. Breakpoints complementares estão em `responsive.css`.

Há navegação por teclado, foco visível, skip link, labels, mensagens de validação, regiões de status, diálogos nativos e respeito a `prefers-reduced-motion`. A prévia do celular pode receber foco e ser rolada pelo teclado. A auditoria automatizada não substitui testes com leitores de tela e participantes reais.

## Privacidade e segurança

- Nenhum dado de negócio é enviado a um backend pela aplicação.
- Consentimento local antes da persistência de dados reais; demonstração em chave separada.
- Preferências essenciais de aparência e modo ficam no navegador.
- Links externos só são abertos por ações da pessoa, em serviços com suas próprias políticas.
- Conteúdo textual escapado antes de entrar no DOM; URLs limitadas a HTTP/HTTPS; imagens limitadas a dados raster reprocessados em Canvas.
- Upload: até 5 MB e 40 megapixels, com redução para até 1.200 px no maior lado.
- Dados são locais, sem criptografia nem controle de acesso por conta. Evite dispositivos compartilhados para informações privadas.
- Apagar dados remove apenas chaves `nexus:`. Não apaga arquivos já baixados, publicados nem dados de outros sites.
- O termo simples e os controles concretizam princípios de minimização, transparência e controle; não representam certificação de conformidade legal. A instituição deve definir responsáveis, contatos, finalidade e autorizações de campo.

Referências educativas: [CERT.br — Cartilha de Segurança para Internet](https://cartilha.cert.br/fasciculos/) e [ANPD — materiais educativos](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes).

## Verificar

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run format:check
```

Os testes de navegador usam Google Chrome instalado (`channel: chrome`) e iniciam/reutilizam o Vite na porta 5173. Em ambientes sem Chrome, instale-o com `npx playwright install chrome` ou adapte `playwright.config.ts` para Chromium e use `npx playwright install chromium`. Os testes usam contextos isolados e dados fictícios. Relatório HTML: `playwright-report/index.html` (gerado, ignorado pelo Git).

`npm run format` organiza os arquivos com Prettier. O histórico detalhado de validação está em `docs/auditoria.md`.

## Equipe

Preencha **Equipe universitária** com instituição, professor, turma, integrantes, comunidade e período. Não foram inventados nomes ou vínculos institucionais. O planejamento da intervenção está em `docs/projeto.md`.

## Roadmap

- Repositório REST com autenticação e autorização por negócio.
- Publicação de páginas por endereço único e armazenamento de imagens.
- Agregação de múltiplos participantes com consentimentos e trilha de auditoria.
- Importação de backup, versionamento e migração de registros.
- Pesquisa de usabilidade com a comunidade e revisão por leitores de tela reais.
- Estatísticas públicas agregadas e opcionais, com política de retenção.

## Experiência futurista e guiada

A landing inclui fundo orbital ligado à rolagem, paralaxe em camadas, jornada com abas, amostra interativa de cores, exemplo educativo e FAQ. As áreas internas ganharam o **Nexus Guia**, que explica cada etapa pelo botão Guia ou atalho `?`, além de uma trilha visual de progresso.

Os efeitos respeitam movimentos reduzidos e podem ser pausados. A implementação usa Canvas e Web APIs nativas, com limpeza de eventos entre rotas e sem loop de animação contínuo. Detalhes de UX e movimento estão em `docs/experiencia.md`; resultados e pendências de validação estão em `docs/auditoria.md`.
