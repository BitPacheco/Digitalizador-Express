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

export type ThemePreset = 'emerald' | 'amber' | 'rose' | 'indigo' | 'sky' | 'slate' | 'violet';

export interface StoreTheme {
  preset?: ThemePreset;
  primaryColor?: string;     // Color hexadecimal principal (ej: #059669)
  accentColor?: string;      // Color secundario (ej: #10b981)
  badgeBg?: string;          // Fondo de insignias
  textColor?: string;
}

export interface StoreContact {
  phone?: string;
  address?: string;
  googleMapsUrl?: string;
  instagram?: string;        // ej: "@bodegonexpress" o enlace web
  facebook?: string;
  paymentMethodsNotice?: string; // Información de métodos de pago que acepta el negocio local
}

export interface StoreConfig {
  name: string;
  description: string;
  logo?: string;
  bannerImage?: string;
  whatsappNumber: string;
  isOpen: boolean;
  openingHours: string;
  exchangeRate: number; // Tasa Bs por 1 USD
  defaultCurrency: Currency;
  sheetId?: string;
  sheetTab?: string;
  theme?: StoreTheme;
  contact?: StoreContact;
}

export interface BusinessTenantConfig extends StoreConfig {
  slug: string;                 // Identificador único de URL: ej. "bodegon-express", "burger-craft"
  tagline?: string;
  initialProducts?: Producto[]; // Catálogo predeterminado específico de este negocio
  categoryList?: string[];      // Lista de categorías predeterminadas
}

export interface CatalogState {
  products: Producto[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}
