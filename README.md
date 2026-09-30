<p align="center">
  <img src="docs/assets/nexus-banner.svg" alt="nexus+ — Seu próximo passo é digital" width="100%">
</p>

<p align="center">
  <a href="https://arthurkyo.github.io/nexus-plus/"><strong>🚀 Acessar o site</strong></a> ·
  <a href="#executar-localmente">Executar localmente</a> ·
  <a href="docs/guia-tecnico.md">Documentação técnica</a> ·
  <a href="https://github.com/ArthurKyo/nexus-plus/issues">Sugestões e problemas</a>
</p>

<p align="center">
  <a href="https://github.com/ArthurKyo/nexus-plus/actions/workflows/pages.yml"><img src="https://github.com/ArthurKyo/nexus-plus/actions/workflows/pages.yml/badge.svg" alt="Status da publicação no GitHub Pages"></a>
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&amp;logoColor=white" alt="TypeScript em modo estrito">
  <img src="https://img.shields.io/badge/Vite-frontend-646CFF?logo=vite&amp;logoColor=white" alt="Frontend com Vite">
</p>

## Sobre o projeto

A **nexus+** ajuda pequenos negócios, profissionais autônomos e iniciativas comunitárias a dar os primeiros passos no mundo digital. A proposta reúne diagnóstico, criação de materiais comerciais e aprendizado de segurança em uma experiência guiada.

O projeto foi desenvolvido como aplicação de extensão universitária, com foco em **Tecnologia e Sociedade**. A interface combina uma identidade futurista com linguagem acessível, exemplos práticos e orientações em cada etapa.

**Experimente:** [abra a nexus+](https://arthurkyo.github.io/nexus-plus/) e selecione **Explorar demonstração**. Você encontrará uma barbearia fictícia com catálogo preenchido, em um espaço separado dos seus dados reais.

## O que você pode fazer

| Área           | Recursos                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------ |
| **Descobrir**  | Diagnóstico de 11 perguntas, histórico e plano personalizado com três ações prioritárias.  |
| **Criar**      | Perfil comercial, cadastro de produtos e serviços, imagens e editor com prévia ao vivo.    |
| **Apresentar** | Exportação de página HTML independente, QR Code e cartão digital em PNG.                   |
| **Aprender**   | Seis módulos de segurança e simulador com oito situações e explicações.                    |
| **Acompanhar** | Progresso das tarefas, comparação entre diagnósticos e resumo para a equipe universitária. |

O **Nexus Guia** orienta a pessoa dentro de cada área. O plano personalizado apresenta o próximo passo, um tempo estimado e o atalho para realizá-lo.

## Experiência visual

- Fundo com forma tridimensional e halo que mudam de posição, escala e ângulo na rolagem.
- Cartões que se sobrepõem no desktop, elementos flutuantes e gráfico de barras animado.
- Títulos em Montserrat e textos em Fira Sans, com fontes incluídas no projeto.
- Layout responsivo, temas claro/escuro/sistema e navegação por teclado.
- Controle para pausar efeitos e respeito à preferência por movimento reduzido.

As animações foram criadas com **CSS, Canvas e APIs nativas**, sem biblioteca de animação. O banner deste README representa a identidade visual; não é uma captura de tela da aplicação.

## Tecnologias

**Interface:** HTML5, CSS, Bootstrap 5, Bootstrap Icons e TypeScript estrito.  
**Build:** Vite e npm.  
**Dados:** LocalStorage, com consentimento e modo de demonstração separado.  
**Materiais:** `qrcode` e `html-to-image`.  
**Verificação:** Vitest, Playwright, axe-core e jsQR.  
**Publicação:** GitHub Actions e GitHub Pages.

## Executar localmente

Requisitos: **Node.js 22.12+** e npm.

```bash
git clone https://github.com/ArthurKyo/nexus-plus.git
cd nexus-plus
npm ci
npm run dev
```

Abra o endereço indicado no terminal, normalmente `http://localhost:5173/`.

| Comando                | Finalidade                                                    |
| ---------------------- | ------------------------------------------------------------- |
| `npm run dev`          | Iniciar o ambiente de desenvolvimento.                        |
| `npm run build`        | Validar o TypeScript e gerar a versão de produção em `dist/`. |
| `npm run preview`      | Servir o build localmente.                                    |
| `npm test`             | Executar os testes unitários.                                 |
| `npm run test:e2e`     | Executar os testes de navegador; requer Chrome instalado.     |
| `npm run format:check` | Conferir a formatação.                                        |

## Publicação automática

O site está disponível em **[arthurkyo.github.io/nexus-plus](https://arthurkyo.github.io/nexus-plus/)**.

Ao enviar alterações à branch `main`, o [workflow de publicação](.github/workflows/pages.yml) instala as dependências, executa os testes unitários, gera o build e publica no GitHub Pages. Os caminhos dos arquivos e do service worker são ajustados ao endereço do repositório.

Para gerar manualmente o mesmo build:

```bash
VITE_BASE_PATH=/nexus-plus/ npm run build
```

## Como os dados funcionam

**O site é público, mas os cadastros ficam no navegador de cada pessoa.** Esta versão não possui servidor de contas, sincronização entre aparelhos ou publicação automática de cada negócio.

Para compartilhar uma página comercial, exporte o HTML no editor, hospede esse arquivo e informe o endereço publicado na área de QR Code. Enviar apenas a URL da prévia local não transfere o cadastro para outro aparelho.

- A exportação JSON permite guardar uma cópia dos dados; a interface ainda não oferece importação.
- O índice digital muda somente após um novo diagnóstico. Concluir tarefas não aumenta a nota automaticamente.
- As estatísticas são contadores locais, não métricas públicas de visitantes ou vendas.
- Há suporte a PWA e cache offline na versão de produção, após o primeiro acesso conectado; a instalação depende do navegador.

## Estrutura

```text
src/
  components/   Componentes, guias e plano de ação
  data/         Perguntas, módulos educativos e dados fictícios
  pages/        Telas da aplicação
  services/     Estado, diagnóstico, exportação e animações
  storage/      Persistência local
  styles/       Identidade visual e responsividade
  types/        Contratos TypeScript
  utils/        Validação e tratamento de conteúdo
public/         Ícones, manifesto e página offline
scripts/        Geração do service worker
tests/          Testes unitários e de navegador
docs/           Guias e histórico de validação
```

## Documentação e qualidade

- [Guia técnico completo](docs/guia-tecnico.md)
- [Experiência, animações e acessibilidade](docs/experiencia.md)
- [Planejamento do projeto](docs/projeto.md)
- [Auditoria e limitações de verificação](docs/auditoria.md)

A primeira publicação passou pelo build e pelos **21 testes unitários**. A suíte de navegador existe, mas a validação visual das alterações mais recentes permanece pendente. Testes automatizados não substituem pesquisa de usabilidade ou avaliação com leitores de tela.

## Próximas evoluções

- Publicação de páginas individuais com endereço permanente.
- Autenticação e sincronização por negócio.
- Importação e recuperação de backups.
- Modelos por segmento e pesquisa com a comunidade.
- Métricas públicas opcionais, com privacidade e retenção definidas.

## Contribuir

Encontrou um problema ou teve uma ideia? [Abra uma issue](https://github.com/ArthurKyo/nexus-plus/issues) com o contexto e, se possível, os passos para reproduzir. Evite incluir dados pessoais ou cadastros reais nas capturas.

Projeto mantido por [ArthurKyo](https://github.com/ArthurKyo). Os dados institucionais e integrantes da equipe podem ser preenchidos na área **Equipe universitária** da aplicação.
