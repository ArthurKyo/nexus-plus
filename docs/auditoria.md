# Registro de validação — nexus+

## Implementação inicial

- TypeScript estrito e build de produção executados com sucesso.
- 16 testes unitários: pesos e limites do diagnóstico, classificação, contatos brasileiros, URLs, escaping, coerência da demonstração e horários, incluindo turno noturno.
- Dez percursos iniciais de navegador passaram após correções de seletores, preservação dos filtros na exclusão e foco na prévia.
- QR exportado foi decodificado por jsQR para conferir o endereço.
- Exportação HTML independente, cartão PNG, produtos, serviços, privacidade e treinamento foram exercitados.
- Auditoria de dependências após atualização do Vitest: zero vulnerabilidades conhecidas na execução de 28/09/2026.

## Redesign de 30/09/2026

Última execução completa de navegador, antes dos ajustes finais: **12 de 15 cenários passaram**.

Passaram:

- Movimento conectado à rolagem, pausa persistente e preferência de movimento reduzido.
- Guias contextuais, atalho de teclado e menu móvel inerte quando fechado.
- Acesso aos controles com ampliação de texto para 200%.
- Diagnóstico, cadastro, consentimento e persistência.
- CRUD de produtos, validações, busca, edição e exclusão.
- CRUD e disponibilidade de serviços.
- Perfil, imagens, texto malicioso escapado, editor e exportação HTML.
- QR decodificável e download do cartão PNG.
- Módulos educativos, treinamento e resumo acadêmico.
- Demonstração isolada, privacidade, tema e exclusão local.
- Página ausente em outro dispositivo e links da equipe.
- Verificação de overflow horizontal em 13 telas nas larguras 320, 375, 390, 430, 768, 1024, 1280, 1440 e 1920; sem erros JavaScript capturados nesse percurso.

Foram encontrados e corrigidos em código:

1. O seletor de teste do FAQ comparava o texto exato incluindo um “+” decorativo. O teste agora procura o elemento summary pela pergunta.
2. A prévia rolável do celular na landing precisava de foco por teclado. Foi adicionado tabindex, papel de região e nome acessível.
3. A opacidade baixa das seções antes de entrarem em tela reduzia o contraste. O estado de espera agora mantém opacidade total e usa deslocamento para a transição.

Esses três cenários **ainda precisam de uma nova execução de navegador após as correções finais**. A inspeção da aba integrada foi bloqueada pela política de URL da ferramenta, e não houve tentativa de contornar essa restrição. As capturas já produzidas pelos testes foram usadas para revisar a composição visual.

Após as correções, TypeScript, build de produção e os 16 testes unitários passaram. A formatação foi aplicada com Prettier.

## PWA e limites da auditoria

Manifesto, ícones PNG de 192/512 px, fallback e service worker com cache por hash são gerados no build. A instalação e a navegação realmente offline em um dispositivo final não foram verificadas nesta revisão.

Não foi feita avaliação com leitores de tela reais, usuários da comunidade ou dispositivos físicos. Auditoria automatizada não é certificação WCAG. Os dados de teste são fictícios. Uma futura publicação de negócio requer conferir endereço, contatos, contraste das cores escolhidas e conteúdo com o responsável.

## Reproduzir

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run format:check
```

O runner de navegador usa Chrome em contexto isolado e reutiliza ou inicia a prévia na porta 5173. Para conferir o PWA, execute `npm run preview` após o build, faça um primeiro acesso online, aguarde a ativação do service worker e então repita a navegação sem conexão.

## Disponibilização

A prévia local usa `http://localhost:5173/`. A publicação privada não foi concluída: o projeto foi registrado no Sites, mas o script oficial `site-workflow.mjs` e a pasta da skill de hospedagem deixaram de estar disponíveis no ambiente. Nenhuma URL de produção foi validada. O ID registrado foi preservado em `.openai/hosting.json` para uma futura retomada sem criar um site duplicado.

A extensão opcional WebMCP foi implementada por detecção de recurso; sua execução em um contexto de navegador compatível não foi validada nesta revisão.
