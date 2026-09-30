# nexus+ — experiência e movimento

A direção visual combina um fundo noturno, azul profundo, luzes em verde-lima, linhas orbitais e superfícies com profundidade. As áreas de trabalho mantêm opções clara, escura e automática. A landing tem identidade noturna própria; o conteúdo comercial exportado conserva a identidade do negócio.

## O que orienta a experiência

- **Aprender fazendo:** a seção “A sua transformação” possui quatro etapas exploráveis, uma amostra de personalização por cor e um exercício educativo com explicação imediata.
- **Informação no momento certo:** guias contextuais ficam recolhidos, próximos ao título de cada área. O botão Guia e o atalho `?` abrem passos concretos sem exigir um tutorial antes do uso.
- **Progresso visível:** a jornada do dashboard indica etapas concluídas a partir dos dados existentes. O diagnóstico continua separado e não recebe pontos artificiais por ações na interface.
- **Consistência:** controles, feedback, foco, menus e cartões compartilham os mesmos padrões visuais.
- **Controle da pessoa:** efeitos podem ser pausados e a escolha persiste no navegador. A preferência de movimento reduzido do dispositivo tem prioridade.
- **Clareza sobre limitações:** o FAQ e os guias distinguem uma prévia local de uma página hospedada e explicam o compartilhamento de arquivos.

## Movimento

O Canvas de fundo desenha uma constelação e órbitas geométricas. A rolagem modifica a orientação das órbitas, as luzes de fundo, a malha e as camadas do celular. A animação não interfere na rolagem nativa nem altera a velocidade de navegação.

O desenho usa `requestAnimationFrame` apenas quando há rolagem, redimensionamento, mudança de visibilidade ou preferência. Não existe um loop contínuo em segundo plano. Em telas pequenas, a quantidade de pontos é reduzida; a resolução do Canvas limita a densidade de pixels a 1,5.

As entradas de seção usam IntersectionObserver, sem esconder conteúdos essenciais e sem reduzir seu contraste durante o estado de espera. Eventos e observadores são removidos ao mudar de rota. Não foi adicionada biblioteca de animação.

## Acessibilidade

- Abas com roles e estados ARIA, foco móvel, setas, Home e End.
- Guias em dialog nativo, fechamento pelo botão e Escape.
- Sidebar móvel inerte enquanto fechada, com botão próprio para fechar.
- Rolagem por teclado nas prévias de celular.
- Pausa explícita e respeito a `prefers-reduced-motion`.
- Conteúdo presente sem depender da animação para ser revelado.

## Arquivos

- `src/services/experience.ts`: ciclo de vida, rolagem, Canvas e interações da landing.
- `src/components/guide.ts`: conteúdo de ajuda e jornada digital.
- `src/pages/landing.ts`: composição da experiência inicial e etapas demonstrativas.
- `src/styles/future-landing.css`: identidade e comportamento responsivo da landing.
- `src/styles/future-workspace.css`: componentes das áreas internas e estados.
- `tests/experience.spec.ts`: interações, preferências de movimento, guias, teclado, ampliação e contraste.

## Referências técnicas

- [MDN — CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations).
- [MDN — Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).
- [W3C — respeitar a preferência de movimentos reduzidos](https://www.w3.org/WAI/WCAG22/Techniques/css/C39).

As referências orientaram técnicas e acessibilidade, sem reproduzir o layout de uma marca específica.

## Plano personalizado após o diagnóstico

O resultado e o painel exibem três tarefas ordenadas pelo peso da lacuna no diagnóstico mais recente. Perguntas relacionadas são agrupadas para evitar tarefas repetidas. Empates seguem uma ordem prática estável. Com todas as respostas positivas, a interface explica que os passos servem para organizar a presença na nexus+.

A seleção permanece estável até um novo diagnóstico; a conclusão é derivada dos dados já salvos (catálogo, contatos, HTML exportado e aprendizados). Remover esses dados reabre a tarefa correspondente. Nenhuma ação aumenta a nota automaticamente. Exportar HTML não é publicar na internet, e concluir conteúdo educativo não confirma configurações externas. Sem perfil, os atalhos orientam primeiro ao cadastro. Os tempos são estimativas.

Validação: build aprovado e 21 testes unitários aprovados, incluindo cinco casos do plano (prioridade, agrupamento, conclusão/reabertura, persistência e novo diagnóstico). A inspeção visual e os testes de navegador desta alteração não foram executados devido ao bloqueio de acesso ao navegador já registrado.

## Animação inspirada no vídeo enviado

Referência analisada: vídeo local `newformcommunity_pindown.io_1790778889.mp4`, com quadros entre 0 e 18 segundos. A adaptação usa títulos em sequência, figuras com volume simulado em CSS, mudança de contraste, cartões empilhados por posicionamento sticky e deslocamentos vinculados à rolagem. O celular da abertura acompanha o ponteiro em dispositivos com mouse. Os desenhos são próprios da nexus+, sem incorporar o vídeo ou imagens do portfólio.

A nova seção Descobrir / Criar / Conectar aparece entre a abertura e a jornada interativa. Em telas pequenas ou baixas, os cartões ficam no fluxo normal. Pausar efeitos e a preferência do sistema por movimento reduzido desativam flutuação, entrada e empilhamento. As animações decorativas param quando a aba está oculta. A interação do ponteiro usa quadros apenas até estabilizar.

Build e 21 testes unitários aprovados. A apresentação, o empilhamento e as interações novas ainda precisam de conferência visual no navegador; não foi contornado o bloqueio de acesso local previamente registrado.

## Fundo com câmera e escultura

O segundo vídeo, `qclaydesign_pindown.io_1790779421.mp4`, foi analisado em dez quadros. A referência apresenta uma escultura com halo que muda de enquadramento entre seções. A nexus+ agora usa uma malha tridimensional própria em Canvas: um tubo entrelaçado, iluminado, com projeção em perspectiva e halo atrás da silhueta. Cinco poses interpolam posição, aproximação e rotação conforme a rolagem. O primeiro deslocamento ocorre na primeira altura de tela; os seguintes acompanham o restante da página. Uma curta interpolação suaviza a chegada, sem substituir a rolagem nativa. A renderização para ao estabilizar ou ocultar a aba; pausa e movimento reduzido mantêm a pose inicial. No celular, a opacidade é menor para preservar a leitura. Conferência visual em navegador ainda pendente pelo bloqueio registrado.
