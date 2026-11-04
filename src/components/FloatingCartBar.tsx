import React from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { Currency } from '../types/catalog';
import { formatPrice, getEquivalentPrice } from '../config/storeConfig';

interface FloatingCartBarProps {
  totalItems: number;
  subtotalUSD: number;
  currency: Currency;
  exchangeRate: number;
  onOpenDrawer: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  totalItems,
  subtotalUSD,
  currency,
  exchangeRate,
  onOpenDrawer,
}) => {
  if (totalItems === 0) {
    return null;
  }

  return (
    <aside aria-label="Resumen flotante del carrito" className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 pointer-events-none">
      <div className="pointer-events-auto backdrop-blur-md bg-slate-900/95 text-white rounded-2xl p-3 shadow-2xl border border-slate-700/50 flex items-center justify-between gap-3 transform transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-4">
        {/* Lado Izquierdo: Icono + Contador + Precios */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0 w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md tabular-nums border-2 border-slate-900">
              {totalItems}
            </span>
          </div>

          <div className="min-w-0">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
              Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-white tabular-nums tracking-tight">
                {formatPrice(subtotalUSD, currency, exchangeRate)}
              </span>
              <span className="text-xs text-slate-400 tabular-nums font-normal truncate">
                {getEquivalentPrice(subtotalUSD, currency, exchangeRate)}
              </span>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Botón de Apertura del Drawer */}
        <button
          type="button"
          onClick={onOpenDrawer}
          className="shrink-0 inline-flex items-center gap-1.5 bg-white text-slate-900 hover:bg-slate-100 active:scale-[0.98] font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-xs transition-all duration-200"
        >
          <span>Ver pedido</span>
          <ChevronRight className="w-4 h-4 text-slate-900" />
        </button>
      </div>
    </aside>
  );
};
