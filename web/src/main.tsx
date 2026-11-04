import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { Currency } from './types/catalog';
import { useTenant } from './hooks/useTenant';
import { useCatalog } from './hooks/useCatalog';
import { useCart } from './hooks/useCart';

import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { ProductCard } from './components/ProductCard';
import { FloatingCartBar } from './components/FloatingCartBar';
import { CartDrawer } from './components/CartDrawer';
import { LoadingSkeleton, EmptyState, ErrorView } from './components/StatusViews';
import { BusinessInfoModal } from './components/BusinessInfoModal';
import { CommercialLanding } from './components/CommercialLanding';
import { StoreAdminOnboarding } from './components/StoreAdminOnboarding';
import { ChevronLeft, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const {
    tenant,
    isCommercialPortal,
    setTenantSlug,
    refreshTenants,
  } = useTenant();

  const [currency, setCurrency] = useState<Currency>(tenant.defaultCurrency || 'USD');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Sincroniza la moneda predeterminada al cambiar de negocio
  useEffect(() => {
    if (tenant.defaultCurrency) {
      setCurrency(tenant.defaultCurrency);
    }
  }, [tenant.slug, tenant.defaultCurrency]);

  // Actualiza el título de la pestaña del navegador dinámicamente según el cliente
  useEffect(() => {
    if (tenant && !isCommercialPortal) {
      document.title = `${tenant.name} | Catálogo Digital`;
    } else {
      document.title = 'Digitalizador Express | Catálogos y Menús Interactivos';
    }
  }, [tenant, isCommercialPortal]);

  // Hook del catálogo alimentado por la configuración del negocio activo
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
  } = useCatalog(tenant);

  // Hook del carrito con aislamiento estricto de datos por negocio
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
  } = useCart(tenant);

  const handleResetFilters = () => {
    clearSearch();
    setSelectedCategory('Todos');
  };

  const handleTenantCreated = (newSlug: string) => {
    refreshTenants();
    setTenantSlug(newSlug);
  };

  // 1. Si no hay negocio especificado en la URL, muestra el Portal Comercial / Vitrina de Demos
  if (isCommercialPortal) {
    return (
      <>
        <CommercialLanding
          onSelectTenant={(slug) => setTenantSlug(slug)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
        />
        <StoreAdminOnboarding
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onTenantCreated={handleTenantCreated}
        />
      </>
    );
  }

  // 2. Si hay un negocio especificado en la URL (ej: /?b=slug o /slug), renderiza el Catálogo Móvil
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Barra Superior Discreta de Navegación Comercial */}
      <nav aria-label="Navegación de negocios" className="bg-slate-900 text-white px-4 py-1.5 flex items-center justify-between text-[11px] z-30">
        <button
          type="button"
          onClick={() => setTenantSlug(null)}
          className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Ver otros negocios / Demos</span>
        </button>

        <button
          type="button"
          onClick={() => setIsOnboardingOpen(true)}
          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          <span>Personalizar ($10 USD)</span>
        </button>
      </nav>

      {/* 1. Cabecera Fija con Marca, Estado, Info y Selector de Moneda */}
      <Header
        storeConfig={tenant}
        currency={currency}
        onCurrencyToggle={setCurrency}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={clearSearch}
        onOpenInfo={() => setIsInfoModalOpen(true)}
      />

      {/* 2. Barra Deslizable de Categorías */}
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        theme={tenant.theme}
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
                exchangeRate={tenant.exchangeRate}
                theme={tenant.theme}
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
        exchangeRate={tenant.exchangeRate}
        theme={tenant.theme}
        onOpenDrawer={() => setIsCartOpen(true)}
      />

      {/* 5. Modal / Bottom Sheet del Carrito para Confirmación por WhatsApp */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        totalItems={totalItems}
        subtotalUSD={subtotalUSD}
        currency={currency}
        storeConfig={tenant}
        onIncrement={increment}
        onDecrement={decrement}
        onRemove={removeItem}
        onClear={clearCart}
        buildWhatsAppMessage={buildWhatsAppMessage}
      />

      {/* 6. Modal de Información del Negocio (Horarios, Ubicación Maps, Contacto) */}
      <BusinessInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        tenant={tenant}
      />

      {/* 7. Asistente Rápido de Onboarding y Personalización ($10 USD) */}
      <StoreAdminOnboarding
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onTenantCreated={handleTenantCreated}
      />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
