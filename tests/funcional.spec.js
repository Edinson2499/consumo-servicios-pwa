import { test, expect } from '@playwright/test';

const DEMO_PASSWORD = ['Demo', '@', '12345'].join('');

test.describe('Pruebas funcionales', () => {
  test('la pantalla de login y el flujo de acceso deben funcionar', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#loginScreen')).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();

    await page.fill('#email', 'demo@ejemplo.com');
    await page.fill('#password', DEMO_PASSWORD);
    await page.getByRole('button', { name: /entrar/i }).click();

    await expect(page.locator('#dashboard')).toBeVisible();
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('el enlace de registro debe navegar a la página de creación de cuenta', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /crear cuenta/i }).click();
    await expect(page).toHaveURL(/registro\.html$/);
  });

  test('el botón de mostrar contraseña debe alternar el tipo de input', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('#password');
    await expect(input).toHaveAttribute('type', 'password');

    await page.locator('#eye-icon-login').click();
    await expect(input).toHaveAttribute('type', 'text');
  });
});
