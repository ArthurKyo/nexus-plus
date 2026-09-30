import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("jornada interativa, cores e aprendizado na landing", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: /Crie do seu jeito/ }).click();
  await expect(
    page.getByRole("heading", {
      name: "Escolha uma cor. Veja a mudança acontecer.",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cor violeta", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Cor violeta", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#color-preview")).toHaveCSS(
    "background-color",
    "rgb(115, 62, 150)",
  );
  await page.getByRole("tab", { name: /Crie do seu jeito/ }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: /Faça novas conexões/ }),
  ).toBeFocused();
  await expect(
    page.getByRole("tab", { name: /Faça novas conexões/ }),
  ).toHaveAttribute("aria-selected", "true");
  await page
    .getByRole("button", { name: "Sim, para proteger a conta" })
    .click();
  await expect(
    page.getByText("Ainda bem que estamos praticando."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Não, parece suspeito" }).click();
  await expect(
    page.getByText("Boa percepção. Esse pedido é suspeito."),
  ).toBeVisible();
  await page
    .locator("summary")
    .filter({ hasText: "Minha página já fica disponível para todo mundo?" })
    .click();
  await expect(
    page.getByText("Você começa com uma prévia salva no seu navegador.", {
      exact: false,
    }),
  ).toBeVisible();
});
test("movimento por rolagem, pausa persistente e movimento reduzido", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "active");
  const before = await page
    .locator(".future-landing")
    .evaluate((el) =>
      (el as HTMLElement).style.getPropertyValue("--orbit-rotation"),
    );
  await page.mouse.wheel(0, 700);
  await expect
    .poll(() =>
      page
        .locator(".future-landing")
        .evaluate((el) =>
          (el as HTMLElement).style.getPropertyValue("--orbit-rotation"),
        ),
    )
    .not.toBe(before);
  await page
    .getByRole("button", { name: "Pausar efeitos", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await page
    .getByRole("button", { name: "Efeitos pausados", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "active");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await expect(page.locator(".reveal-pending")).toHaveCount(0);
});
test("guias contextuais, teclado e navegação móvel acessível", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Explorar demonstração" }).click();
  await page.getByRole("button", { name: "Guia", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Entendi, vou experimentar" }).click();
  await page.keyboard.press("?");
  await expect(
    page.getByRole("heading", { name: "Seu espaço de possibilidades" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByText("Seu guia nesta etapa", { exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Me mostre o caminho" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("#sidebar")).toHaveJSProperty("inert", true);
  await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
  await expect(page.locator("#sidebar")).toHaveJSProperty("inert", false);
  await page.getByRole("link", { name: "Meu perfil", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "O seu negócio, do seu jeito." }),
  ).toBeVisible();
  await expect(page.locator("#sidebar")).toHaveJSProperty("inert", true);
});
test("contraste no modo escuro e landing com movimento reduzido", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const landing = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    landing.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page.getByRole("button", { name: "Explorar demonstração" }).click();
  await page.goto("/#/configuracoes");
  await page.getByRole("button", { name: "Escuro", exact: true }).click();
  for (const route of [
    "dashboard",
    "pagina",
    "seguranca",
    "publica",
    "qr",
    "cartao",
    "perfil",
  ]) {
    await page.goto("/#/" + route);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      route,
    ).toEqual([]);
  }
});
test("ampliação de texto mantém o acesso aos controles", async ({ page }) => {
  await page.goto("/");
  await page.addStyleTag({ content: "html{font-size:200% !important}" });
  await expect(
    page.getByRole("link", { name: "Começar agora", exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Explorar demonstração" }).click();
  await page.getByRole("button", { name: "Guia", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Entendi, vou experimentar" }),
  ).toBeVisible();
});
