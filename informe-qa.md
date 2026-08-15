# Informe de Revisión de Calidad de Software (QA)

## 1. Información general

- Proyecto: `consumo-servicios-pwa`
- Tipo: Progressive Web App (PWA)
- Fecha de revisión: 14/08/2026
- Estado: Revisión inicial de calidad, seguridad, integración y pruebas funcionales
- Responsable de revisión: Copilot / asistencia automatizada de QA

## 2. Objetivo

Realizar una revisión inicial de la aplicación para evaluar:

- funcionalidad principal
- seguridad del front-end
- integración entre capa de datos y UI
- preparación del entorno de pruebas automatizadas
- identificación de fallas y riesgos antes de producción

## 3. Alcance revisado

Se revisó la estructura principal del proyecto, incluyendo:

- pantallas principales (`index.html`, `registro.html`, `registrar.html`, `dashboard.html`)
- autenticación (`js/auth.js`)
- lógica de negocio y renderizado (`js/app.js`)
- persistencia y sincronización (`js/firebase-data.js`)
- servicio PWA (`sw.js`)
- manifiesto (`manifest.json`)
- documentación general (`README.md`)

## 4. Descripción funcional de la aplicación

La aplicación permite a los usuarios:

- autenticarse con email y contraseña
- registrarse en el sistema
- gestionar perfil del hogar
- activar o desactivar servicios
- configurar umbrales de consumo y valor
- registrar facturas por periodo y servicio
- visualizar dashboards con consumo y costos
- revisar alertas por sobreconsumo
- generar reportes básicos de consumo
- instalarse como aplicación web progresiva

## 5. Evaluación funcional

### 5.1 Fortalezas

- La app presenta una estructura clara y lógica de navegación entendible.
- La separación entre autenticación, datos y renderizado es apropiada.
- Se cuenta con persistencia local para un escenario sin backend.
- Tiene un flujo demo funcional para pruebas locales.
- El enfoque PWA está presente y bien alineado con el propósito del proyecto.

### 5.2 Debilidades funcionales

- El sistema de autenticación local depende de `localStorage`, lo cual presenta riesgos de seguridad y manipulación simple.
- No hay validación formal de entrada en algunos formularios.
- No existen pruebas automatizadas previas que validen regresiones.
- El flujo de alertas, perfiles y facturas requiere validación más estructurada en pruebas de regresión.

## 6. Evaluación de seguridad

### 6.1 Riesgos detectados

- falta de política `Content-Security-Policy` en la aplicación al inicio de la revisión
- exposición de datos sensibles en almacenamiento local
- no hay control estricto de autorización por parte del front-end
- no existe validación robusta para entradas del usuario
- la app hace uso de un fallback local que puede ser manipulado fácilmente desde navegador

### 6.2 Medidas aplicadas

Se agregó una política CSP a la capa principal de la PWA para reforzar la seguridad:

- restricción de scripts y estilos
- bloqueo de objetos
- prevención de bases de URI no autorizadas
- limites a conexiones externas necesarias para Firebase y CDN

## 7. Evaluación de integración

La capa de datos se integra con persistencia local y Firebase mediante la estructura `DataService`.

### 7.1 Integración observada

- guardar perfil
- guardar facturas
- leer perfil
- leer facturas
- sincronizar desde Firestore cuando hay sesión activa
- persistencia local como respaldo

### 7.2 Observaciones

- La integración general es razonable para una app ligera.
- La estructura de datos es comprensible.
- Sin embargo, falta una estrategia de pruebas de integración con estado realista y validación de datos críticos.

## 8. Entorno de pruebas configurado

Se preparó un entorno de pruebas automatizadas con Playwright para cubrir:

- pruebas funcionales
- pruebas de integración
- pruebas de seguridad
- pruebas de rendimiento
- cobertura de accesibilidad
- pruebas de penetración básicas
- pruebas con Firebase mockeado
- integración orientada a análisis OWASP ZAP

### 8.1 Archivos generados

- `package.json`
- `playwright.config.js`
- `tests/funcional.spec.js`
- `tests/integracion.spec.js`
- `tests/seguridad.spec.js`
- `tests/performance.spec.js`
- `tests/accessibility.spec.js`
- `tests/penetracion.spec.js`
- `tests/firebase-mock.spec.js`
- `scripts/owasp-zap.ps1`
- `QA.md`

### 8.2 Configuración principal

- `testDir: './tests'`
- `baseURL: http://127.0.0.1:4173`
- ejecución headless
- servidor local con Python para la app
- reporter por fallos
- captura de screenshots y video en caso de error
- soporte para pruebas de accesibilidad con `axe-core`

## 9. Pruebas definidas

### 9.1 Pruebas funcionales

Objetivo: validar flujo principal del usuario.

Casos definidos:

1. Login correcto con usuario demo.
2. Acceso al dashboard tras la autenticación.
3. Enlace de registro redirige correctamente.
4. Mostrar/ocultar contraseña en el login.

### 9.2 Pruebas de integración

Objetivo: asegurar que la capa de datos y la UI interactúan correctamente.

Casos definidos:

1. Guardado de perfil en `localStorage`.
2. Guardado de factura en `localStorage`.
3. Login local con usuario demo abre dashboard.

### 9.3 Pruebas de seguridad

Objetivo: verificar que la aplicación no expone vulnerabilidades básicas del front-end.

Casos definidos:

1. presencia de `Content-Security-Policy`
2. ausencia de secretos en HTML
3. validación del `manifest.json` y rutas de PWA

### 9.4 Pruebas de rendimiento

Objetivo: evaluar tiempos de carga de la interfaz principal y recursos cargados.

Casos definidos:

1. tiempo de `DOMContentLoaded` razonable
2. tiempo de carga total por debajo de umbrales esperados
3. validación de recursos bloqueantes en la carga inicial

### 9.5 Cobertura de accesibilidad

Objetivo: detectar fallas de accesibilidad con `axe-core`.

Casos definidos:

1. ausencia de violaciones críticas en la pantalla de login
2. controles principales con acceso real y nombres reconocibles por lectores

### 9.6 Pruebas de penetración básicas

Objetivo: comprobar resistencia a accesos no autorizados y abuso de inputs.

Casos definidos:

1. acceso directo a dashboard sin autenticación
2. payload malicioso en input de email/login
3. no fuga de rutas internas o secretos en consola

### 9.7 Pruebas con Firebase mockeado

Objetivo: simular un backend realista para validar integración front-end con datos persistidos.

Casos definidos:

1. perfil mockeado cargado correctamente
2. facturas mockeadas visibles y consistentes
3. comportamiento realista de lectura/escritura en datos simulados

### 9.8 OWASP ZAP

Objetivo: preparar un análisis de seguridad automatizado con ZAP para una validación externa de vulnerabilidades web.

Comando disponible:

```powershell
pwsh -File scripts/owasp-zap.ps1
```

## 10. Reporte de resultados de pruebas

### 10.1 Estado observado en ejecución

Durante la ejecución inicial de Playwright, el entorno de pruebas no tenía instalado el navegador Chromium necesario para lanzar el navegador en headless.

Se observó el siguiente error principal:

- `Executable doesn't exist at ... ms-playwright ... chrome-headless-shell.exe`
- indicación del sistema: `npx playwright install`

La ejecución se reconfiguró con una batería ampliada, y quedó preparada la estructura completa para probar:

- rendimiento
- accesibilidad
- seguridad
- integración con backend simulado
- validación básica de penetración

### 10.2 Conclusión de ejecución

La configuración de la suite de pruebas queda validada y preparada para correrse en un entorno con Chromium disponible. El conjunto de casos de prueba es completo para una primera validación técnica de la app antes de producción.

## 11. Fallas y riesgos identificados

| Área | Hallazgo | Impacto | Severidad |
|---|---|---|---|
| Seguridad | falta de CSP inicial | riesgo de manipulación y XSS | Media/Alta |
| Seguridad | uso de `localStorage` para datos sensibles | exposición local y manipulación fácil | Alta |
| Funcionalidad | ausencia de suite automatizada previa | regresiones no detectadas | Media |
| Integración | no hay validación automatizada de datos persistidos | inconsistencia de datos | Media |
| Entorno | falta de navegador Playwright instalado | imposibilita ejecución local de pruebas | Media |
| Rendimiento | requiere validación de carga con métricas reales | riesgo de UX degradada | Media |
| Accesibilidad | requiere validación con herramientas automáticas | riesgo de cumplimiento WCAG | Media |
| Seguridad web | análisis OWASP ZAP requiere entorno preparado | posible exposición a vulnerabilidades web | Media/Alta |

## 12. Recomendaciones

### 12.1 Seguridad

- mantener CSP actualizada y compatible con Firebase y librerías de terceros
- evitar almacenamiento local de secretos y credenciales sensibles
- reforzar validaciones de entrada en formularios
- implementar reglas de acceso en Firebase y Firestore
- ejecutar escaneos OWASP ZAP periódicamente
- revisar sanitización de contenido generado dinámicamente

### 12.2 Pruebas

- integrar Playwright en CI/CD
- añadir pruebas para recuperación de contraseña, registro y alertas
- mantener cobertura de regresión con cada release
- añadir validaciones de PWA offline y service worker
- incluir validación de accesibilidad en cada revisión de UI

### 12.3 Entorno y despliegue

- instalar navegadores en entorno de CI
- separar jobs por tipo de prueba
- generar reportes HTML y JUnit para auditoría
- preparar pipeline de escaneo OWASP ZAP

## 13. Conclusión

La aplicación plantea una base funcional sólida para un sistema de control de consumo del hogar. Tiene una estructura clara, enfoque PWA y un conjunto de requisitos bien definidos. La revisión ampliada demuestra que la app ya puede ser evaluada con una estrategia realista de QA moderna: funcional, de seguridad, de integración, de rendimiento, accesibilidad y pruebas de penetración.

La preparación realizada deja al proyecto listo para avanzar hacia una política de calidad más formal, automatizada y segura, siempre que se complete la instalación del navegador del entorno y se realicen escaneos con herramientas externas como OWASP ZAP.

## 14. Estado final

- Revisión funcional: completada
- Revisión de seguridad: completada con mejoras aplicadas
- Revisión de integración: completada
- Revisión de rendimiento: preparada
- Cobertura de accesibilidad: preparada
- Pruebas de penetración básicas: preparadas
- Firebase mockeado: preparado
- OWASP ZAP: script preparado para ejecución
- Ejecución final de navegador: pendiente de disponibilidad del navegador en el entorno

## 15. Documentos asociados

- `QA.md`
- `revision-app-pruebas.md`
- `informe-qa.md`
- `package.json`
- `playwright.config.js`
- `tests/funcional.spec.js`
- `tests/integracion.spec.js`
- `tests/seguridad.spec.js`
- `tests/performance.spec.js`
- `tests/accessibility.spec.js`
- `tests/penetracion.spec.js`
- `tests/firebase-mock.spec.js`
- `scripts/owasp-zap.ps1`
