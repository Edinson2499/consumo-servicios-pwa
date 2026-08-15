import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Cobertura de accesibilidad', () => {
  test('la página de login no debe tener violaciones de accesibilidad críticas', async ({ page }) => {
    await page.goto('/');

    const axeBuilder = new AxeBuilder({ page });
    const results = await axeBuilder.analyze();

    expect(results.violations).toEqual([]);
  });

  test('los controles principales deben tener labels o nombres accesibles', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /crear cuenta/i })).toBeVisible();
  });
});
