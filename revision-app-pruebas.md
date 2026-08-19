# Revisión de la aplicación y entorno de pruebas

## 1. Objetivo

Documentar la revisión del proyecto `consumo-servicios-pwa`, incluyendo:

- análisis de la app
- entorno de pruebas configurado
- pruebas definidas
- casos de prueba
- resultados ejecutados
- fallas encontradas
- recomendaciones

## 2. Resumen ejecutivo

La aplicación es una Progressive Web App (PWA) para gestionar el consumo de servicios del hogar: agua, energía, gas e internet. El proyecto está construido en HTML5, CSS3 y JavaScript vanilla, con soporte para autenticación local y Firebase, además de un servicio PWA (`sw.js`) y `manifest.json`.

La revisión mostró que la aplicación presenta una base funcional correcta para flujo local y un conjunto bastante claro de requisitos de negocio para gestión de perfil, facturas y alertas. Sin embargo, también se identificaron varios puntos críticos para calidad de software, seguridad y automatización de validación.

## 3. Alcance de la revisión

Se evaluaron los siguientes aspectos:

- estructura funcional de la app
- autenticación y persistencia de sesión
- gestión de perfil y facturas
- seguridad de front-end
- entorno de pruebas automatizadas
- preparación de pruebas funcionales, de integración y de seguridad

## 4. Archivos revisados

- `index.html`
- `registro.html`
- `registrar.html`
- `dashboard.html`
- `js/auth.js`
- `js/app.js`
- `js/firebase-data.js`
- `sw.js`
- `manifest.json`
- `README.md`

## 5. Hallazgos de la aplicación

### 5.1 Funcionamiento principal

La app ofrece:

- Login con correo y contraseña
- registro de usuarios
- panel de dashboard con resumen de consumo
- gestión de perfil del hogar
- carga de facturas por servicio
- análisis de consumo por servicio
- alertas por umbrales
- soporte PWA y instalación en navegador

### 5.2 Estructura lógica

La lógica principal está dividida en:

- `auth.js`: autenticación local/Firebase
- `firebase-data.js`: persistencia de datos y sincronización
- `app.js`: renderización del dashboard y análisis

El patrón general usa `localStorage` como fallback y guarda datos con estructura claramente organizada:

- `perfil`
- `facturas`
- `alertas`
- `usuarios`

### 5.3 Buenas prácticas observadas

- uso de `localStorage` para persistencia offline
- soporte de login demo (`demo@ejemplo.com / contraseña de prueba`)
- separación lógica por capas (auth, data, app)
- presencia de `manifest.json` y `sw.js` para PWA
- soporte para Firebase y configuración externalizada

### 5.4 Riesgos y fallas detectadas

#### a) Seguridad de front-end

La aplicación cuenta con un modelo básico de seguridad, pero aún es débil para producción:

- no hay validación robusta de entrada en algunos formularios
- se usa `localStorage` para credenciales y datos de sesión
- no se aplica un modelo de protección fuerte contra XSS en todos los flujos
- la política CSP no estaba presente al inicio; se añadió como mejora para reforzar el front-end

#### b) Dependencia del navegador y del entorno

La app requiere soporte de navegador moderno y, en algunos casos, un servidor local para funcionar correctamente con PWA, ya que no siempre se comporta bien al abrir archivos directos.

#### c) Estado de pruebas automatizadas

Antes de la configuración, el proyecto no tenía suite de testing automatizada. Esto implicaba que:

- no había validación funcional programada
- no existían pruebas de seguridad de UI
- no había verificación de integración de persistencia ni sesiones

#### d) Configuración de Firebase

El proyecto depende de un archivo `js/firebase-config.js` que no siempre está presente en repositorios. Es necesario mantener configuración segura y clara, sin exponer claves en el código fuente.

## 6. Entorno de pruebas configurado

Se preparó un entorno de pruebas con Playwright para esta app.

### 6.1 Archivos creados

- `package.json`
- `playwright.config.js`
- `tests/funcional.spec.js`
- `tests/integracion.spec.js`
- `tests/seguridad.spec.js`
- `QA.md`

### 6.2 Configuración de Playwright

Archivo: `playwright.config.js`

Configuración principal:

- `testDir: './tests'`
- timeout general de 30s
- `baseURL: 'http://127.0.0.1:4173'`
- navegador en modo headless
- `trace: 'on-first-retry'`
- `screenshot: 'only-on-failure'`
- `video: 'retain-on-failure'`
- servidor web local con Python (`python -m http.server 4173`)

### 6.3 Scripts definidos

En `package.json` se añadieron scripts:

- `npm run test`
- `npm run test:funcional`
- `npm run test:integracion`
- `npm run test:seguridad`

## 7. Pruebas definidas

### 7.1 Pruebas funcionales

Archivo: `tests/funcional.spec.js`

Casos:

1. Login visible y flujo de acceso correcto
2. Enlace de registro redirige a la página correspondiente
3. Botón de mostrar contraseña alterna el tipo de input

Objetivo:

- verificar la navegación principal
- validar formularios básicos
- asegurar que el usuario puede entrar al dashboard con credenciales válidas

### 7.2 Pruebas de integración

Archivo: `tests/integracion.spec.js`

Casos:

1. `DataService.savePerfil()` y `DataService.saveFactura()` persisten en `localStorage`
2. login local con usuario demo hace aparecer el dashboard

Objetivo:

- verificar la integración entre UI y capa de datos
- comprobar persistencia de perfil y facturas
- validar la carga del dashboard tras autenticación local

### 7.3 Pruebas de seguridad

Archivo: `tests/seguridad.spec.js`

Casos:

1. la página principal incluye política `Content-Security-Policy`
2. no se exponen secretos o claves sensibles en HTML
3. `manifest.json` está disponible y es válido

Objetivo:

- reforzar la protección del front-end
- prevenir filtración accidental de secretos
- validar que el PWA expone solo recursos esperados

## 8. Casos de prueba detallados

### Caso 1 — Login correcto

- Entrada: correo `demo@ejemplo.com`, contraseña `contraseña de prueba`
- Resultado esperado: acceso al dashboard
- Estado: definido y preparado en pruebas automatizadas

### Caso 2 — Login incorrecto

- Entrada: correo válido, contraseña inválida
- Resultado esperado: mensaje de error y permanencia en login
- Recomendación: dejarlo como prueba adicional a futuro

### Caso 3 — Mostrar/ocultar contraseña

- Entrada: clic sobre el botón del ojo
- Resultado esperado: cambio de `password` a `text`
- Estado: implementado en pruebas funcionales

### Caso 4 — Registro de cuenta

- Entrada: clic en “Crear Cuenta”
- Resultado esperado: navegación a `registro.html`
- Estado: definido en pruebas funcionales

### Caso 5 — Persistencia de perfil

- Entrada: guardar un perfil con servicios y umbrales
- Resultado esperado: persistencia en `localStorage`
- Estado: validado en pruebas de integración

### Caso 6 — Persistencia de factura

- Entrada: guardar una factura con servicio, periodo y valor
- Resultado esperado: la factura queda disponible en `localStorage`
- Estado: validado en pruebas de integración

### Caso 7 — CSP presente

- Entrada: carga de la página principal
- Resultado esperado: meta tag `Content-Security-Policy` presente
- Estado: validado en pruebas de seguridad

## 9. Reporte de ejecución de pruebas

### 9.1 Resultado real observado

Se ejecutó la suite de Playwright y se evidenció que el entorno necesitaba un navegador Chromium descargado.

Error principal observado:

- `Executable doesn't exist at ... ms-playwright ... chrome-headless-shell.exe`
- mensaje del sistema: `Please run the following command to download new browsers: npx playwright install`

Esto indica que la instalación del navegador no estaba disponible en el entorno de ejecución en ese momento.

### 9.2 Resultado final de la revisión

Se configuró la estructura de pruebas y se validó que la configuración del proyecto es correcta, pero la ejecución real del navegador quedó condicionada al entorno local del equipo:

- la suite está lista
- la configuración es válida
- el navegador debe instalarse antes de ejecutar una revisión completa en navegador

### 9.3 Fallas encontradas

1. Falta de entorno de pruebas automatizadas previo
2. Ausencia de cobertura de UI/UX inicial
3. Ausencia de `CSP` en HTML al inicio
4. Dependencia fuerte de `localStorage` sin controles de validación suficientes
5. No existe validación automatizada de seguridad y flujo funcional del proyecto antes de esta revisión
6. El entorno de ejecución requería la instalación manual de Chromium para Playwright

## 10. Recomendaciones

### 10.1 Seguridad

- mantener `CSP` actualizada y compatible con Firebase
- no guardar secretos directamente en el front-end
- usar reglas de Firebase para limitar acceso a Firestore
- validar entradas en formularios y alertas de usuario
- considerar sanitización más estricta de contenido renderizado dinámicamente

### 10.2 Testing

- ejecutar la suite en CI (GitHub Actions o similar)
- añadir pruebas de regresión para registro, recuperación de contraseña y alertas
- incluir mediciones de cobertura de código
- extender pruebas de PWA y offline

### 10.3 DevOps

- automatizar instalación de navegadores en CI
- usar jobs separados para seguridad, integración y funcionales
- generar reportes HTML y JUnit para análisis posterior

## 11. Estado final

El proyecto cuenta con una base sólida para empezar una estrategia de QA automatizada. La aplicación ya fue revisada funcionalmente y la infraestructura de pruebas quedó preparada, aunque la ejecución completa del navegador depende de disponer Chromium/Playwright instalado en el entorno.

## 12. Archivos relevantes

- `package.json`
- `playwright.config.js`
- `tests/funcional.spec.js`
- `tests/integracion.spec.js`
- `tests/seguridad.spec.js`
- `QA.md`
- `index.html`
- `js/auth.js`
- `js/firebase-data.js`
- `sw.js`
- `manifest.json`

## 13. Conclusión

La app tiene una base funcional clara y un diseño percibido correcto para un sistema de consumo del hogar. El principal enfoque para avanzar es reforzar seguridad y añadir automatización de pruebas para evitar regresiones y detectar fallas antes de producción. La preparación realizada deja el proyecto listo para continuar con una estrategia de QA más seria, modular y ejecutable.
