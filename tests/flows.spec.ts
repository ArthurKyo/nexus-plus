import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PNG } from "pngjs";
import jsQR from "jsqr";
import { readFile } from "node:fs/promises";
async function demo(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Explorar demonstração" }).click();
  await expect(page.getByRole("heading", { name: "Olá, Alex!" })).toBeVisible();
}
async function go(page: Page, route: string) {
  await page.goto("/#/" + route);
  await expect(page.locator("#main")).toBeVisible();
}
test("novo usuário: consentimento, diagnóstico, cadastro e persistência", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Começar diagnóstico", exact: true })
    .click();
  await page.getByRole("button", { name: "Concordar e começar" }).click();
  await expect(page.getByText("Marque a opção para autorizar")).toBeVisible();
  await page.locator("#consent-checkbox").check();
  await page.getByRole("button", { name: "Concordar e começar" }).click();
  for (let i = 0; i < 11; i++) {
    await expect(
      page.getByText(`Pergunta ${i + 1} de 11`, { exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Um pouco / estou aprendendo", exact: true })
      .click();
    if (i === 3) {
      await page.reload();
      await expect(
        page.getByRole("button", {
          name: "Um pouco / estou aprendendo",
          exact: true,
        }),
      ).toHaveAttribute("aria-pressed", "true");
    }
    await page
      .getByRole("button", {
        name: i === 10 ? "Ver meu resultado" : "Continuar",
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByRole("img", { name: "Índice digital: 50 de 100" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Criar meu perfil de negócio" }).click();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page.getByText("Preencha este campo.")).toBeVisible();
  await page.getByLabel("Como podemos chamar você?").fill("Marina");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByLabel("Nome do negócio").fill("Ateliê Aurora");
  await page
    .getByLabel("Categoria", { exact: true })
    .selectOption("Artesanato");
  await page
    .getByLabel("Conte um pouco")
    .fill("Presentes feitos à mão com carinho.");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByLabel("WhatsApp com DDD").fill("85999999999");
  await page.getByLabel("Cidade", { exact: true }).fill("Fortaleza");
  await page.getByLabel("Estado (UF)").fill("CE");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByLabel("Ser encontrado").check();
  await page.getByRole("button", { name: "Abrir meu espaço" }).click();
  await expect(
    page.getByRole("heading", { name: "Olá, Marina!" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Olá, Marina!" }),
  ).toBeVisible();
  await go(page, "evolucao");
  await expect(
    page.getByText("Em desenvolvimento", { exact: true }),
  ).toBeVisible();
});
test("catálogo: produto, validação, edição, busca e exclusão confirmada", async ({
  page,
}) => {
  await demo(page);
  await go(page, "produtos");
  await page
    .getByRole("button", { name: "Adicionar produto", exact: true })
    .click();
  await page.getByRole("button", { name: "Salvar produto" }).click();
  await expect(page.getByText("Preencha este campo.")).toHaveCount(2);
  await page
    .getByRole("textbox", { name: "Nome", exact: true })
    .fill("Kit presente");
  await page
    .getByLabel("Descrição", { exact: true })
    .fill("Um kit com três itens.");
  await page
    .getByRole("spinbutton", { name: "Preço (R$)", exact: true })
    .fill("90");
  await page.getByLabel("Preço promocional").fill("100");
  await page.getByRole("button", { name: "Salvar produto" }).click();
  await expect(
    page.getByText("O preço promocional deve ser menor"),
  ).toBeVisible();
  await page.getByLabel("Preço promocional").fill("75");
  await page.getByLabel("Categoria", { exact: true }).fill("Presentes");
  await page.getByRole("button", { name: "Salvar produto" }).click();
  await expect(
    page.getByRole("heading", { name: "Kit presente" }),
  ).toBeVisible();
  await page.getByRole("searchbox").fill("Kit presente");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Editar", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Nome", exact: true })
    .fill("Kit especial");
  await page.getByRole("button", { name: "Salvar produto" }).click();
  await page.getByRole("searchbox").fill("Kit especial");
  await page.getByRole("button", { name: "Excluir Kit especial" }).click();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Kit especial" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Excluir Kit especial" }).click();
  await page.getByRole("button", { name: "Excluir", exact: true }).click();
  await page.getByRole("searchbox").fill("Kit especial");
  await expect(page.getByText("Nenhum resultado encontrado.")).toBeVisible();
});
test("serviços: adicionar, editar disponibilidade, filtrar e excluir", async ({
  page,
}) => {
  await demo(page);
  await go(page, "servicos");
  await page
    .getByRole("button", { name: "Adicionar serviço", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Nome", exact: true })
    .fill("Consultoria de estilo");
  await page
    .getByRole("spinbutton", { name: "Preço (R$)", exact: true })
    .fill("80");
  await page.getByLabel("Duração em minutos").fill("60");
  await page.getByLabel("Exibir como preço inicial").check();
  await page.getByRole("button", { name: "Salvar serviço" }).click();
  await page.getByRole("searchbox").fill("Consultoria");
  await page.getByRole("button", { name: "Editar", exact: true }).click();
  await page.getByLabel("Disponível para clientes").uncheck();
  await page.getByRole("button", { name: "Salvar serviço" }).click();
  await page.getByLabel("Filtrar por disponibilidade").selectOption("no");
  await expect(
    page.getByRole("heading", { name: "Consultoria de estilo" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Excluir Consultoria de estilo" })
    .click();
  await page.getByRole("button", { name: "Excluir", exact: true }).click();
  await page.getByRole("searchbox").fill("Consultoria");
  await expect(page.getByText("Nenhum resultado encontrado.")).toBeVisible();
});
test("perfil, upload seguro, personalização ao vivo e página independente", async ({
  page,
}) => {
  await demo(page);
  await go(page, "perfil");
  await page.getByLabel("Email", { exact: true }).fill("invalido");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByText("Informe um email válido.")).toBeVisible();
  await page.getByLabel("Email", { exact: true }).fill("comercial@example.com");
  await page
    .getByLabel("Logo ou foto do negócio")
    .setInputFiles("public/icon-192.png");
  await expect(page.getByAltText("Imagem selecionada")).toBeVisible();
  await page
    .getByLabel("Descrição do negócio")
    .fill('<img src=x onerror="window.hacked=true"> Trabalho artesanal.');
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await go(page, "pagina");
  await page.getByRole("button", { name: "Classic", exact: true }).click();
  await page.getByLabel("Seu slogan").fill("A sua melhor versão.");
  await expect(page.locator("#live-preview")).toContainText(
    "A sua melhor versão.",
  );
  await page.reload();
  await expect(page.getByLabel("Seu slogan")).toHaveValue(
    "A sua melhor versão.",
  );
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Baixar minha página" }).click();
  const file = await dl;
  const path = await file.path();
  const html = await readFile(path!, "utf8");
  expect(html).toContain("Barbearia Central");
  expect(html).toContain("&lt;img");
  expect(html).not.toContain('src="/src');
  expect(html).not.toContain("localhost");
  await go(page, "publica");
  await expect(
    page.getByRole("heading", { name: "Barbearia Central" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => Reflect.get(window, "hacked")),
  ).toBeUndefined();
});
test("QR decodificável e cartão PNG", async ({ page }) => {
  await demo(page);
  await go(page, "qr");
  await page
    .getByLabel("Endereço da página publicada")
    .fill("https://example.com/barbearia");
  await page.getByRole("button", { name: "Salvar endereço" }).click();
  await page
    .getByRole("button", { name: "Gerar QR Code", exact: true })
    .click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Baixar", exact: true }).click();
  const file = await downloadPromise;
  const path = await file.path();
  const png = PNG.sync.read(await readFile(path!));
  const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  expect(decoded?.data).toBe("https://example.com/barbearia");
  await go(page, "cartao");
  await expect(page.locator("#card-qr")).toBeVisible();
  const cardPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Baixar cartão PNG" }).click();
  const card = await cardPromise;
  expect(card.suggestedFilename()).toBe("nexus-cartao-digital.png");
  const cardPng = PNG.sync.read(await readFile((await card.path())!));
  expect(cardPng.width).toBeGreaterThan(1000);
});
test("aprendizado, treinamento e histórico acadêmico", async ({ page }) => {
  await demo(page);
  await go(page, "seguranca");
  const module = page.locator(".security-module").filter({
    has: page.getByRole("heading", { name: "Uma camada extra de proteção" }),
  });
  await module.getByRole("button", { name: "Concluir aprendizado" }).click();
  await expect(page.getByText("Confira os dois passos")).toBeVisible();
  for (const cb of await module.getByRole("checkbox").all()) await cb.check();
  await module.getByRole("button", { name: "Concluir aprendizado" }).click();
  await expect(module.getByText("Concluído", { exact: true })).toBeVisible();
  await go(page, "treinamento");
  const answers = [true, false, true, true, false, true, false, true];
  for (let i = 0; i < 8; i++) {
    await page
      .getByRole("button", {
        name: answers[i] ? "Suspeito" : "Seguro",
        exact: true,
      })
      .click();
    await expect(page.getByText("Boa leitura da situação!")).toBeVisible();
    await page
      .getByRole("button", {
        name: i === 7 ? "Ver resultado" : "Próxima situação",
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "8 de 8 acertos" }),
  ).toBeVisible();
  await go(page, "impacto");
  await expect(
    page.getByRole("cell", { name: "100% de acertos", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Gerar resumo da intervenção" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Resumo da intervenção" }),
  ).toBeVisible();
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Baixar resumo HTML" }).click();
  expect((await dl).suggestedFilename()).toContain("resumo");
});
test("demonstração isolada, privacidade, tema e exclusão", async ({ page }) => {
  await demo(page);
  await go(page, "configuracoes");
  await page.getByRole("button", { name: "Escuro", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Sair da demonstração" }).click();
  await expect(
    page.getByRole("heading", { name: "Seu negócio merece ser encontrado." }),
  ).toBeVisible();
  await demo(page);
  await go(page, "privacidade");
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar meus dados" }).click();
  expect((await dl).suggestedFilename()).toContain("dados");
  await page
    .getByRole("button", { name: "Apagar meus dados", exact: true })
    .click();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Privacidade e seus dados." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Apagar meus dados", exact: true })
    .click();
  await page.getByRole("button", { name: "Apagar definitivamente" }).click();
  await expect(
    page.getByRole("heading", { name: "Seu negócio merece ser encontrado." }),
  ).toBeVisible();
  expect(
    await page.evaluate(() =>
      Object.keys(localStorage).filter((k) => k.startsWith("nexus:")),
    ),
  ).toEqual([]);
});
test("rotas públicas informam ausência de dados e links da equipe funcionam", async ({
  page,
}) => {
  await page.goto("/negocio.html?id=desconhecido");
  await expect(
    page.getByRole("heading", {
      name: "Esta página não está neste dispositivo.",
    }),
  ).toBeVisible();
  await demo(page);
  await page.goto("/equipe.html");
  await page.getByRole("link", { name: "Visão geral", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Olá, Alex!" })).toBeVisible();
});
test("responsividade: larguras solicitadas e ausência de erros de console", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await demo(page);
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "",
      "dashboard",
      "produtos",
      "servicos",
      "pagina",
      "qr",
      "cartao",
      "seguranca",
      "evolucao",
      "impacto",
      "configuracoes",
      "perfil",
      "privacidade",
    ]) {
      await go(page, route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      expect(overflow, `${route} em ${width}px`).toBe(false);
    }
  }
  expect(errors).toEqual([]);
});
test("acessibilidade WCAG A/AA nas telas principais", async ({ page }) => {
  await demo(page);
  for (const route of [
    "",
    "dashboard",
    "perfil",
    "produtos",
    "servicos",
    "pagina",
    "qr",
    "cartao",
    "seguranca",
    "evolucao",
    "impacto",
    "configuracoes",
    "privacidade",
  ]) {
    await go(page, route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      route,
    ).toEqual([]);
  }
});
