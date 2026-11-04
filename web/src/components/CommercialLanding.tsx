import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Clock, Smartphone } from 'lucide-react';
import { BUILTIN_TENANTS } from '../config/stores';

interface CommercialLandingProps {
  onSelectTenant: (slug: string) => void;
  onOpenOnboarding: () => void;
}

export const CommercialLanding: React.FC<CommercialLandingProps> = ({
  onSelectTenant,
  onOpenOnboarding,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/85 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xs">
              D
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm tracking-tight block leading-tight">
                Digitalizador Express
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Catálogos & Menús Interactivos
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Personalizar ($10 USD)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 pt-8 pb-10 text-center">
        {/* Badge de Oferta Comercial */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-4 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Microservicio Llave en Mano — Solo $10 USD (Pago Único)</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-2xl mx-auto">
          El catálogo digital interactivo que vende directamente por{' '}
          <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">
            WhatsApp
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-3 leading-relaxed">
          Diseñado para bodegones, restaurantes, cafeterías y pequeños comercios. Sin suscripciones recurrentes, sin comisiones por ventas y listo para entregar en <strong>menos de 90 minutos</strong>.
        </p>

        {/* Pilares Comerciales */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto mt-6">
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs text-left">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 block leading-tight">Carga Ultrarrápida</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Optimizado para 3G/4G móvil</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs text-left">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 block leading-tight">&lt; 90 Minutos</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Entrega con tu URL propia</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs text-left">
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-1.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 block leading-tight">Binance & Airtm</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Pago seguro sin comisiones</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs text-left">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5">
              <Smartphone className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 block leading-tight">Mobile-First</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Experiencia fluida tipo app</span>
          </div>
        </div>
      </section>

      {/* Demos en Vivo por Vertical Comercial */}
      <section className="max-w-4xl w-full mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Explora las Demos en Vivo
            </h2>
            <p className="text-xs text-slate-500">
              Cada negocio cuenta con su propia identidad, colores, productos y URL independiente.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {BUILTIN_TENANTS.map((tenant) => (
            <div
              key={tenant.slug}
              className="group bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={tenant.logo}
                      alt={tenant.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {tenant.name}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        /?b={tenant.slug}
                      </span>
                    </div>
                  </div>

                  <span
                    className="w-3 h-3 rounded-full shrink-0 mt-1 shadow-xs"
                    style={{ backgroundColor: tenant.theme?.primaryColor || '#059669' }}
                    title="Color de identidad del negocio"
                  />
                </div>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {tenant.description}
                </p>

                <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500">
                  <span className="tabular-nums font-semibold">
                    {tenant.initialProducts?.length || 0} productos
                  </span>
                  <span>•</span>
                  <span>Tasa Bs. {tenant.exchangeRate.toFixed(2)}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">WhatsApp integrado</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  {tenant.openingHours.split('|')[0]}
                </span>

                <button
                  type="button"
                  onClick={() => onSelectTenant(tenant.slug)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
                >
                  <span>Ver Catálogo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flujo de 3 Pasos y Formulario de Entrega Rápida */}
      <section className="bg-white border-t border-slate-200/80 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center max-w-lg mx-auto mb-8">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Flujo de Personalización en 3 Pasos
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Tu catálogo listo y funcionando en menos de 90 minutos garantizados.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-left">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold mb-3 shadow-xs font-mono">
                01
              </div>
              <h3 className="text-xs font-bold text-slate-900">Envía tus Datos o Productos</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Compártenos el nombre de tu negocio, WhatsApp, horario, logotipo y tu lista de precios en texto, fotos o Excel.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-left">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-3 shadow-xs font-mono">
                02
              </div>
              <h3 className="text-xs font-bold text-slate-900">Pago Único de $10 USD</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Cancela mediante Binance Pay o Airtm. Sin costos ocultos, sin comisiones mensuales ni gastos de hosting.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-left">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold mb-3 shadow-xs font-mono">
                03
              </div>
              <h3 className="text-xs font-bold text-slate-900">Recibe tu Enlace Propio</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Te entregamos tu URL exclusiva lista para fijar en tu biografía de Instagram, enviar a tus clientes o colocar en códigos QR.
              </p>
            </div>
          </div>

          {/* Banner de Contacto Directo */}
          <div className="mt-8 bg-slate-900 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                ¿Listo para digitalizar tu negocio?
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Comienza hoy mismo por solo $10 USD
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Aceptamos pagos por Binance Pay (USDT) y Airtm. Entrega rápida en &lt; 90 minutos.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenOnboarding}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Abrir Configurador Express</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-400">
        <p>Digitalizador Express de Catálogos y Menús Interactivos • Microservicio SaaS Ligero</p>
        <p className="text-[10px] text-slate-400 mt-1">
          Pagos aceptados: Binance Pay & Airtm • Soporte comercial garantizado
        </p>
      </footer>
    </div>
  );
};
