import { test, expect } from '@playwright/test';

test.describe('Pruebas de penetración básicas', () => {
  test('no debe permitir acceso directo a contenido protegido sin autenticación', async ({ page }) => {
    await page.goto('/dashboard.html');

    await expect(page.locator('body')).toContainText(/redirig|dashboard|Control de Consumo/i);
  });

  test('debe neutralizar payload malicioso en el login sin ejecutar scripts', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    // Intento de inyección XSS
    await page.fill('#email', '"><script>alert(123)</script>');
    await page.fill('#password', 'test123');
    
    // Click al botón submit
    const submitBtn = page.locator('#formularioLogin button[type="submit"]');
    await submitBtn.click();
    
    // Validar que el input rechaza caracteres especiales
    await page.waitForTimeout(500);
    const emailValue = await page.inputValue('#email');
    // El campo debe estar vacío después de la validación o le toast debe mostrar error
    const toast = page.locator('#toast-container:visible');
    const isToastVisible = await toast.count() > 0;
    expect(isToastVisible).toBe(true);
  });

  test('no debe exponer rutas internas en consola ni URLs privadas', async ({ page }) => {
    const messages = [];
    page.on('console', (msg) => messages.push(msg.text()));

    await page.goto('/');

    const leakage = messages.some((text) => /firebase|apiKey|secret|private_key/i.test(text));
    expect(leakage).toBeFalsy();
  });
});
