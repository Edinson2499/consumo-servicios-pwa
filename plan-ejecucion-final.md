# Plan de ejecución final por fases

## Fase 1 — Revisión inicial de la aplicación

### Objetivo
Diagnosticar la app y definir el alcance de calidad antes de producción.

### Actividades
- revisión de arquitectura y estructura de archivos
- revisión de pantallas y flujos principales
- análisis de seguridad del front-end
- revisión de persistencia y capa de datos
- evaluación de PWA y manifiesto

### Entregables
- evaluación funcional inicial
- hallazgos de seguridad
- identificación de riesgos y brechas de calidad

## Fase 2 — Preparación del entorno de pruebas

### Objetivo
Configurar una base ejecutable de pruebas automatizadas.

### Actividades
- instalación de Playwright
- creación de configuración global
- definición de suite por categorías
- preparación de scripts npm

### Entregables
- `playwright.config.js`
- `package.json` con scripts de QA
- estructura de carpetas `tests/`
- documento de soporte `QA.md`

## Fase 3 — Pruebas funcionales y de integración

### Objetivo
Validar que la app cumple con sus requisitos básicos y que la capa de datos funciona con la UI.

### Casos principales
- login correcto
- acceso al dashboard
- registro de cuenta
- almacenamiento de perfil
- almacenamiento de facturas
- login local con usuario demo

### Entregables
- suite `funcional.spec.js`
- suite `integracion.spec.js`

## Fase 4 — Pruebas de seguridad

### Objetivo
Detectar vulnerabilidades básicas y reforzar la protección del front-end.

### Actividades
- validación de CSP
- revisión de secretos en HTML
- validación del `manifest.json`
- pruebas de acceso no autorizado
- pruebas de payload malicioso
- análisis OWASP ZAP

### Entregables
- `seguridad.spec.js`
- `penetracion.spec.js`
- `scripts/owasp-zap.ps1`

## Fase 5 — Rendimiento y accesibilidad

### Objetivo
Validar la experiencia de uso y la calidad técnica de la interfaz.

### Actividades
- medición de tiempos de carga
- revisión de recursos bloqueantes
- análisis con `axe-core`
- validación de accesibilidad básica y controles principales

### Entregables
- `performance.spec.js`
- `accessibility.spec.js`

## Fase 6 — Firebase mockeado y backend realista

### Objetivo
Simular comportamiento de backend para validar integración más realista sin depender de Firebase en vivo.

### Actividades
- mock de `window.auth`
- mock de `window.db`
- carga de perfil y facturas simuladas
- validación de persistencia en flujo UI

### Entregables
- `firebase-mock.spec.js`

## Fase 7 — Pipeline CI/CD

### Objetivo
Automatizar la ejecución de pruebas en cada push y pull request.

### Actividades
- definir workflow de GitHub Actions
- instalar dependencias
- preparar entorno de navegador
- ejecutar Playwright
- ejecutar ZAP (si el entorno lo permite)
- publicar resultados y artefactos

### Entregables
- `.github/workflows/qa.yml`

## Fase 8 — Entrega final y PR

### Objetivo
Dejar el repositorio listo para revisión final y merge.

### Actividades
- revisión final de archivos modificados
- validación de configuración
- commit final
- push a rama de trabajo
- creación de pull request

### Criterio de salida
- QA automatizada configurada
- documento de cliente listo
- pipeline activo en GitHub Actions
- PR generado para revisión final

## Cronograma sugerido

### Semana 1
- Fases 1 a 3

### Semana 2
- Fases 4 a 6

### Semana 3
- Fases 7 y 8

## Riesgos a controlar

- navegador no instalado en entorno local
- dependencia de Docker para ZAP
- fallos de UI por cambios de DOM
- validaciones de accesibilidad con falsos positivos
- riesgo de almacenamiento local no seguro para producción

## Criterio de aceptación final

Se considerará finalizado cuando:
- la suite QA corre en CI
- el informe de cliente está preparado
- la seguridad web se revisa con ZAP o análisis equivalente
- la app cumple con pruebas funcionales, de integración y de rendimiento básicas
- el repositorio queda listo para pull request final
