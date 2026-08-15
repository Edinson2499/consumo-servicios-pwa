import { test, expect } from '@playwright/test';

test.describe('Pruebas de rendimiento', () => {
  test('la página principal debe cargar dentro de umbrales razonables', async ({ page }) => {
    const metrics = await page.goto('/');

    const navigation = await page.evaluate(() => {
      const entries = performance.getEntriesByType('navigation');
      const nav = entries[0];
      return {
        domContentLoaded: nav ? nav.domContentLoadedEventEnd : 0,
        load: nav ? nav.loadEventEnd : 0,
        responseStart: nav ? nav.responseStart : 0,
      };
    });

    expect(metrics.domContentLoaded).toBeLessThan(2500);
    expect(metrics.load).toBeLessThan(4000);
    expect(page.locator('#loginScreen')).toBeVisible();
  });

  test('no debe haber demasiados recursos bloqueantes en la carga inicial', async ({ page }) => {
    const resourceTimes = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource');
      return {
        count: entries.length,
        slowest: Math.max(...entries.map((entry) => entry.duration || 0), 0),
      };
    });

    expect(resourceTimes.count).toBeGreaterThan(0);
    expect(resourceTimes.slowest).toBeLessThan(2000);
  });
});
