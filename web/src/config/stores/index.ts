import { BusinessTenantConfig } from '../../types/catalog';
import { BODEGON_EXPRESS_STORE } from './bodegon-express';
import { BURGER_CRAFT_STORE } from './burger-craft';
import { CAFE_AROMA_STORE } from './cafe-aroma';
import { FARMACIA_VITAL_STORE } from './farmacia-vital';

export const BUILTIN_TENANTS: BusinessTenantConfig[] = [
  BODEGON_EXPRESS_STORE,
  BURGER_CRAFT_STORE,
  CAFE_AROMA_STORE,
  FARMACIA_VITAL_STORE,
];

export const DEFAULT_STORE_SLUG = 'bodegon-express';

const CUSTOM_TENANTS_STORAGE_KEY = 'digitalizador_custom_tenants';

/**
 * Obtiene los negocios personalizados almacenados dinámicamente en el navegador.
 */
export function getStoredCustomTenants(): BusinessTenantConfig[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return [];
    }
    const raw = localStorage.getItem(CUSTOM_TENANTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error leyendo negocios personalizados de localStorage', e);
  }
  return [];
}

/**
 * Guarda un nuevo negocio personalizado en localStorage para previsualización inmediata.
 */
export function saveCustomTenant(tenant: BusinessTenantConfig): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    const current = getStoredCustomTenants();
    const filtered = current.filter((t) => t.slug !== tenant.slug);
    filtered.push(tenant);
    localStorage.setItem(CUSTOM_TENANTS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error guardando negocio personalizado', e);
  }
}

/**
 * Elimina un negocio personalizado de localStorage.
 */
export function removeCustomTenant(slug: string): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    const current = getStoredCustomTenants();
    const filtered = current.filter((t) => t.slug !== slug);
    localStorage.setItem(CUSTOM_TENANTS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error eliminando negocio personalizado', e);
  }
}

/**
 * Retorna todos los negocios registrados (estáticos + personalizados).
 */
export function getAllTenants(): BusinessTenantConfig[] {
  const custom = getStoredCustomTenants();
  const allMap = new Map<string, BusinessTenantConfig>();

  BUILTIN_TENANTS.forEach((t) => allMap.set(t.slug, t));
  custom.forEach((t) => allMap.set(t.slug, t));

  return Array.from(allMap.values());
}

/**
 * Busca un negocio por su identificador único (slug). Si no existe, retorna el negocio predeterminado.
 */
export function getTenantBySlug(slug?: string | null): BusinessTenantConfig {
  if (!slug) {
    return BODEGON_EXPRESS_STORE;
  }

  const cleanSlug = slug.toLowerCase().trim();

  // 1. Busca en negocios personalizados primero
  const customList = getStoredCustomTenants();
  const foundCustom = customList.find((t) => t.slug.toLowerCase() === cleanSlug);
  if (foundCustom) return foundCustom;

  // 2. Busca en los negocios incorporados
  const foundBuiltin = BUILTIN_TENANTS.find((t) => t.slug.toLowerCase() === cleanSlug);
  if (foundBuiltin) return foundBuiltin;

  // 3. Fallback seguro
  return BODEGON_EXPRESS_STORE;
}
