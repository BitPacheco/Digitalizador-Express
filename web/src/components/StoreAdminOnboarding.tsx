import React, { useState } from 'react';
import { X, Check, Copy, Download, Plus, Trash2, Sparkles, Send, ArrowRight, ArrowLeft, Code } from 'lucide-react';
import { BusinessTenantConfig, Producto, ThemePreset } from '../types/catalog';
import { saveCustomTenant } from '../config/stores';
import { THEME_PRESETS } from '../utils/theme';

interface StoreAdminOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onTenantCreated: (newSlug: string) => void;
}

export const StoreAdminOnboarding: React.FC<StoreAdminOnboardingProps> = ({
  isOpen,
  onClose,
  onTenantCreated,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [openingHours, setOpeningHours] = useState('Lun - Sáb: 8:00 AM - 8:00 PM');
  const [address, setAddress] = useState('');
  const [instagram, setInstagram] = useState('');
  const [exchangeRate, setExchangeRate] = useState('55.20');
  const [preset, setPreset] = useState<ThemePreset>('emerald');
  const [paymentNotice, setPaymentNotice] = useState('Aceptamos Pago Móvil, Binance Pay, Airtm y Efectivo.');

  // Payment Verification State ($10 USD)
  const [paymentMethod, setPaymentMethod] = useState<'binance' | 'airtm'>('binance');
  const [paymentReference, setPaymentReference] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Products State
  const [products, setProducts] = useState<Producto[]>([
    {
      id: 'p-1',
      name: 'Producto o Plato Principal',
      description: 'Descripción detallada con ingredientes, porciones o especificaciones.',
      price: 5.00,
      category: 'General',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
      available: true,
      sku: 'PROD-001',
    },
    {
      id: 'p-2',
      name: 'Bebida o Complemento',
      description: 'Refrescante bebida o guarnición especial de la casa.',
      price: 2.00,
      category: 'Bebidas',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&auto=format&fit=crop&q=80',
      available: true,
      sku: 'PROD-002',
    },
  ]);

  // Temporary product inputs
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      const autoSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(autoSlug);
    }
  };

  const handleAddProduct = () => {
    if (!newProdName.trim()) return;
    const item: Producto = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      category: newProdCategory.trim() || 'General',
      price: parseFloat(newProdPrice) || 1.00,
      description: newProdDesc.trim(),
      image: newProdImage.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
      available: true,
      sku: `SKU-${products.length + 1}`,
    };
    setProducts((prev) => [...prev, item]);
    setNewProdName('');
    setNewProdCategory('');
    setNewProdPrice('');
    setNewProdDesc('');
    setNewProdImage('');
  };

  const handleRemoveProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Compile final tenant config object
  const buildTenantConfig = (): BusinessTenantConfig => {
    const safeSlug = (slug || 'mi-negocio').toLowerCase().replace(/[^a-z0-9-]/g, '');
    return {
      slug: safeSlug,
      name: name || 'Mi Negocio Express',
      description: description || tagline || 'Catálogo interactivo con pedidos directos a WhatsApp',
      tagline: tagline || 'Atención de primera calidad',
      logo: logo || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=160&auto=format&fit=crop&q=80',
      whatsappNumber: whatsappNumber || '584120000000',
      isOpen: true,
      openingHours: openingHours || 'Lun - Sáb: 8:00 AM - 8:00 PM',
      exchangeRate: parseFloat(exchangeRate) || 55.20,
      defaultCurrency: 'USD',
      theme: {
        preset,
        primaryColor: THEME_PRESETS[preset].primary,
        accentColor: THEME_PRESETS[preset].accent,
      },
      contact: {
        phone: whatsappNumber,
        address: address || 'Atención en línea y entregas a domicilio',
        instagram: instagram || undefined,
        paymentMethodsNotice: paymentNotice,
      },
      sheetId: '',
      sheetTab: 'Productos',
      initialProducts: products,
    };
  };

  const handleSaveAndPreview = () => {
    const config = buildTenantConfig();
    saveCustomTenant(config);
    onTenantCreated(config.slug);
    onClose();
  };

  const generatedTsCode = () => {
    const config = buildTenantConfig();
    return `import { BusinessTenantConfig } from '../../types/catalog';\n\nexport const ${config.slug.toUpperCase().replace(/-/g, '_')}_STORE: BusinessTenantConfig = ${JSON.stringify(config, null, 2)};\n`;
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(generatedTsCode());
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleDownloadFile = () => {
    const config = buildTenantConfig();
    const blob = new Blob([generatedTsCode()], { type: 'text/typescript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${config.slug}.ts`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyClientUrl = () => {
    const config = buildTenantConfig();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const clientUrl = `${origin}/?b=${config.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(clientUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSendPaymentConfirmationWhatsApp = () => {
    const config = buildTenantConfig();
    const lines = [
      '⚡ *CONFIRMACIÓN DE PAGO — DIGITALIZADOR EXPRESS ($10 USD)*',
      '───────────────────────────',
      `*Negocio:* ${config.name}`,
      `*Slug solicitado:* ${config.slug}`,
      `*WhatsApp Cliente:* ${clientPhone || config.whatsappNumber}`,
      `*Método utilizado:* ${paymentMethod === 'binance' ? 'Binance Pay' : 'Airtm'}`,
      `*Referencia / TXID:* ${paymentReference || 'Pendiente de adjuntar comprobante'}`,
      `*Monto:* $10.00 USD (Pago único)`,
      '───────────────────────────',
      'Hola, he realizado el pago para activar mi Digitalizador Express. Adjunto comprobante para habilitar mi catálogo en menos de 90 minutos.',
    ];
    const encoded = encodeURIComponent(lines.join('\n'));
    // Enlace directo al soporte/operador
    window.open(`https://wa.me/584120000000?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabecera del Asistente */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Configurador Express de Negocios
              </h2>
              <p className="text-[11px] text-slate-500">
                Paso {step} de 4: {step === 1 && 'Datos Generales'} {step === 2 && 'Identidad y Colores'} {step === 3 && 'Catálogo y Precios'} {step === 4 && 'Activación y Entrega ($10 USD)'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Indicador de Pasos */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-100/70 border-b border-slate-200/60 text-center">
          {[
            { num: 1, label: 'Datos' },
            { num: 2, label: 'Diseño' },
            { num: 3, label: 'Productos' },
            { num: 4, label: 'Entrega' },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num as 1 | 2 | 3 | 4)}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                step === s.num
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="font-mono text-[10px] mr-1">{s.num}.</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Contenido del Formulario */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* PASO 1: DATOS DEL NEGOCIO */}
          {step === 1 && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nombre Comercial del Negocio *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ej: Dulce Antojo Pastelería, Sushi Master, Bodega Don Pedro..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Slug Identificador (URL) *
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/10">
                    <span className="text-[11px] text-slate-400 font-mono select-none">/?b=</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="dulce-antojo"
                      className="w-full bg-transparent text-xs text-slate-800 font-mono focus:outline-none ml-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Número de WhatsApp (con código de país) *
                  </label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Ej: 584121234567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Eslogan o Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Ej: Tortas artesanales, café recién colado y postres de autor"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Descripción Detallada del Negocio
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: Pastelería fina y repostería europea con ingredientes 100% naturales y entregas puntuales."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Horario de Atención
                  </label>
                  <input
                    type="text"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    placeholder="Ej: Mar - Dom: 10:00 AM - 9:00 PM"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Tasa de Cambio (Bs por 1 USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(e.target.value)}
                    placeholder="55.20"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Ubicación o Dirección
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej: C.C. Parque Cristal, Nivel 1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Instagram Oficial
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@dulceantojo.ve"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  URL del Logotipo (opcional)
                </label>
                <input
                  type="url"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
                />
              </div>
            </div>
          )}

          {/* PASO 2: IDENTIDAD VISUAL Y COLORES */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Paleta de Color de la Marca
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(
                    [
                      { id: 'emerald', label: 'Esmeralda / Bodegón', color: '#059669', desc: 'Víveres, mercado, fresco' },
                      { id: 'amber', label: 'Ámbar / Comida Rápida', color: '#d97706', desc: 'Hamburguesas, parrilla, snacks' },
                      { id: 'rose', label: 'Rosa / Repostería', color: '#e11d48', desc: 'Postres, café, regalos' },
                      { id: 'sky', label: 'Cielo / Farmacia', color: '#0284c7', desc: 'Salud, agua, bienestar' },
                      { id: 'indigo', label: 'Índigo / Tecnología', color: '#4f46e5', desc: 'Electrónica, accesorios' },
                      { id: 'slate', label: 'Pizarra / Minimalista', color: '#0f172a', desc: 'Elegante, formal, ropa' },
                    ] as const
                  ).map((themeOption) => (
                    <button
                      key={themeOption.id}
                      type="button"
                      onClick={() => setPreset(themeOption.id)}
                      className={`p-3 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                        preset === themeOption.id
                          ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="w-6 h-6 rounded-lg shadow-xs"
                          style={{ backgroundColor: themeOption.color }}
                        />
                        {preset === themeOption.id && (
                          <Check className="w-4 h-4 text-slate-900" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight">
                          {themeOption.label}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {themeOption.desc}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Aviso de Métodos de Pago Aceptados por el Negocio
                </label>
                <textarea
                  rows={2}
                  value={paymentNotice}
                  onChange={(e) => setPaymentNotice(e.target.value)}
                  placeholder="Ej: Aceptamos Pago Móvil, Binance Pay, Airtm, Dólares en efectivo y Zelle."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
                />
              </div>

              {/* Vista previa de la tarjeta */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Vista Previa del Negocio
                </span>
                <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: THEME_PRESETS[preset].primary }}
                    >
                      {name ? name.charAt(0).toUpperCase() : 'N'}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        {name || 'Nombre del Negocio'}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {tagline || 'Eslogan o descripción'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    style={{ backgroundColor: THEME_PRESETS[preset].primary }}
                    className="text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs"
                  >
                    Ver Menú
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: PRODUCTOS Y MENÚ */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-slate-900 block">
                  Agregar Nuevo Producto o Plato
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="Nombre del producto *"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 sm:col-span-2"
                  />
                  <input
                    type="number"
                    step="0.10"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="Precio USD ($) *"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 font-mono"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    placeholder="Categoría (ej: Platos Fuertes, Bebidas)"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                  <input
                    type="url"
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    placeholder="URL imagen (opcional)"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
                <input
                  type="text"
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Descripción corta o ingredientes..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Incorporar al Catálogo</span>
                </button>
              </div>

              {/* Lista actual de productos cargados */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-slate-800">
                    Productos Cargados ({products.length})
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Puedes agregar más después
                  </span>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                    >
                      <div className="min-w-0 flex-1 mr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 truncate">
                            {p.name}
                          </span>
                          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                            {p.category}
                          </span>
                        </div>
                        <span className="text-slate-500 text-[11px] font-mono">
                          ${p.price.toFixed(2)} USD
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(p.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: ACTIVACIÓN Y ENTREGA ($10 USD) */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Resumen del $10 USD Microservicio */}
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/70 text-emerald-950">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Digitalizador Express Llave en Mano
                  </span>
                  <span className="text-base font-extrabold text-emerald-900 font-mono">
                    $10.00 USD
                  </span>
                </div>
                <p className="text-xs text-emerald-800/90 mt-1 leading-relaxed">
                  Pago único por cliente, sin mensualidades ni comisiones por ventas. Incluye catálogo web interactivo, enlace independiente y pedidos directos a WhatsApp.
                </p>
              </div>

              {/* Métodos de Pago Disponibles: Binance & Airtm */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  Instrucciones de Pago ($10 USD)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('binance')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'binance'
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-xs'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold text-amber-900 block">
                      Binance Pay / USDT
                    </span>
                    <span className="text-[10px] text-amber-700 font-mono mt-0.5 block">
                      Pay ID: 382910492
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Comisión cero en Binance
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('airtm')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'airtm'
                        ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20 shadow-xs'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold text-sky-900 block">
                      Airtm (AirUSD)
                    </span>
                    <span className="text-[10px] text-sky-700 font-mono mt-0.5 block">
                      airtm@digitalizador.com
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Transferencia directa
                    </span>
                  </button>
                </div>
              </div>

              {/* Formulario de Reporte de Pago y Activación */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-slate-900 block">
                  Reportar Pago y Activar Catálogo
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="ID de Transacción / Referencia *"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 font-mono"
                  />
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Tu WhatsApp de contacto *"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendPaymentConfirmationWhatsApp}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Comprobante por WhatsApp</span>
                </button>
              </div>

              {/* Botones de Exportación / Entrega Inmediata */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Opciones de Entrega Técnica y Publicación
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleCopyClientUrl}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 text-xs font-semibold text-slate-800 flex items-center justify-center gap-1.5 transition-all"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'URL Copiada' : 'Copiar URL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 text-xs font-semibold text-slate-800 flex items-center justify-center gap-1.5 transition-all"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Código Copiado' : 'Copiar Código TS'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadFile}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 text-xs font-semibold text-slate-800 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar .ts</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Barra de Navegación de Pasos Inferior */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3 | 4)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAndPreview}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Previsualizar Catálogo Ahora</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
