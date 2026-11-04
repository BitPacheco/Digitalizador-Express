import { useState, useEffect, useCallback, useMemo } from 'react';
import { BusinessTenantConfig } from '../types/catalog';
import { getTenantBySlug, getAllTenants, DEFAULT_STORE_SLUG, BUILTIN_TENANTS } from '../config/stores';

/**
 * Extrae el slug del negocio actual desde la URL (soporta Search Params, Hash y Rutas).
 */
function extractSlugFromLocation(): string | null {
  if (typeof window === 'undefined') return null;

  // 1. Prioridad: Parámetro de búsqueda (?b=slug o ?store=slug o ?t=slug)
  const params = new URLSearchParams(window.location.search);
  const querySlug = params.get('b') || params.get('store') || params.get('t') || params.get('tenant');
  if (querySlug && querySlug.trim()) {
    return querySlug.trim().toLowerCase();
  }

  // 2. Prioridad: Hash (ej: #/burger-craft o #burger-craft)
  if (window.location.hash) {
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (rawHash && !rawHash.startsWith('?') && !rawHash.includes('=')) {
      return rawHash.toLowerCase();
    }
  }

  // 3. Prioridad: Ruta pathname limpia (ej: /burger-craft)
  const path = window.location.pathname.replace(/^\/|\/$/g, '').trim();
  if (path && path !== '' && path !== 'index.html') {
    // Si la ruta coincide con un slug conocido o no es un archivo estático
    const knownSlugs = BUILTIN_TENANTS.map((t) => t.slug);
    if (knownSlugs.includes(path.toLowerCase())) {
      return path.toLowerCase();
    }
  }

  return null;
}

export interface UseTenantReturn {
  tenant: BusinessTenantConfig;
  tenantSlug: string | null;
  allTenants: BusinessTenantConfig[];
  isCommercialPortal: boolean;
  setTenantSlug: (slug: string | null) => void;
  refreshTenants: () => void;
}

export function useTenant(): UseTenantReturn {
  const [tenantSlug, setTenantSlugState] = useState<string | null>(() => extractSlugFromLocation());
  const [allTenants, setAllTenants] = useState<BusinessTenantConfig[]>(() => getAllTenants());

  const refreshTenants = useCallback(() => {
    setAllTenants(getAllTenants());
  }, []);

  // Escuchar cambios de navegación del navegador (atrás / adelante)
  useEffect(() => {
    const handleLocationChange = () => {
      const detected = extractSlugFromLocation();
      setTenantSlugState(detected);
      setAllTenants(getAllTenants());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Resuelve el objeto tenant activo
  const tenant = useMemo(() => {
    return getTenantBySlug(tenantSlug || DEFAULT_STORE_SLUG);
  }, [tenantSlug]);

  // Si no hay slug en la URL, se considera en modo Portal Comercial / Showcase
  const isCommercialPortal = tenantSlug === null;

  // Cambia el negocio activo actualizando la URL de manera limpia
  const setTenantSlug = useCallback((slug: string | null) => {
    setTenantSlugState(slug);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (slug && slug.trim()) {
        url.searchParams.set('b', slug.trim());
        url.hash = '';
      } else {
        url.searchParams.delete('b');
        url.searchParams.delete('store');
        url.searchParams.delete('t');
        url.searchParams.delete('tenant');
        url.hash = '';
      }
      window.history.pushState({}, '', url.toString());
    }
  }, []);

  return {
    tenant,
    tenantSlug,
    allTenants,
    isCommercialPortal,
    setTenantSlug,
    refreshTenants,
  };
}
