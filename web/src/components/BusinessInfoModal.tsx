import React, { useState } from 'react';
import { X, MapPin, Clock, Phone, MessageSquare, CreditCard, Share2, Check, ExternalLink } from 'lucide-react';
import { BusinessTenantConfig } from '../types/catalog';

interface BusinessInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: BusinessTenantConfig;
}

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const BusinessInfoModal: React.FC<BusinessInfoModalProps> = ({
  isOpen,
  onClose,
  tenant,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const cleanWaNumber = tenant.whatsappNumber.replace(/[^0-9]/g, '');
  const cleanPhone = tenant.contact?.phone ? tenant.contact.phone.replace(/[^0-9+]/g, '') : cleanWaNumber;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fondo oscuro con desenfoque táctil */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 max-w-md mx-auto z-10 flex flex-col max-h-[90vh] bg-white rounded-t-3xl shadow-2xl border-t border-slate-200/80 animate-in slide-in-from-bottom duration-300">
        {/* Agarrador Táctil */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* Encabezado */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {tenant.logo && (
              <img
                src={tenant.logo}
                alt={tenant.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200"
              />
            )}
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {tenant.name}
              </h2>
              <span className="text-[11px] text-slate-500">Información del Negocio</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido desplazable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 overscroll-contain">
          {/* Descripción / Tagline */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60">
            <p className="text-xs text-slate-700 leading-relaxed">
              {tenant.description}
            </p>
          </div>

          {/* Horario y Estado */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Horario de Atención</span>
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold uppercase ${
                    tenant.isOpen
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                  }`}
                >
                  {tenant.isOpen ? 'Abierto hoy' : 'Cerrado ahora'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {tenant.openingHours}
              </p>
            </div>
          </div>

          {/* Ubicación Física */}
          {tenant.contact?.address && (
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900 block">Ubicación</span>
                <p className="text-xs text-slate-600 mt-0.5">
                  {tenant.contact.address}
                </p>
                {tenant.contact.googleMapsUrl && (
                  <a
                    href={tenant.contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 mt-1.5"
                  >
                    <span>Ver mapa en Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Canales de Contacto */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block px-1">
              Canales de Contacto
            </span>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/${cleanWaNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 text-emerald-800 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="min-w-0 text-left">
                  <span className="text-[11px] font-bold block leading-tight">WhatsApp</span>
                  <span className="text-[10px] text-emerald-700/80 truncate block">Chat directo</span>
                </div>
              </a>

              {tenant.contact?.phone && (
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-colors"
                >
                  <Phone className="w-4 h-4 text-slate-600 shrink-0" />
                  <div className="min-w-0 text-left">
                    <span className="text-[11px] font-bold block leading-tight">Llamar</span>
                    <span className="text-[10px] text-slate-500 truncate block">Teléfono</span>
                  </div>
                </a>
              )}

              {tenant.contact?.instagram && (
                <a
                  href={`https://instagram.com/${tenant.contact.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-800 transition-colors col-span-2"
                >
                  <InstagramIcon className="w-4 h-4 text-rose-600 shrink-0" />
                  <div className="min-w-0 text-left">
                    <span className="text-[11px] font-bold block leading-tight">Instagram Oficial</span>
                    <span className="text-[10px] text-rose-700/80 truncate block">{tenant.contact.instagram}</span>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Formas de Pago que acepta el negocio */}
          {tenant.contact?.paymentMethodsNotice && (
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-amber-900">
              <CreditCard className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold block">Métodos de Pago Aceptados</span>
                <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                  {tenant.contact.paymentMethodsNotice}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Barra Inferior: Compartir Catálogo */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-600 block">Enlace del Catálogo</span>
            <span className="text-[10px] text-slate-400 truncate block max-w-[220px]">
              {currentUrl}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-95 transition-all shadow-xs shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Copiar Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
