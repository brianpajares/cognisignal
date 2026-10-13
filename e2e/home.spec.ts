import { expect, test } from "@playwright/test";

test("landing explains the personal, non-diagnostic tracking flow", async ({ page }) => {
  await page.goto("/es");
  await expect(page.getByRole("heading", { name: "Observa cambios. Decide con contexto." })).toBeVisible();
  await expect(page.getByText(/no diagnostica/i)).toBeVisible();
  await page.getByRole("button", { name: /empezar seguimiento/i }).click();
  await expect(page.getByLabel("Edad")).toBeVisible();
  await page.getByRole("button", { name: /comenzar tareas/i }).click();
  await expect(page.getByRole("alert")).toHaveText("Acepta el aviso para continuar.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /comenzar tareas/i }).click();
  await expect(page.getByRole("button", { name: "Estoy listo" })).toBeVisible();
});

test("localized landing responds in English", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { name: "See change. Decide with context." })).toBeVisible();
});
