import React from 'react';
import { Store, Search, X } from 'lucide-react';
import { Currency, StoreConfig } from '../types/catalog';

interface HeaderProps {
  storeConfig: StoreConfig;
  currency: Currency;
  onCurrencyToggle: (currency: Currency) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  storeConfig,
  currency,
  onCurrencyToggle,
  searchQuery,
  onSearchChange,
  onSearchClear,
}) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/85 border-b border-slate-200/80 transition-colors">
      <div className="max-w-md mx-auto px-4 pt-3 pb-2.5">
        {/* Fila Principal: Logo, Datos del Negocio y Selector de Moneda */}
        <div className="flex items-center justify-between gap-3">
          {/* Identidad del Negocio */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
              {storeConfig.logo ? (
                <img
                  src={storeConfig.logo}
                  alt={storeConfig.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store className="w-5 h-5 text-slate-700" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-slate-900 text-base leading-tight truncate tracking-tight">
                  {storeConfig.name}
                </h1>
                {/* Badge de Estado: Abierto / Cerrado */}
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                    storeConfig.isOpen
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      storeConfig.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  {storeConfig.isOpen ? 'Abierto' : 'Cerrado'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5 font-normal">
                {storeConfig.openingHours}
              </p>
            </div>
          </div>

          {/* Toggle Táctil de Moneda (USD / Bs) */}
          <div className="shrink-0 flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/70 shadow-inner">
            <button
              type="button"
              onClick={() => onCurrencyToggle('USD')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
                currency === 'USD'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              aria-label="Ver precios en Dólares"
            >
              USD $
            </button>
            <button
              type="button"
              onClick={() => onCurrencyToggle('VES')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
                currency === 'VES'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              aria-label="Ver precios en Bolívares"
            >
              Bs
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda Táctil */}
        <div className="mt-2.5 relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar productos, marcas, categorías..."
              className="w-full bg-slate-100/90 text-slate-900 text-xs sm:text-sm pl-9 pr-8 py-2 rounded-xl border border-slate-200/60 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all duration-200"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={onSearchClear}
                className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-700 active:scale-95 transition-all"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
