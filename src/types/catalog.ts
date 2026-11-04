export type Currency = 'USD' | 'VES';

export interface Producto {
  id: string;
  name: string;
  description: string;
  price: number; // En USD base
  category: string;
  image: string;
  available: boolean;
  sku?: string;
}

export interface CartItem {
  product: Producto;
  quantity: number;
}

export interface StoreConfig {
  name: string;
  description: string;
  logo?: string;
  whatsappNumber: string;
  isOpen: boolean;
  openingHours: string;
  exchangeRate: number; // Tasa Bs por 1 USD
  defaultCurrency: Currency;
  sheetId?: string;
  sheetTab?: string;
}

export interface CatalogState {
  products: Producto[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}
