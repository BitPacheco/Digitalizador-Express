// Validation script for Digitalizador Express critical flows
import assert from 'node:assert';

console.log('--- INICIANDO VALIDACIÓN DE FLUJOS CRÍTICOS ---\n');

// 1. Validar Tenants Incorporados
import { BUILTIN_TENANTS, getTenantBySlug, DEFAULT_STORE_SLUG } from './src/config/stores/index.ts';
import { formatPrice, getEquivalentPrice } from './src/config/storeConfig.ts';
import { sanitizeCatalogRow } from './src/services/catalogService.ts';

console.log('1. Validando Registro de Tenants Multi-Negocio...');
assert.strictEqual(BUILTIN_TENANTS.length, 4, 'Deben existir 4 negocios base');
const slugs = BUILTIN_TENANTS.map(t => t.slug);
assert.deepStrictEqual(slugs, ['bodegon-express', 'burger-craft', 'cafe-aroma', 'farmacia-vital']);
console.log('   ✓ 4 negocios base verificados:', slugs.join(', '));

// 2. Validar Independencia de Datos entre Negocios
console.log('2. Validando Independencia Estricta de Datos...');
const bodegon = getTenantBySlug('bodegon-express');
const burger = getTenantBySlug('burger-craft');
const cafe = getTenantBySlug('cafe-aroma');
const farmacia = getTenantBySlug('farmacia-vital');

assert.notStrictEqual(bodegon.name, burger.name);
assert.notStrictEqual(bodegon.whatsappNumber, burger.whatsappNumber);
assert.notStrictEqual(bodegon.theme?.primaryColor, burger.theme?.primaryColor);
assert.notStrictEqual(cafe.theme?.preset, farmacia.theme?.preset);
assert.notStrictEqual(bodegon.initialProducts?.[0]?.name, burger.initialProducts?.[0]?.name);
console.log('   ✓ Cada negocio tiene nombre, WhatsApp, paleta y catálogo completamente independientes');

// 3. Validar Fallback de Slugs Desconocidos
console.log('3. Validando Resolución de Slugs y Fallback...');
const fallbackTenant = getTenantBySlug('negocio-inexistente-123');
assert.strictEqual(fallbackTenant.slug, DEFAULT_STORE_SLUG, 'Debe retornar bodegon-express como fallback');
const caseInsensitiveTenant = getTenantBySlug('BURGER-CRAFT');
assert.strictEqual(caseInsensitiveTenant.slug, 'burger-craft', 'Debe ser insensible a mayúsculas');
console.log('   ✓ Fallback seguro y tolerancia a mayúsculas comprobada');

// 4. Validar Formateo de Precios y Tasas de Cambio
console.log('4. Validando Conversión de Monedas y Precios...');
const rate = 55.20;
const priceUsd = 10.00;
const formattedUsd = formatPrice(priceUsd, 'USD', rate);
const formattedVes = formatPrice(priceUsd, 'VES', rate);
const equivalentOfUsd = getEquivalentPrice(priceUsd, 'USD', rate);
const equivalentOfVes = getEquivalentPrice(priceUsd, 'VES', rate);

assert.strictEqual(formattedUsd, '$10.00');
assert.strictEqual(formattedVes, 'Bs. 552,00');
assert.strictEqual(equivalentOfUsd, 'Bs. 552,00');
assert.strictEqual(equivalentOfVes, '$10.00');
console.log(`   ✓ USD: ${formattedUsd} -> VES: ${formattedVes} a tasa ${rate}`);

// 5. Validar Sanitización de Filas de Google Sheets (Modo Dinámico)
console.log('5. Validando Sanitización de Google Sheets...');
const validRow = {
  'Nombre': 'Empanada de Cazón',
  'Precio': '$ 2.50',
  'Categoria': 'Desayunos',
  'Foto': 'https://example.com/empanada.jpg',
  'Disponible': 'SI',
  'Codigo': 'EMP-01'
};
const sanitized = sanitizeCatalogRow(validRow, 0);
assert(sanitized !== null);
assert.strictEqual(sanitized.name, 'Empanada de Cazón');
assert.strictEqual(sanitized.price, 2.50);
assert.strictEqual(sanitized.category, 'Desayunos');
assert.strictEqual(sanitized.available, true);
assert.strictEqual(sanitized.sku, 'EMP-01');

// Fila inválida sin nombre
const invalidRow = { 'Precio': '5.00' };
assert.strictEqual(sanitizeCatalogRow(invalidRow, 1), null);

// Disponibilidad negativa
const outOfStockRow = { 'Nombre': 'Jugo de Naranja', 'Precio': '1.50', 'Disponible': 'AGOTADO' };
const sanitizedOut = sanitizeCatalogRow(outOfStockRow, 2);
assert(sanitizedOut !== null);
assert.strictEqual(sanitizedOut.available, false);
console.log('   ✓ Sanitización defensiva verificada');

console.log('\n--- TODAS LAS VALIDACIONES DE LÓGICA CRÍTICA PASARON SATISFACTORIAMENTE ---');
