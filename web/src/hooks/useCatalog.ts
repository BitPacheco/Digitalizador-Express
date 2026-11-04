import { useState, useEffect, useMemo, useCallback } from 'react';
import { Producto, BusinessTenantConfig } from '../types/catalog';
import { fetchCatalog } from '../services/catalogService';

export interface UseCatalogReturn {
  products: Producto[];
  filteredProducts: Producto[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  reloadCatalog: () => Promise<void>;
  clearSearch: () => void;
}

export function useCatalog(tenant?: BusinessTenantConfig): UseCatalogReturn {
  const [products, setProducts] = useState<Producto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCatalog(tenant);
      setProducts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar el catálogo de productos.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [tenant]);

  // Recarga cuando cambia el negocio (tenant)
  useEffect(() => {
    loadData();
    setSelectedCategory('Todos');
    setSearchQuery('');
  }, [tenant?.slug, loadData]);

  // Lista única de categorías ordenadas, iniciando siempre con "Todos"
  const categories = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((p) => {
      if (p.category && p.category.trim()) {
        unique.add(p.category.trim());
      }
    });
    return ['Todos', ...Array.from(unique)];
  }, [products]);

  // Filtrado reactivo por categoría y texto de búsqueda
  const filteredProducts = useMemo(() => {
    const normalize = (text: string) =>
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const queryNorm = normalize(searchQuery.trim());

    return products.filter((item) => {
      // Filtro por categoría
      const matchesCategory =
        selectedCategory === 'Todos' ||
        item.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim();

      if (!matchesCategory) {
        return false;
      }

      // Si no hay búsqueda escrita, pasa
      if (!queryNorm) {
        return true;
      }

      // Búsqueda en nombre y descripción
      const nameNorm = normalize(item.name);
      const descNorm = normalize(item.description || '');

      return nameNorm.includes(queryNorm) || descNorm.includes(queryNorm);
    });
  }, [products, selectedCategory, searchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    products,
    filteredProducts,
    categories,
    selectedCategory,
    searchQuery,
    isLoading,
    error,
    setSelectedCategory,
    setSearchQuery,
    reloadCatalog: loadData,
    clearSearch,
  };
}
