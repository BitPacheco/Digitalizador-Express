import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { STORE_CONFIG } from './config/storeConfig';
import { Currency } from './types/catalog';
import { useCatalog } from './hooks/useCatalog';
import { useCart } from './hooks/useCart';

import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { ProductCard } from './components/ProductCard';
import { FloatingCartBar } from './components/FloatingCartBar';
import { CartDrawer } from './components/CartDrawer';
import { LoadingSkeleton, EmptyState, ErrorView } from './components/StatusViews';

export const App: React.FC = () => {
  const [currency, setCurrency] = useState<Currency>(STORE_CONFIG.defaultCurrency);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const {
    filteredProducts,
    categories,
    selectedCategory,
    searchQuery,
    isLoading,
    error,
    setSelectedCategory,
    setSearchQuery,
    reloadCatalog,
    clearSearch,
  } = useCatalog();

  const {
    items,
    totalItems,
    subtotalUSD,
    increment,
    decrement,
    removeItem,
    clearCart,
    getItemQuantity,
    buildWhatsAppMessage,
  } = useCart();

  const handleResetFilters = () => {
    clearSearch();
    setSelectedCategory('Todos');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* 1. Cabecera Fija con Marca, Estado y Selector de Moneda */}
      <Header
        storeConfig={STORE_CONFIG}
        currency={currency}
        onCurrencyToggle={setCurrency}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={clearSearch}
      />

      {/* 2. Barra Deslizable de Categorías */}
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 3. Contenedor Principal de Productos y Estados */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-3 pb-32">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error && filteredProducts.length === 0 ? (
          <ErrorView message={error} onRetry={reloadCatalog} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            category={selectedCategory}
            onReset={handleResetFilters}
          />
        ) : (
          <section className="space-y-2.5">
            <div className="flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <span>
                {selectedCategory === 'Todos' ? 'Todos los productos' : selectedCategory}
              </span>
              <span className="tabular-nums font-mono">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'disponible' : 'disponibles'}
              </span>
            </div>

            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={getItemQuantity(product.id)}
                currency={currency}
                exchangeRate={STORE_CONFIG.exchangeRate}
                onIncrement={increment}
                onDecrement={decrement}
              />
            ))}
          </section>
        )}
      </main>

      {/* 4. Barra Inferior Flotante del Carrito */}
      <FloatingCartBar
        totalItems={totalItems}
        subtotalUSD={subtotalUSD}
        currency={currency}
        exchangeRate={STORE_CONFIG.exchangeRate}
        onOpenDrawer={() => setIsCartOpen(true)}
      />

      {/* 5. Modal / Bottom Sheet del Carrito para Confirmación */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        totalItems={totalItems}
        subtotalUSD={subtotalUSD}
        currency={currency}
        storeConfig={STORE_CONFIG}
        onIncrement={increment}
        onDecrement={decrement}
        onRemove={removeItem}
        onClear={clearCart}
        buildWhatsAppMessage={buildWhatsAppMessage}
      />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
