import { icon } from "../utils/html";
export function motionShowcase(): string {
  return `<section class="motion-showcase" aria-labelledby="motion-showcase-title"><header class="motion-intro"><span class="eyebrow">SEU TALENTO, EM OUTRA DIMENSÃO</span><h2 id="motion-showcase-title">Do primeiro passo.<br><em>Ao próximo nível.</em></h2><p>Role para ver suas possibilidades ganharem forma.</p></header><div class="motion-stack">${[
    [
      "01",
      "DESCOBRIR",
      "Um novo olhar.<br>Um novo começo.",
      "Entenda o momento do seu negócio e encontre os próximos passos com um plano feito para você.",
      "radar",
      "orb",
      "SEU PONTO DE PARTIDA",
    ],
    [
      "02",
      "CRIAR",
      "Sua ideia.<br>Em grande forma.",
      "Transforme o que você faz em uma página com identidade, produtos e serviços. Experimente e veja acontecer.",
      "shop",
      "cube",
      "SUA IDENTIDADE DIGITAL",
    ],
    [
      "03",
      "CONECTAR",
      "Mais perto.<br>Mais possibilidades.",
      "Prepare seus contatos e materiais para apresentar seu negócio. Aprenda a criar conexões com segurança.",
      "broadcast",
      "rings",
      "SEU PRÓXIMO CAPÍTULO",
    ],
  ]
    .map(
      ([n, label, title, copy, symbol, shape, note]) =>
        `<article class="motion-chapter chapter-${shape}"><div class="chapter-top"><span>${n} / ${label}</span>${icon("arrow-down-right")}</div><div class="chapter-body"><div><h3>${title}</h3><p>${copy}</p></div><div class="chapter-art art-${shape}" aria-hidden="true"><span class="art-halo"></span><span class="art-object">${icon(symbol)}</span><span class="art-satellite satellite-a">+</span><span class="art-satellite satellite-b">✳</span></div></div><div class="chapter-bottom"><span>${note}</span><span>NEXUS<span aria-hidden="true">+</span></span></div></article>`,
    )
    .join(
      "",
    )}</div><div class="kinetic-ribbon" aria-hidden="true"><span>DESCOBRIR ✳ CRIAR ✳ CONECTAR ✳ EVOLUIR ✳ </span><span>DESCOBRIR ✳ CRIAR ✳ CONECTAR ✳ EVOLUIR ✳ </span></div></section>`;
}
