import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { CartItem, Currency, StoreConfig } from '../types/catalog';
import { formatPrice } from '../config/storeConfig';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalItems: number;
  subtotalUSD: number;
  currency: Currency;
  storeConfig: StoreConfig;
  onIncrement: (item: CartItem['product']) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  buildWhatsAppMessage: (currency: Currency, note?: string) => string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  totalItems,
  subtotalUSD,
  currency,
  storeConfig,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
  buildWhatsAppMessage,
}) => {
  const [customerNote, setCustomerNote] = useState('');
  const [orderSent, setOrderSent] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSendWhatsApp = () => {
    const encodedMsg = buildWhatsAppMessage(currency, customerNote);
    const cleanNumber = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodedMsg}`;
    setOrderSent(true);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const totalVES = subtotalUSD * storeConfig.exchangeRate;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fondo oscuro con desenfoque táctil */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 max-w-md mx-auto z-10 flex flex-col max-h-[90vh] bg-white rounded-t-3xl shadow-2xl border-t border-slate-200/80 animate-in slide-in-from-bottom duration-300">
        {/* Agarrador Táctil (Drag Handle) */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* Encabezado del Bottom Sheet */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Tu Pedido</h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold tabular-nums">
              {totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido / Listado de Ítems */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3 overscroll-contain">
          {items.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-800">El carrito está vacío</p>
              <p className="text-xs text-slate-400 max-w-[200px] mt-1">
                Explora el catálogo y agrega tus productos favoritos.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold active:scale-95 transition-all"
              >
                Ver productos
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60 transition-all"
              >
                {/* Miniatura */}
                <div className="w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0 border border-slate-200/50">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info de Producto */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-slate-900 truncate">
                    {item.product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-slate-800 tabular-nums">
                      {formatPrice(item.product.price, currency, storeConfig.exchangeRate)}
                    </span>
                    <span className="text-[10px] text-slate-400">c/u</span>
                  </div>
                </div>

                {/* Control de Unidades */}
                <div className="flex items-center gap-1.5 shrink-0 bg-white p-1 rounded-xl border border-slate-200/80 shadow-xs">
                  <button
                    type="button"
                    onClick={() => onDecrement(item.product.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-90 transition-all"
                    aria-label="Disminuir"
                  >
                    {item.quantity === 1 ? (
                      <Trash2 className="w-3 h-3 text-rose-500" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                  </button>

                  <span className="w-5 text-center text-xs font-bold text-slate-900 tabular-nums select-none">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => onIncrement(item.product)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:scale-90 transition-all shadow-xs"
                    aria-label="Aumentar"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Eliminar Ítem Directo */}
                <button
                  type="button"
                  onClick={() => onRemove(item.product.id)}
                  className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                  aria-label="Eliminar ítem"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}

          {items.length > 0 && (
            <div className="pt-2">
              <label htmlFor="customer-note" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Instrucciones o nota de entrega (opcional)
              </label>
              <textarea
                id="customer-note"
                rows={2}
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Ej: Pago móvil al entregar, piso 4, apto 4B..."
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
              />
            </div>
          )}
        </div>

        {/* Resumen Final y Acciones */}
        {items.length > 0 && (
          <div className="px-5 pt-3 pb-6 border-t border-slate-100 bg-white space-y-3">
            {/* Totales */}
            <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Subtotal en USD</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  ${subtotalUSD.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Tasa de cambio</span>
                <span className="font-medium text-slate-700 tabular-nums">
                  Bs. {storeConfig.exchangeRate.toFixed(2)} / USD
                </span>
              </div>
              <div className="pt-2 mt-1 border-t border-slate-200/60 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Total a Pagar</span>
                  <span className="text-[10px] text-slate-400">Precios garantizados al ordenar</span>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900 tabular-nums">
                    {formatPrice(subtotalUSD, currency, storeConfig.exchangeRate)}
                  </div>
                  <div className="text-xs text-slate-500 tabular-nums">
                    Bs. {totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones: Vaciar Carrito y Enviar por WhatsApp */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClear}
                className="px-3.5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 active:scale-95 transition-all text-xs font-semibold flex items-center justify-center gap-1.5"
                title="Vaciar carrito"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Vaciar</span>
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all duration-200"
              >
                {orderSent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                    <span>¡Pedido Enviado a WhatsApp!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Confirmar por WhatsApp</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
