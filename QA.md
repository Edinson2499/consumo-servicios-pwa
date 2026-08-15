# Pruebas de seguridad, integración, funcionales, rendimiento y accesibilidad

## Qué incluye

- Seguridad: validación de CSP, ausencia de secretos en la página, verificación del `manifest.json` y análisis con OWASP ZAP.
- Integración: comprobación de `DataService` con `localStorage` y flujo de login local con el usuario demo.
- Funcionales: login, navegación a registro, alternancia de contraseña y acceso al dashboard.
- Rendimiento: métricas de carga y recursos en la vista principal.
- Accesibilidad: análisis con axe-core para detectar violaciones WCAG relevantes.
- Firebase mockeado: pruebas con datos simulados realistas para validar comportamiento del backend en front-end.
- Penetración básica: validación de acceso directo sin sesión, payloads maliciosos y fuga de información en consola.

## Estructura

- `tests/seguridad.spec.js`
- `tests/integracion.spec.js`
- `tests/funcional.spec.js`
- `tests/performance.spec.js`
- `tests/accessibility.spec.js`
- `tests/penetracion.spec.js`
- `tests/firebase-mock.spec.js`
- `playwright.config.js`
- `scripts/owasp-zap.ps1`

## Ejecutar

```bash
npm install
npx playwright install chromium
npx playwright test
```

## Scripts rápidos

```bash
npm run test:seguridad
npm run test:integracion
npm run test:funcional
npm run test:rendimiento
npm run test:accesibilidad
npm run test:penetracion
npm run test:firebase:mock
npm run test:owasp-zap
```

## OWASP ZAP

Se incluye un script de apoyo para ejecutar un escaneo básico con ZAP en un entorno Docker:

```powershell
pwsh -File scripts/owasp-zap.ps1
```

## Observación

Esta PWA usa scripts inline y carga recursos externos (Bootstrap, Bootstrap Icons, Firebase). Por eso la política CSP incluye `unsafe-inline` y los dominios necesarios para evitar bloqueos del navegador y preservar la experiencia funcional.
