import React from 'react';
import { Search, ShoppingBag, AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Skeleton animado de carga que replica fielmente el diseño horizontal de las tarjetas de producto.
 */
export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 py-2" aria-label="Cargando productos...">
      {[1, 2, 3, 4, 5].map((key) => (
        <div
          key={key}
          className="bg-white rounded-2xl border border-slate-200/70 p-3 flex gap-3 items-center animate-pulse"
        >
          {/* Skeleton Thumbnail */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-200 shrink-0" />

          {/* Skeleton Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-1">
            <div className="space-y-2">
              <div className="w-16 h-2.5 bg-slate-200 rounded-md" />
              <div className="w-3/4 h-3.5 bg-slate-200 rounded-md" />
              <div className="w-1/2 h-2.5 bg-slate-100 rounded-md" />
            </div>

            <div className="flex items-center justify-between gap-2 mt-2">
              <div className="space-y-1">
                <div className="w-14 h-3.5 bg-slate-200 rounded-md" />
                <div className="w-10 h-2.5 bg-slate-100 rounded-md" />
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface EmptyStateProps {
  searchQuery?: string;
  category?: string;
  onReset: () => void;
}

/**
 * Vista de estado vacío cuando ninguna búsqueda o filtro arroja resultados.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  category,
  onReset,
}) => {
  const isSearch = Boolean(searchQuery && searchQuery.trim().length > 0);

  return (
    <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-400 mb-4 shadow-xs">
        {isSearch ? (
          <Search className="w-8 h-8 text-slate-400" />
        ) : (
          <ShoppingBag className="w-8 h-8 text-slate-400" />
        )}
      </div>

      <h3 className="text-base font-bold text-slate-900 tracking-tight">
        {isSearch ? 'Sin resultados para la búsqueda' : 'No hay productos en esta categoría'}
      </h3>

      <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
        {isSearch ? (
          <>
            No encontramos coincidencias para &ldquo;<span className="font-semibold text-slate-700">{searchQuery}</span>&rdquo;. Verifica la ortografía o intenta con términos más generales.
          </>
        ) : (
          <>
            Actualmente no hay artículos disponibles en el apartado &ldquo;<span className="font-semibold text-slate-700">{category}</span>&rdquo;.
          </>
        )}
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
      >
        {isSearch ? 'Limpiar búsqueda' : 'Ver todos los productos'}
      </button>
    </div>
  );
};

interface ErrorViewProps {
  message?: string;
  onRetry: () => void;
}

/**
 * Pantalla de error con botón de reintento en caso de falla de conexión o carga.
 */
export const ErrorView: React.FC<ErrorViewProps> = ({
  message = 'Ocurrió un inconveniente al cargar el catálogo de productos.',
  onRetry,
}) => {
  return (
    <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-500 mb-4 shadow-xs">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h3 className="text-base font-bold text-slate-900 tracking-tight">
        No se pudo cargar el catálogo
      </h3>

      <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Reintentar carga</span>
      </button>
    </div>
  );
};
