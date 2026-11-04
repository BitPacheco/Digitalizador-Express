import { StoreConfig, Currency } from '../types/catalog';

export const STORE_CONFIG: StoreConfig = {
  name: import.meta.env.VITE_STORE_NAME || 'Bodegón Express',
  description: import.meta.env.VITE_STORE_DESCRIPTION || 'Tu mercado digital rápido y confiable',
  logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120&auto=format&fit=crop&q=80',
  whatsappNumber: import.meta.env.VITE_STORE_WHATSAPP || '584120000000',
  isOpen: (import.meta.env.VITE_STORE_IS_OPEN ?? 'true') === 'true',
  openingHours: import.meta.env.VITE_STORE_OPENING_HOURS || 'Lun - Sáb: 8:00 AM - 8:00 PM',
  exchangeRate: Number(import.meta.env.VITE_EXCHANGE_RATE) || 55.20,
  defaultCurrency: (import.meta.env.VITE_DEFAULT_CURRENCY as Currency) || 'USD',
  sheetId: import.meta.env.VITE_OPENSHEET_ID || '',
  sheetTab: import.meta.env.VITE_OPENSHEET_TAB || 'Productos',
};

/**
 * Formatea un monto expresado originalmente en USD a la moneda especificada (USD o VES/Bs).
 */
export const formatPrice = (
  amountInUSD: number,
  currency: Currency,
  rate: number = STORE_CONFIG.exchangeRate
): string => {
  if (currency === 'USD') {
    return `$${amountInUSD.toFixed(2)}`;
  }
  const amountInVES = amountInUSD * rate;
  return `Bs. ${amountInVES.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Obtiene el precio equivalente secundario (si está en USD, retorna Bs, y viceversa)
 */
export const getEquivalentPrice = (
  amountInUSD: number,
  currentCurrency: Currency,
  rate: number = STORE_CONFIG.exchangeRate
): string => {
  if (currentCurrency === 'USD') {
    const amountInVES = amountInUSD * rate;
    return `Bs. ${amountInVES.toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `$${amountInUSD.toFixed(2)}`;
};
