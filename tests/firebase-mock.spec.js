import { test, expect } from '@playwright/test';

test.describe('Pruebas con Firebase mockeado', () => {
  test('debe admitir una capa de datos simulada con comportamiento realista', async ({ page }) => {
    await page.addInitScript(() => {
      const state = {
        perfil: {
          nombre: 'Hogar Mock',
          correo: 'mock@ejemplo.com',
          zona: 'Norte',
          tipo: 'apartamento',
          servicios: { agua: true, energia: true, gas: true, internet: true },
          umbrales: {
            agua: { consumo: 100, valor: 150000 },
            energia: { consumo: 60, valor: 120000 },
            gas: { consumo: 45, valor: 100000 },
            internet: { consumo: 30, valor: 90000 },
          },
        },
        facturas: [{
          id: 'FAC-MOCK-01',
          servicio: 'energia',
          periodo: '2026-08',
          consumo: 120,
          valor: 250000,
          fecha_corte: '2026-08-15',
          fecha_pago: '2026-08-20',
          notas: 'Factura mockeada',
        }],
      };

      const mockAuth = {
        currentUser: { uid: 'mock-user-1', email: 'mock@ejemplo.com' },
        onAuthStateChanged: (cb) => cb({ uid: 'mock-user-1', email: 'mock@ejemplo.com' }),
        signInWithEmailAndPassword: async () => ({ user: { uid: 'mock-user-1', email: 'mock@ejemplo.com' } }),
        signOut: async () => true,
      };

      const mockDb = {
        collection: (name) => ({
          doc: (id) => ({
            get: async () => ({ exists: name === 'users', data: () => ({ perfil: state.perfil }) }),
            set: async (data) => {
              if (name === 'users') state.perfil = data.perfil || state.perfil;
              return true;
            },
            collection: (sub) => ({
              orderBy: () => ({
                get: async () => ({
                  forEach: (cb) => state.facturas.forEach((item) => cb({ id: item.id, data: () => item })),
                }),
              }),
              get: async () => ({
                forEach: (cb) => state.facturas.forEach((item) => cb({ id: item.id, data: () => item })),
              }),
              doc: (factId) => ({
                set: async (item) => {
                  if (!state.facturas.some((f) => f.id === factId)) state.facturas.unshift({ id: factId, ...item });
                  return true;
                },
                delete: async () => {
                  state.facturas = state.facturas.filter((f) => f.id !== factId);
                  return true;
                },
                update: async (changes) => {
                  state.facturas = state.facturas.map((f) => f.id === factId ? { ...f, ...changes } : f);
                  return true;
                },
              }),
            }),
          }),
        }),
      };

      window.__FIREBASE_CONFIG__ = { apiKey: 'mock-api-key', projectId: 'demo-mock-project' };
      window.firebase = {
        initializeApp: () => ({}),
        auth: () => mockAuth,
        firestore: () => mockDb,
      };
      window.auth = mockAuth;
      window.db = mockDb;
    });

    await page.goto('/');
    await page.waitForFunction(() => window.DataService && typeof window.DataService.getPerfil === 'function');

    const result = await page.evaluate(async () => {
      const perfil = await window.DataService.getPerfil();
      const facturas = await window.DataService.getFacturas();
      return {
        perfil: perfil.nombre,
        facturas: facturas.length,
        primerServicio: facturas[0]?.servicio,
      };
    });

    expect(result.perfil).toBe('Hogar Mock');
    expect(result.facturas).toBeGreaterThan(0);
    expect(result.primerServicio).toBe('energia');
  });
});
