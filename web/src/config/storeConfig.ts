import { StoreConfig, Currency, BusinessTenantConfig } from '../types/catalog';
import { BODEGON_EXPRESS_STORE } from './stores/bodegon-express';

export const STORE_CONFIG: StoreConfig = BODEGON_EXPRESS_STORE;

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

export { BODEGON_EXPRESS_STORE };
export type { BusinessTenantConfig };
