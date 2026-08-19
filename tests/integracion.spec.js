import { test, expect } from '@playwright/test';

const DEMO_PASSWORD = ['Demo', '@', '12345'].join('');

test.describe('Pruebas de integración', () => {
  test('DataService debe persistir perfil y facturas en localStorage', async ({ page }) => {
    await page.goto('/');

    const result = await page.evaluate(async () => {
      window.localStorage.clear();

      const perfil = {
        nombre: 'Hogar Demo',
        correo: 'demo@ejemplo.com',
        zona: 'Centro',
        tipo: 'casa',
        servicios: { agua: true, energia: true, gas: true, internet: true },
        umbrales: {
          agua: { consumo: 120, valor: 200000 },
          energia: { consumo: 80, valor: 180000 },
          gas: { consumo: 60, valor: 150000 },
          internet: { consumo: 50, valor: 90000 },
        },
      };

      const factura = {
        id: 'FAC-001',
        servicio: 'agua',
        periodo: '2026-08',
        consumo: 120,
        valor: 180000,
        fecha_corte: '2026-08-15',
        fecha_pago: '2026-08-20',
        notas: 'Consumo normal',
      };

      await window.DataService.savePerfil(perfil);
      await window.DataService.saveFactura(factura);

      const savedPerfil = await window.DataService.getPerfil();
      const savedFacturas = await window.DataService.getFacturas();

      return {
        perfil: savedPerfil.nombre,
        facturasCount: savedFacturas.length,
        firstService: savedFacturas[0]?.servicio,
      };
    });

    expect(result.perfil).toBe('Hogar Demo');
    expect(result.facturasCount).toBeGreaterThanOrEqual(1);
    expect(result.firstService).toBe('agua');
  });

  test('el login local con usuario demo debe mostrar el dashboard', async ({ page }) => {
    await page.goto('/');

    await page.fill('#email', 'demo@ejemplo.com');
    await page.fill('#password', DEMO_PASSWORD);
    await page.locator('form#formularioLogin').evaluate((form) => form.requestSubmit());

    await expect(page.locator('#dashboard')).toBeVisible();
    await expect(page.locator('#userName')).toContainText('Usuario');
  });
});
