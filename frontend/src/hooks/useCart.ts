import { useState, useEffect, useMemo, useCallback } from 'react';
import { CartItem, Producto, Currency } from '../types/catalog';
import { STORE_CONFIG } from '../config/storeConfig';

const CART_STORAGE_KEY = 'digitalizador_cart_v1';

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
  buildWhatsAppMessage: (currency: Currency, customerNote?: string) => string;
}

export function useCart(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
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

  // Persistencia automática en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('No se pudo guardar el carrito en localStorage', e);
    }
  }, [items]);

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
    (rate = STORE_CONFIG.exchangeRate): number => {
      return subtotalUSD * rate;
    },
    [subtotalUSD]
  );

  const buildWhatsAppMessage = useCallback(
    (currency: Currency, customerNote?: string): string => {
      const lines: string[] = [];
      lines.push(`🛒 *PEDIDO: ${STORE_CONFIG.name}*`);
      lines.push('───────────────────────');

      items.forEach((item) => {
        const itemTotalUSD = (item.product.price * item.quantity).toFixed(2);
        const itemTotalVES = (item.product.price * item.quantity * STORE_CONFIG.exchangeRate).toLocaleString('es-VE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        const priceLabel = currency === 'USD' ? `$${itemTotalUSD}` : `Bs. ${itemTotalVES}`;
        lines.push(`• ${item.quantity}x ${item.product.name} — ${priceLabel}`);
      });

      lines.push('───────────────────────');
      lines.push(`*Subtotal USD:* $${subtotalUSD.toFixed(2)}`);

      const totalVES = (subtotalUSD * STORE_CONFIG.exchangeRate).toLocaleString('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      lines.push(`*Subtotal en Bs:* Bs. ${totalVES} (Tasa: ${STORE_CONFIG.exchangeRate})`);
      lines.push(`*Moneda preferida de pago:* ${currency === 'USD' ? 'Dólares (USD)' : 'Bolívares (Bs / Pago Móvil)'}`);

      if (customerNote && customerNote.trim()) {
        lines.push('');
        lines.push(`📝 *Nota:* ${customerNote.trim()}`);
      }

      lines.push('');
      lines.push('Hola, me gustaría confirmar este pedido. ¿Tienen disponibilidad y cuáles son sus métodos de pago?');

      return encodeURIComponent(lines.join('\n'));
    },
    [items, subtotalUSD]
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
