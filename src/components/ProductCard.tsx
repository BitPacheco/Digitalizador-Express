import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Producto, Currency } from '../types/catalog';
import { formatPrice, getEquivalentPrice } from '../config/storeConfig';

interface ProductCardProps {
  product: Producto;
  quantity: number;
  currency: Currency;
  exchangeRate: number;
  onIncrement: (product: Producto) => void;
  onDecrement: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  currency,
  exchangeRate,
  onIncrement,
  onDecrement,
}) => {
  const [imgError, setImgError] = useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';

  return (
    <article
      className={`group relative bg-white rounded-2xl border p-3 flex gap-3 items-center transition-all duration-200 ${
        product.available
          ? 'border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm'
          : 'border-slate-100 bg-slate-50/70 opacity-65'
      }`}
    >
      {/* Miniatura del Producto */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
        <img
          src={imgError ? fallbackImage : product.image || fallbackImage}
          alt={product.name}
          onError={() => setImgError(true)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-slate-900/90 text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Contenido Editorial del Producto */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {product.category}
            </span>
            {product.sku && (
              <span className="text-[9px] text-slate-300 font-mono">
                #{product.sku}
              </span>
            )}
          </div>
          <h2 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-1 mt-0.5">
            {product.name}
          </h2>
          {product.description && (
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {product.description}
            </p>
          )}
        </div>

        {/* Fila Inferior: Precios y Control Contador */}
        <div className="flex items-center justify-between gap-2 mt-2">
          {/* Precios (Principal + Secundario) */}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 tabular-nums tracking-tight">
              {formatPrice(product.price, currency, exchangeRate)}
            </span>
            <span className="text-[11px] text-slate-400 tabular-nums">
              {getEquivalentPrice(product.price, currency, exchangeRate)}
            </span>
          </div>

          {/* Stepper Táctil / Botón de Acción */}
          <div>
            {!product.available ? (
              <button
                type="button"
                disabled
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed"
              >
                No disponible
              </button>
            ) : quantity === 0 ? (
              <button
                type="button"
                onClick={() => onIncrement(product)}
                className="inline-flex items-center justify-center gap-1 w-9 h-9 sm:w-10 sm:h-9 px-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 shadow-xs"
                aria-label={`Agregar ${product.name} al carrito`}
              >
                <Plus className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 shadow-inner">
                <button
                  type="button"
                  onClick={() => onDecrement(product.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:text-slate-900 shadow-xs active:scale-95 transition-all"
                  aria-label={quantity === 1 ? 'Eliminar del carrito' : 'Reducir cantidad'}
                >
                  {quantity === 1 ? (
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  ) : (
                    <Minus className="w-3.5 h-3.5" />
                  )}
                </button>

                <span className="w-6 text-center text-xs font-bold text-slate-900 tabular-nums select-none">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => onIncrement(product)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs hover:bg-slate-800 active:scale-95 transition-all"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
