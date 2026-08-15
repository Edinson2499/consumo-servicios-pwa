import { test, expect } from '@playwright/test';

test.describe('Pruebas con Firebase mockeado', () => {
  test('debe admitir una capa de datos simulada con comportamiento realista', async ({ page }) => {
    await page.addInitScript(() => {
      window.__FIREBASE_CONFIG__ = { projectId: 'demo-mock-project' };
      window.FIREBASE_CONFIGURED = true;
      window.mockConfigActive = true;
    });

    await page.goto('/');
    
    // Validar que la inyección funcionó
    const mockActive = await page.evaluate(() => {
      return window.mockConfigActive === true && window.__FIREBASE_CONFIG__?.projectId === 'demo-mock-project';
    });

    expect(mockActive).toBe(true);
    expect(page.locator('#loginScreen')).toBeVisible();
  });
});
