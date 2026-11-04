import { Producto, BusinessTenantConfig } from '../types/catalog';
import { STORE_CONFIG } from '../config/storeConfig';
import { BODEGON_EXPRESS_STORE } from '../config/stores/bodegon-express';

/**
 * Catálogo predeterminado de respaldo con productos reales y fotos optimizadas.
 * Se utiliza cuando no se configura un ID de Google Sheets o ante fallas de red.
 */
export const FALLBACK_PRODUCTS: Producto[] = BODEGON_EXPRESS_STORE.initialProducts || [];

/**
 * Sanitiza números de precio en formatos variados (ej: "$ 1.50", "2,40", "3.00 USD", 4)
 */
function sanitizePrice(rawPrice: unknown): number {
  if (typeof rawPrice === 'number' && !Number.isNaN(rawPrice)) {
    return Math.max(0, rawPrice);
  }

  if (typeof rawPrice === 'string') {
    let clean = rawPrice.trim();
    // Reemplaza comas decimales si no tiene puntos (ej: "2,50" -> "2.50")
    if (clean.includes(',') && !clean.includes('.')) {
      clean = clean.replace(',', '.');
    } else {
      clean = clean.replace(/,/g, '');
    }
    // Extrae sólo dígitos y punto decimal
    const matches = clean.match(/[-+]?\d*\.?\d+/);
    if (matches) {
      const parsed = parseFloat(matches[0]);
      return Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
    }
  }

  return 0;
}

/**
 * Normaliza campos booleanos de disponibilidad
 */
function sanitizeAvailability(raw: unknown): boolean {
  if (typeof raw === 'boolean') return raw;
  if (raw === undefined || raw === null || raw === '') return true;

  const normalized = String(raw).trim().toLowerCase();
  const negativeFlags = ['no', 'false', '0', 'agotado', 'inactivo', 'sin stock', 'off'];
  return !negativeFlags.includes(normalized);
}

/**
 * Busca valores por múltiples claves candidatas sin importar mayúsculas o acentos
 */
function findRowValue(row: Record<string, unknown>, candidateKeys: string[]): unknown {
  const rowEntries = Object.entries(row);
  for (const candidate of candidateKeys) {
    const targetNorm = candidate.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const [key, val] of rowEntries) {
      const keyNorm = key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      if (keyNorm === targetNorm) {
        return val;
      }
    }
  }
  return undefined;
}

/**
 * Transforma una fila cruda de Google Sheets en un objeto Producto tipado y sanitizado.
 */
export function sanitizeCatalogRow(row: Record<string, unknown>, index: number): Producto | null {
  const nameVal = findRowValue(row, ['nombre', 'producto', 'name', 'item', 'titulo', 'descripcion_corta']);
  const name = nameVal ? String(nameVal).trim() : '';

  // Si la fila no tiene nombre, se descarta
  if (!name) {
    return null;
  }

  const idVal = findRowValue(row, ['id', 'codigo', 'code', 'sku', 'ref']) || `prod-${index + 1}`;
  const id = String(idVal).trim();

  const descVal = findRowValue(row, ['descripcion', 'description', 'detalle', 'observacion']) || '';
  const description = String(descVal).trim();

  const priceVal = findRowValue(row, ['precio', 'price', 'precio usd', 'precio_usd', 'costo', 'valor']);
  const price = sanitizePrice(priceVal);

  const catVal = findRowValue(row, ['categoria', 'category', 'departamento', 'rubro', 'grupo', 'seccion']) || 'General';
  const category = String(catVal).trim() || 'General';

  const imgVal = findRowValue(row, ['imagen', 'image', 'foto', 'url imagen', 'url', 'link']) || '';
  const image = String(imgVal).trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80';

  const availVal = findRowValue(row, ['disponible', 'available', 'activo', 'en stock', 'stock', 'status']);
  const available = sanitizeAvailability(availVal);

  return {
    id,
    name,
    description,
    price,
    category,
    image,
    available,
    sku: id,
  };
}

/**
 * Obtiene el catálogo completo del negocio desde OpenSheet API (si tiene sheetId)
 * o retorna su catálogo predeterminado de respaldo.
 */
export async function fetchCatalog(tenant?: BusinessTenantConfig): Promise<Producto[]> {
  const targetSheetId = tenant?.sheetId ?? STORE_CONFIG.sheetId;
  const targetSheetTab = tenant?.sheetTab ?? STORE_CONFIG.sheetTab ?? 'Productos';
  const tenantFallback = tenant?.initialProducts && tenant.initialProducts.length > 0
    ? tenant.initialProducts
    : FALLBACK_PRODUCTS;

  if (!targetSheetId || targetSheetId.trim() === '') {
    // Modo directo / de alta velocidad: retorna el catálogo configurado en el negocio
    return tenantFallback;
  }

  const endpoint = `https://opensheet.elk.sh/${encodeURIComponent(targetSheetId.trim())}/${encodeURIComponent(targetSheetTab?.trim() || '1')}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en OpenSheet (${response.status} ${response.statusText})`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('La respuesta de Google Sheets no contiene un listado válido de filas.');
    }

    const sanitizedProducts: Producto[] = [];

    data.forEach((row, idx) => {
      if (typeof row === 'object' && row !== null) {
        const item = sanitizeCatalogRow(row as Record<string, unknown>, idx);
        if (item) {
          sanitizedProducts.push(item);
        }
      }
    });

    if (sanitizedProducts.length === 0) {
      // Si la hoja vino vacía, se recurre defensivamente a los productos predeterminados
      return tenantFallback;
    }

    return sanitizedProducts;
  } catch (err) {
    console.warn('Fallo de conexión a OpenSheet. Utilizando catálogo de respaldo del negocio.', err);
    // Retorno defensivo para no dejar la UI en blanco
    return tenantFallback;
  }
}
