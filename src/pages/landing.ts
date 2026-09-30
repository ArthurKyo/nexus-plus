import { motionShowcase } from "../components/motionShowcase";
import { icon } from "../utils/html";
export const brand =
  '<span class="brand">nexus<span class="plus">+</span></span>';
export function landing(): string {
  return `<div class="landing future-landing">
    <div class="cosmic-backdrop" aria-hidden="true"><canvas id="nexus-cosmos"></canvas><div class="ambient-glow glow-one"></div><div class="ambient-glow glow-two"></div><div class="cosmic-grid"></div></div>
    <div class="reading-progress" aria-hidden="true"><span id="reading-progress-fill"></span></div>
    <header class="landing-nav"><a href="#/" aria-label="nexus+ início">${brand}</a><nav aria-label="Navegação principal"><a href="#como-funciona">A experiência</a><a href="#beneficios">Possibilidades</a><a href="#seguranca">Aprenda</a><a href="#sobre">O propósito</a></nav><div class="actions"><a class="nav-login" href="#/dashboard">Meu espaço</a><a class="btn btn-primary" href="#/diagnostico">Começar diagnóstico ${icon("plus-lg")}</a></div></header>
    <main id="main">
      <section class="hero cosmic-hero"><div class="hero-copy"><div class="launch-label"><span class="launch-symbol" aria-hidden="true">✳</span> PEQUENOS NEGÓCIOS. NOVOS UNIVERSOS.</div><h1><span class="hero-line"><span>Seu negócio</span></span><span class="hero-line"><span>merece ser</span></span><span class="hero-line"><em>encontrado.</em></span><span class="heading-spark" aria-hidden="true">✳</span></h1><p>O que você faz é único.<br>Vamos conectar esse talento ao mundo digital?</p><div class="actions"><a class="btn btn-primary" href="#/diagnostico">Começar agora ${icon("plus-lg")}</a><button class="btn btn-glass" data-action="demo">${icon("play-circle")} Explorar demonstração</button></div><div class="hero-foot"><span>${icon("check2")} Gratuito. De verdade.</span><span>${icon("check2")} Nenhum conhecimento técnico.</span></div><a class="scroll-invitation" href="#como-funciona"><span class="scroll-track" aria-hidden="true"><span></span></span> Role e descubra suas possibilidades</a></div>
      <div class="hero-stage cosmic-stage"><div class="orbit-ring orbit-one" aria-hidden="true"></div><div class="orbit-ring orbit-two" aria-hidden="true"></div><div class="stage-coordinate coordinate-top" aria-hidden="true">NEXUS / DIGITAL EXPERIENCE</div><div class="stage-coordinate coordinate-bottom" aria-hidden="true">01 — CONECTAR · CRIAR · EVOLUIR</div>
        <div class="phone hero-phone" data-depth="-0.06"><div class="phone-content" tabindex="0" role="region" aria-label="Exemplo de página de uma barbearia"><div class="mock-cover"><span class="mock-cover-label">CENTRAL<br><small>BARBEARIA & ESTILO</small></span></div><div class="mock-profile"><div class="mock-logo">${icon("scissors")}</div><h3>Barbearia Central</h3><p>Seu estilo, nossa especialidade.</p><span class="badge-soft badge-green">Página de demonstração</span><span class="mock-button">${icon("whatsapp")} Vamos agendar?</span><div class="mock-section-label">FEITO PARA VOCÊ</div><div class="mock-item">${icon("scissors")}<div><strong>Corte masculino</strong><span>Estilo em cada detalhe</span></div><span>R$ 35</span></div><div class="mock-item">${icon("stars")}<div><strong>Barba completa</strong><span>Cuidado que faz a diferença</span></div><span>R$ 25</span></div><div class="mock-item">${icon("box-seam")}<div><strong>Pomada modeladora</strong><span>Seu estilo, todos os dias</span></div><span>R$ 35</span></div></div></div></div>
        <div class="float-tag tag-right" data-depth="0.045"><span class="satellite-icon">${icon("globe2")}</span><div><small>DO LOCAL PARA O DIGITAL</small><strong>Seu novo endereço.</strong><span>Seu negócio. Sua identidade.</span></div></div>
        <div class="float-tag tag-left" data-depth="0.08"><span class="satellite-icon satellite-lime">${icon("graph-up-arrow")}</span><div><small>UM PASSO DE CADA VEZ</small><strong>Mais presença.<br>Mais possibilidades.</strong></div></div><div class="orbit-node node-one" aria-hidden="true">${icon("qr-code")}</div><div class="orbit-node node-two" aria-hidden="true">${icon("lightning-charge")}</div>
      </div></section>
      <div class="trust-strip"><span>FEITO PARA QUEM FAZ ACONTECER</span><span>${icon("shop")} Comércio local</span><span>${icon("scissors")} Profissionais autônomos</span><span>${icon("heart")} Negócios com propósito</span></div>
      ${motionShowcase()}<section class="landing-section journey-section" id="como-funciona"><div class="section-heading" data-reveal><div><div class="eyebrow"><span>01</span> A SUA TRANSFORMAÇÃO</div><h2>Não precisa saber tudo.<br><span class="text-soft">Só dar o primeiro passo.</span></h2></div><p>Descubra, experimente e aprenda fazendo.<br>A gente deixa o caminho claro para você.</p></div><div class="journey-lab" data-reveal><div class="journey-navigation" role="tablist" aria-label="Etapas da presença digital" aria-orientation="vertical">${[
        [
          "radar",
          "Descubra seu momento",
          "Um diagnóstico simples, sem julgamentos.",
        ],
        [
          "shop",
          "Conte a sua história",
          "Seu negócio merece uma boa apresentação.",
        ],
        [
          "palette",
          "Crie do seu jeito",
          "Experimente cores e veja tudo acontecer.",
        ],
        [
          "broadcast",
          "Faça novas conexões",
          "Leve sua página para além daqui.",
        ],
      ]
        .map(
          ([ic, title, desc], i) =>
            `<button class="journey-tab ${i === 0 ? "selected" : ""}" role="tab" id="journey-tab-${i}" aria-controls="journey-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? "0" : "-1"}" data-journey-step="${i}"><span class="journey-number">0${i + 1}</span><span><strong>${title}</strong><small>${desc}</small></span>${icon(ic)}</button>`,
        )
        .join(
          "",
        )}</div><div class="journey-panel" id="journey-panel" role="tabpanel" aria-labelledby="journey-tab-0" tabindex="0">${journeyPanel(0)}</div></div></section>
      <section class="landing-section" id="beneficios"><div class="section-heading" data-reveal><div><div class="eyebrow"><span>02</span> UM UNIVERSO DE POSSIBILIDADES</div><h2>Tudo conectado.<br><span class="text-soft">Tudo com a sua cara.</span></h2></div><p>Ferramentas que conversam entre si.<br>Para você se concentrar no seu negócio.</p></div><div class="possibility-grid"><article class="possibility-card possibility-main" data-reveal><div class="feature-icon">${icon("layout-text-window")}</div><span class="card-kicker">SEU ESPAÇO NA INTERNET</span><h3>Pequeno no tamanho.<br>Gigante na presença.</h3><p>Uma página com seus contatos, serviços e produtos. Fácil de criar. Feita para ser sua.</p><div class="mini-browser" aria-hidden="true"><div class="mini-browser-bar"><span>● ● ●</span><span>seu negócio / seu espaço</span></div><div class="mini-browser-body"><div class="mini-identity">${icon("shop")}<div><strong>O seu próximo capítulo.</strong><span>Começa com uma boa conexão.</span></div></div><div class="mini-browser-tiles"><span>${icon("box-seam")} Produtos</span><span>${icon("scissors")} Serviços</span><span>${icon("whatsapp")} Contato</span></div></div></div></article>
      <article class="possibility-card" data-reveal><div class="feature-icon">${icon("qr-code-scan")}</div><span class="card-kicker">DO FÍSICO AO DIGITAL</span><h3>Uma câmera.<br>Uma nova conexão.</h3><p>Seu QR Code no balcão, na embalagem ou no cartão. Um atalho até o seu negócio.</p><div class="feature-footer"><span>QR Code + cartão digital</span>${icon("plus-circle")}</div></article>
      <article class="possibility-card" data-reveal><div class="feature-icon">${icon("grid")}</div><span class="card-kicker">ORGANIZE PARA ENCANTAR</span><h3>O que você faz,<br>bem apresentado.</h3><p>Fotos, preços e detalhes. Um catálogo que ajuda seu cliente a escolher.</p><div class="feature-footer"><span>Produtos + serviços</span>${icon("plus-circle")}</div></article>
      <article class="possibility-card possibility-wide" data-reveal><div><div class="feature-icon">${icon("graph-up-arrow")}</div><span class="card-kicker">EVOLUÇÃO QUE VOCÊ ENXERGA</span><h3>Cada passo deixa uma marca.</h3><p>Acompanhe suas conquistas, refaça o diagnóstico e descubra o quanto você já avançou.</p></div><div class="progress-sculpture" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></div></article></div></section>
      <section class="landing-section learn-section" id="seguranca"><div class="learn-copy" data-reveal><div class="eyebrow"><span>03</span> CONFIANÇA TAMBÉM SE APRENDE</div><h2>O digital pode ser novo.<br><span class="text-soft">Você não precisa<br>andar no escuro.</span></h2><p>Aprenda a proteger suas contas, reconhecer golpes e cuidar dos dados dos clientes. Com exemplos do dia a dia, sem palavras difíceis.</p><div class="learning-facts"><span>${icon("shield-check")} 6 módulos práticos</span><span>${icon("chat-dots")} 8 situações para treinar</span></div><a class="text-link" href="#/privacidade">Seus dados ficam sob seu controle ${icon("shield-lock")}</a></div><div class="learning-demo" data-reveal><div class="row-head"><span class="badge-soft">${icon("lightbulb")} EXPERIMENTE APRENDER</span><span class="small muted">01 / exemplo</span></div><div class="sample-message"><span class="message-sender">${icon("chat-square-dots")} Mensagem fictícia</span><p>“Para evitar o bloqueio da sua conta, envie o código de seis números que chegou no seu celular.”</p><small>Recebida agora</small></div><h3>Você enviaria esse código?</h3><div class="actions"><button class="btn btn-primary" data-lesson-answer="safe">Não, parece suspeito</button><button class="btn btn-glass" data-lesson-answer="unsafe">Sim, para proteger a conta</button></div><div id="lesson-feedback" class="lesson-feedback" aria-live="polite"></div><p class="demo-note">Um espaço para aprender. Aqui, errar faz parte.</p></div></section>
      <section class="landing-section purpose-section" id="sobre"><div class="purpose-symbol" data-reveal aria-hidden="true">+</div><div class="purpose-copy" data-reveal><div class="eyebrow"><span>04</span> TECNOLOGIA QUE APROXIMA</div><h2>O futuro é digital.<br><em>E também é local.</em></h2><p>Da universidade para o seu bairro. A nexus+ conecta conhecimento, criatividade e pessoas para abrir novas possibilidades a quem empreende.</p><a class="btn btn-glass" href="/equipe.html">${icon("mortarboard")} Conheça o projeto</a></div></section>
      <section class="landing-section faq-section"><div data-reveal><div class="eyebrow">ANTES DO PRIMEIRO PASSO</div><h2>Uma dúvida?<br><span class="text-soft">Vamos simplificar.</span></h2></div><div class="faq-list" data-reveal>${[
        [
          "Preciso entender de tecnologia?",
          "Não. O diagnóstico usa perguntas simples, e cada área tem um guia com exemplos e próximos passos. Você pode começar pela demonstração e aprender no seu ritmo.",
        ],
        [
          "É gratuito mesmo?",
          "Sim. A nexus+ é uma ferramenta de extensão universitária. Você pode criar o perfil, o catálogo e os materiais sem pagar pelo uso da aplicação. Uma hospedagem externa pode ter seus próprios custos.",
        ],
        [
          "Minha página já fica disponível para todo mundo?",
          "Você começa com uma prévia salva no seu navegador. Para outras pessoas acessarem, exporte a página HTML e hospede esse arquivo. Depois informe o endereço publicado para gerar seu QR Code.",
        ],
        [
          "E se eu fechar o navegador?",
          "As informações autorizadas ficam salvas neste navegador, no mesmo dispositivo. Você pode continuar depois. Exporte seus dados antes de limpar o navegador ou trocar de aparelho.",
        ],
      ]
        .map(
          ([q, a]) =>
            `<details><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`,
        )
        .join("")}</div></section>
      <section class="landing-section closing-section" data-reveal><span class="closing-orbit" aria-hidden="true"></span><div class="eyebrow">SEU PRÓXIMO CAPÍTULO</div><h2>Grandes possibilidades.<br><span>Um primeiro clique.</span></h2><a href="#/diagnostico" class="btn btn-primary">Começar meu diagnóstico ${icon("plus-lg")}</a><p>Gratuito. No seu ritmo. Com você no controle.</p></section>
    </main><footer class="landing-footer"><a href="#/" aria-label="nexus+ início">${brand}</a><p>Transformando pequenos negócios<br>através da presença digital.</p><div class="actions"><a class="small" href="#/privacidade">Privacidade</a><button class="motion-toggle" data-motion-toggle aria-pressed="false">${icon("pause-circle")} <span>Pausar efeitos</span></button></div><span class="footer-bottom">TECNOLOGIA + COMUNIDADE + POSSIBILIDADES</span></footer>
  </div>`;
}
export function journeyPanel(step: number): string {
  const panels = [
    `<div class="lab-topline"><span>SEU PONTO DE PARTIDA</span><span>01 / 04</span></div><div class="lab-orbit" aria-hidden="true">${icon("radar")}</div><h3>Antes de crescer,<br>entenda onde você está.</h3><p>11 perguntas sobre a presença e a segurança do seu negócio. Sem certo ou errado: um retrato do seu momento.</p><div class="lab-pills"><span>Instagram</span><span>WhatsApp</span><span>Segurança</span></div><a class="text-link" href="#/diagnostico">Fazer meu diagnóstico ${icon("plus-circle")}</a>`,
    `<div class="lab-topline"><span>A SUA HISTÓRIA IMPORTA</span><span>02 / 04</span></div><div class="lab-orbit" aria-hidden="true">${icon("shop")}</div><h3>O seu talento merece<br>uma boa apresentação.</h3><p>Nome, uma descrição e formas de contato. Depois, adicione produtos e serviços. Comece com o essencial e complete no seu tempo.</p><div class="lab-pills"><span>Seu nome</span><span>Seu trabalho</span><span>Seu contato</span></div><a class="text-link" href="#/diagnostico">Começar pelo primeiro passo ${icon("plus-circle")}</a>`,
    `<div class="lab-topline"><span>EXPERIMENTE AGORA</span><span>03 / 04</span></div><div class="color-playground"><div class="color-preview" id="color-preview"><span>${icon("shop")}</span><strong>Seu negócio. Seu estilo.</strong><span class="sample-contact">Vamos conversar</span></div><div class="color-choices" role="group" aria-label="Experimente uma cor"><button style="--swatch:#294b3e" data-sample-color="#294b3e" aria-label="Cor verde" aria-pressed="true"></button><button style="--swatch:#2944b7" data-sample-color="#2944b7" aria-label="Cor azul" aria-pressed="false"></button><button style="--swatch:#733e96" data-sample-color="#733e96" aria-label="Cor violeta" aria-pressed="false"></button><button style="--swatch:#a1492d" data-sample-color="#a1492d" aria-label="Cor terracota" aria-pressed="false"></button></div></div><h3>Escolha uma cor.<br>Veja a mudança acontecer.</h3><p>Na sua página, você também escolhe o tema, as fotos e o estilo dos botões. Sem escrever uma linha de código.</p>`,
    `<div class="lab-topline"><span>PRONTO PARA NOVAS CONEXÕES</span><span>04 / 04</span></div><div class="lab-orbit" aria-hidden="true">${icon("broadcast")}</div><h3>Do seu balcão<br>para novas possibilidades.</h3><p>Exporte sua página, hospede o arquivo e use o endereço no QR Code. Seu cartão digital completa a apresentação.</p><div class="lab-pills"><span>Página HTML</span><span>QR Code</span><span>Cartão digital</span></div><a class="text-link" href="#/diagnostico">Criar minha presença digital ${icon("plus-circle")}</a>`,
  ];
  return panels[step] ?? panels[0];
}
