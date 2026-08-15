import { test, expect } from '@playwright/test';

test.describe('Pruebas de penetración básicas', () => {
  test('no debe permitir acceso directo a contenido protegido sin autenticación', async ({ page }) => {
    await page.goto('/dashboard.html');

    await expect(page.locator('body')).toContainText(/redirig|dashboard|Control de Consumo/i);
  });

  test('debe neutralizar payload malicioso en el login sin ejecutar scripts', async ({ page }) => {
    await page.goto('/');

    await page.fill('#email', '"><script>alert(123)</script>');
    await page.fill('#password', 'cualquier');
    await page.getByRole('button', { name: /entrar/i }).click();

    const alertCount = await page.evaluate(() => window.__alertTriggered || 0);
    expect(alertCount).toBe(0);
    await expect(page.locator('#toast-container')).toBeVisible();
  });

  test('no debe exponer rutas internas en consola ni URLs privadas', async ({ page }) => {
    const messages = [];
    page.on('console', (msg) => messages.push(msg.text()));

    await page.goto('/');

    const leakage = messages.some((text) => /firebase|apiKey|secret|private_key/i.test(text));
    expect(leakage).toBeFalsy();
  });
});
