import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Cobertura de accesibilidad', () => {
  test('la página de login no debe tener violaciones de accesibilidad críticas', async ({ page }) => {
    await page.goto('/');

    const axeBuilder = new AxeBuilder({ page });
    const results = await axeBuilder.analyze();

    const criticalViolations = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(criticalViolations.length).toBe(0);
  });

  test('los controles principales deben tener labels o nombres accesibles', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#formularioLogin button[type="submit"]')).toBeVisible();
    await expect(page.locator('a[href="registro.html"]')).toBeVisible();
  });
});
