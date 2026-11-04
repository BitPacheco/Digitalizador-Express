import { Producto } from '../types/catalog';
import { STORE_CONFIG } from '../config/storeConfig';

/**
 * Catálogo predeterminado de respaldo con productos reales y fotos optimizadas.
 * Se utiliza cuando no se configura un ID de Google Sheets o ante fallas de red.
 */
export const FALLBACK_PRODUCTS: Producto[] = [
  {
    id: 'prod-01',
    name: 'Harina PAN Blanca 1kg',
    description: 'Harina de maíz blanco precocida tradicional, ideal para arepas y empanadas.',
    price: 1.40,
    category: 'Víveres',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
    available: true,
    sku: 'PAN-001',
  },
  {
    id: 'prod-02',
    name: 'Café Fama de América 250g',
    description: 'Café molido tostado de aroma intenso y cuerpo balanceado.',
    price: 3.20,
    category: 'Víveres',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&auto=format&fit=crop&q=80',
    available: true,
    sku: 'CAF-002',
  },
  {
    id: 'prod-03',
    name: 'Arroz Blanco Premium 1kg',
    description: 'Arroz grano largo seleccionado, rendidor y libre de impurezas.',
    price: 1.25,
    category: 'Víveres',
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&auto=format&fit=crop&q=80',
    available: true,
    sku: 'ARR-003',
  },
  {
    id: 'prod-04',
    name: 'Aceite Vegetal Mazeite 1L',
    description: 'Aceite 100% puro de maíz, libre de colesterol para cocinar ligero.',
    price: 3.90,
    category: 'Víveres',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
    available: true,
    sku: 'ACE-004',
  },
  {
    id: 'prod-05',
    name: 'Queso Paisa Pasteurizado 500g',
    description: 'Queso blanco semiduro fresco pasteurizado, ideal para rallar o rebanar.',
    price: 4.80,
    category: 'Lácteos',
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&auto=format&fit=crop&q=80',
    available: true,
    sku: 'QUE-005',
  },
  {
    id: 'prod-06',
    name: 'Leche Completa Mi Vaca 1L',
    description: 'Leche entera líquida enriquecida con vitaminas A y D.',
    price: 2.10,
    category: 'Lácteos',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    available: true,
    sku: 'LEC-006',
  },
  {
    id: 'prod-07',
    name: 'Coca Cola Original 2 Litros',
    description: 'Refresco clásico sabor original bien frío en botella descartable.',
    price: 2.50,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80',
    available: true,
    sku: 'BEB-007',
  },
  {
    id: 'prod-08',
    name: 'Agua Mineral Minalba 1.5L',
    description: 'Agua pura de manantial sin gas, hidratación refrescante y ligera.',
    price: 1.10,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400&auto=format&fit=crop&q=80',
    available: true,
    sku: 'AGU-008',
  },
  {
    id: 'prod-09',
    name: 'Galletas Oreo Chocolate 108g',
    description: 'Galletas de cacao rellenas con crema original de vainilla.',
    price: 1.20,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&auto=format&fit=crop&q=80',
    available: true,
    sku: 'SNK-009',
  },
  {
    id: 'prod-10',
    name: 'Papas Ruffles Original 130g',
    description: 'Papas crujientes onduladas con el punto perfecto de sal.',
    price: 2.30,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=80',
    available: true,
    sku: 'SNK-010',
  },
  {
    id: 'prod-11',
    name: 'Detergente en Polvo Las Llaves 1kg',
    description: 'Detergente con alto poder quitagrasa y agradable aroma a campo.',
    price: 2.80,
    category: 'Limpieza',
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&auto=format&fit=crop&q=80',
    available: true,
    sku: 'LIM-011',
  },
  {
    id: 'prod-12',
    name: 'Lavaplatos Axion Limón 450g',
    description: 'Crema lavaplatos antibarro con aroma a limón concentrado.',
    price: 1.75,
    category: 'Limpieza',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=80',
    available: true,
    sku: 'LIM-012',
  },
];

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
 * Obtiene el catálogo completo desde OpenSheet API o retorna el fallback mock si no está configurado.
 */
export async function fetchCatalog(): Promise<Producto[]> {
  const { sheetId, sheetTab } = STORE_CONFIG;

  if (!sheetId || sheetId.trim() === '') {
    // Modo demostración: retorna catálogo de respaldo local
    return FALLBACK_PRODUCTS;
  }

  const endpoint = `https://opensheet.elk.sh/${encodeURIComponent(sheetId.trim())}/${encodeURIComponent(sheetTab?.trim() || '1')}`;

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
      // Si la hoja vino vacía, se recurre defensivamente a los productos de muestra
      return FALLBACK_PRODUCTS;
    }

    return sanitizedProducts;
  } catch (err) {
    console.warn('Fallo de conexión a OpenSheet. Utilizando catálogo de respaldo.', err);
    // Retorno defensivo para no dejar la UI en blanco
    return FALLBACK_PRODUCTS;
  }
}
