import { test, expect } from '@playwright/test';

test.describe('Pruebas de seguridad', () => {
  test('debe incluir política CSP y no exponer secretos en la página principal', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveCount(1);

    const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");

    const html = await page.content();
    const forbiddenPatterns = [
      /apiKey/i,
      /private_key/i,
      /FIREBASE_CONFIG_JSON/i,
      /firebase-config\.json/i,
    ];

    for (const pattern of forbiddenPatterns) {
      expect(html).not.toMatch(pattern);
    }
  });

  test('la app debe servir la PWA sin exponer rutas no autorizadas', async ({ page }) => {
    await page.goto('/manifest.json');
    await expect(page).toHaveURL(/manifest\.json$/);

    const manifest = await page.textContent('body');
    expect(manifest).toContain('"name"');
    expect(manifest).toContain('"start_url"');
    expect(manifest).toContain('"scope"');
  });
});
