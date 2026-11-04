import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { CartItem, Producto, Currency, BusinessTenantConfig } from '../types/catalog';
import { STORE_CONFIG } from '../config/storeConfig';

export interface UseCartReturn {
  items: CartItem[];
  totalItems: number;
  subtotalUSD: number;
  getSubtotalVES: (rate?: number) => number;
  addItem: (product: Producto, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  increment: (product: Producto) => void;
  decrement: (productId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  buildWhatsAppMessage: (currency: Currency, customerNote?: string, configOverride?: BusinessTenantConfig) => string;
}

export function useCart(tenant?: BusinessTenantConfig): UseCartReturn {
  const activeTenant = tenant || (STORE_CONFIG as BusinessTenantConfig);
  const tenantSlug = activeTenant.slug || 'default';
  const storageKey = `digitalizador_cart_${tenantSlug}`;

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('No se pudo recuperar el carrito de localStorage', e);
    }
    return [];
  });

  // Referencia para evitar sobreescritura accidental al cambiar de tenant
  const currentSlugRef = useRef(tenantSlug);

  // Recarga el carrito cuando cambia el tenant/negocio para garantizar aislamiento total
  useEffect(() => {
    if (currentSlugRef.current !== tenantSlug) {
      currentSlugRef.current = tenantSlug;
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setItems(parsed);
            return;
          }
        }
      } catch (e) {
        console.warn('Error cambiando carrito de tenant', e);
      }
      setItems([]);
    }
  }, [tenantSlug, storageKey]);

  // Persistencia automática en localStorage por cada negocio de manera aislada
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (e) {
      console.warn('No se pudo guardar el carrito en localStorage', e);
    }
  }, [items, storageKey]);

  const addItem = useCallback((product: Producto, quantity = 1) => {
    if (!product.available) return;
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  }, []);

  const increment = useCallback((product: Producto) => {
    addItem(product, 1);
  }, [addItem]);

  const decrement = useCallback((productId: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === productId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((i) => i.product.id !== productId);
      }
      return prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemQuantity = useCallback(
    (productId: string): number => {
      const item = items.find((i) => i.product.id === productId);
      return item ? item.quantity : 0;
    },
    [items]
  );

  const totalItems = useMemo(() => {
    return items.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [items]);

  const subtotalUSD = useMemo(() => {
    return items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  }, [items]);

  const getSubtotalVES = useCallback(
    (rate = activeTenant.exchangeRate): number => {
      return subtotalUSD * rate;
    },
    [subtotalUSD, activeTenant.exchangeRate]
  );

  const buildWhatsAppMessage = useCallback(
    (currency: Currency, customerNote?: string, configOverride?: BusinessTenantConfig): string => {
      const targetConfig = configOverride || activeTenant;
      const rate = targetConfig.exchangeRate || 55.20;

      const lines: string[] = [];
      lines.push(`🛒 *PEDIDO: ${targetConfig.name}*`);
      lines.push('───────────────────────');

      items.forEach((item) => {
        const itemTotalUSD = (item.product.price * item.quantity).toFixed(2);
        const itemTotalVES = (item.product.price * item.quantity * rate).toLocaleString('es-VE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        const priceLabel = currency === 'USD' ? `$${itemTotalUSD}` : `Bs. ${itemTotalVES}`;
        lines.push(`• ${item.quantity}x ${item.product.name} — ${priceLabel}`);
      });

      lines.push('───────────────────────');
      lines.push(`*Subtotal USD:* $${subtotalUSD.toFixed(2)}`);

      const totalVES = (subtotalUSD * rate).toLocaleString('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      lines.push(`*Subtotal en Bs:* Bs. ${totalVES} (Tasa: ${rate})`);
      lines.push(`*Moneda preferida de pago:* ${currency === 'USD' ? 'Dólares (USD)' : 'Bolívares (Bs / Pago Móvil)'}`);

      if (customerNote && customerNote.trim()) {
        lines.push('');
        lines.push(`📝 *Nota:* ${customerNote.trim()}`);
      }

      lines.push('');
      lines.push('Hola, me gustaría confirmar este pedido. ¿Tienen disponibilidad y cuáles son sus métodos de pago?');

      return encodeURIComponent(lines.join('\n'));
    },
    [items, subtotalUSD, activeTenant]
  );

  return {
    items,
    totalItems,
    subtotalUSD,
    getSubtotalVES,
    addItem,
    removeItem,
    updateQuantity,
    increment,
    decrement,
    clearCart,
    getItemQuantity,
    buildWhatsAppMessage,
  };
}
