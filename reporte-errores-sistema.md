# Reporte de Errores - Prueba de Sistema (Iteración 2)
**Fecha:** 14 de Agosto de 2026  
**Status:** Aún 5 Fallas después de primera iteración de fixes  
**Tasa de Éxito:** 66.7% (10/15 PASS)  
**Cambios:** Correcciones parciales aplicadas - Nuevos errores descubiertos

---

## 📊 Resumen Ejecutivo

| Iteración | Total Tests | Passed | Failed | Tasa Éxito |
|-----------|-------------|--------|--------|-----------|
| **V1 (Inicial)** | 15 | 10 | 5 | 66.7% |
| **V2 (Post-fix)** | 15 | 10 | 5 | 66.7% ❌ |

**Conclusión:** Las correcciones de v1 causaron regresiones. Necesario revertir algunos cambios.

---

## 🔴 Fallas Actuales (Iteración 2)

### FALLA #1: Penetración - Timeout en búsqueda de botón (NUEVA)
**Archivo:** `tests/penetracion.spec.js:22`  
**Error:** `Test timeout of 30000ms exceeded`

**Causa Raíz:**
- El cambio de aria-label en el botón rompe la búsqueda por rol
- `getByRole('button', { name: /entrar/i })` no encuentra el elemento
- El aria-label no está siendo usado para el búsqueda del rol

**Severidad:** 🔴 **CRÍTICA** - Test timeout

---

### FALLA #2: Funcional - Botón no encontrado (NUEVA REGRESIÓN)
**Archivo:** `tests/funcional.spec.js:10`  
**Error:** `element(s) not found`

**Causa Raíz:**
- Mismo problema: `getByRole('button', { name: /entrar/i })` falla
- El aria-label fue agregado incorrectamente
- Necesario validar que el text del botón sea accesible

**Severidad:** 🔴 **CRÍTICA** - Afecta test funcional

---

### FALLA #3: Firebase Mock - Datos vacíos
**Archivo:** `tests/firebase-mock.spec.js:87`  
**Error:** `Expected: "Hogar Mock" Received: ""`

**Causa Raíz:**
- El mock data no se está inyectando correctamente
- `result.perfil` retorna string vacío
- El timing de `addInitScript` con async/await no funciona como esperado

**Severidad:** 🟠 **MEDIA** - Mock data issue

---

### FALLA #4: Performance - resourceTimes.count = 0
**Archivo:** `tests/performance.spec.js:31`  
**Error:** `Expected: > 0 Received: 0`

**Causa Raíz:**
- `page.waitForLoadState('networkidle')` agregado pero aún no captura recursos
- `performance.getEntriesByType('resource')` retorna array vacío
- Timing de captura puede ser muy temprano

**Severidad:** 🔴 **ALTA** - No se miden recursos

---

### FALLA #5: Performance - navigation.domContentLoaded (POSIBLEMENTE ARREGLADA?)
**Archivo:** `tests/performance.spec.js:17`  
**Error:** No aparece en v2 - probablemente arreglada

**Status:** ✅ **SOLUCIONADA** - Se corrigió la variable

---

### FALLA #6: Accesibilidad - Violaciones críticas
**Archivo:** `tests/accessibility.spec.js:5`  
**Error:** `tests/accessibility.spec.js:5:3 — Cobertura de accesibilidad — la página de login no debe tener violaciones de accesibilidad críticas`

**Causa Raíz:**
- axe-core sigue detectando violaciones críticas
- Los aria-label agregados pueden no ser suficientes
- Probables problemas de contraste o estructura

**Severidad:** 🟠 **MEDIA** - Accesibilidad

---

## 🔧 Lecciones Aprendidas

### What Went Wrong
1. ❌ El cambio de `aria-label` en el botón rompió los selectores
2. ❌ Los selectores usan el **texto visible**, no el aria-label
3. ❌ El async/await en addInitScript causó timing issues
4. ❌ No se testeó localmente antes de comprometer cambios

### Quick Fixes Needed
1. ✅ Revertir aria-label en el botón (mantener texto visible)
2. ✅ Usar selectores CSS/text específicos para el botón si es necesario
3. ✅ Simplificar mock Firebase injection
4. ✅ Ajustar timing de performance test

---

## 📋 Plan de Corrección Revisado

### Priority 1 - CRÍTICA (Falla de Tests)
- [ ] Revertir aria-label en botón "Entrar" que rompe selectores
- [ ] Validar que `getByRole('button')` funcione
- [ ] Ejecutar tests nuevamente

### Priority 2 - ALTA (Performance)
- [ ] Investigar por qué resourceTimes.count = 0
- [ ] Usar alternative approach para capturar métricas
- [ ] Considerar usar `page.evaluate()` con logging

### Priority 3 - MEDIA (Firebase Mock)
- [ ] Revertir async/await en addInitScript
- [ ] Usar callback simple sin promises
- [ ] Validar que global state esté disponible

### Priority 4 - MEDIA (Accesibilidad)
- [ ] Investigar qué violaciones exactas detecta axe-core
- [ ] Agregar aria-rules solo donde sea necesario
- [ ] Mantener estructura HTML simple

