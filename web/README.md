# Digitalizador Express de Catálogos y Menús Interactivos

> **Microservicio SaaS llave en mano de rápida personalización para pequeños negocios locales.**  
> Modelo comercial: **$10 USD pago único** • Métodos de pago: **Binance Pay & Airtm** • Tiempo de entrega: **< 90 minutos**.

---

## 1. Arquitectura del Sistema

El sistema opera sobre una **única plantilla web maestra** multi-inquilino (*multi-tenant*), eliminando la necesidad de duplicar código o desplegar instancias separadas para cada cliente contratado.

```
                    ┌──────────────────────────────────────────────┐
                    │          PLANTILLA WEB MAESTRA               │
                    │   (React 19 + TypeScript + Vite + Tailwind)  │
                    └──────────────────────┬───────────────────────┘
                                           │
                    ┌──────────────────────┴───────────────────────┐
                    │         ENRUTADOR MULTI-NEGOCIO              │
                    │      (URL Path, Query `?b=slug`, Hash)       │
                    └──────┬───────────────┬───────────────┬───────┘
                           │               │               │
                           ▼               ▼               ▼
                   [bodegon-express] [burger-craft] [cafe-aroma] ...
                           │               │               │
                           ▼               ▼               ▼
                    Configuración   Configuración   Configuración
                    • Nombre/Logo   • Nombre/Logo   • Nombre/Logo
                    • Colores       • Colores       • Colores
                    • WhatsApp      • WhatsApp      • WhatsApp
                    • Productos     • Productos     • Productos
                    • Carrito       • Carrito       • Carrito
                      Aislado         Aislado         Aislado
```

### Separación de Responsabilidades:
1. **Diseño y Estructura (Compartido):**
   - Cabecera fija con logotipo, horarios y estado en vivo (Abierto / Cerrado).
   - Selector táctil de moneda (USD $ / Bolívares Bs.).
   - Buscador reactivo y barra de desplazamiento de categorías.
   - Tarjetas de producto con control de cantidades (+ / -), estados de disponibilidad y precios duales.
   - Barra flotante inferior de resumen de pedido.
   - Modal/Drawer de confirmación de pedido que genera el mensaje estructurado de WhatsApp.
   - Modal de información comercial: dirección física con enlace directo a Google Maps, horario extendido, Instagram y aviso de métodos de pago aceptados.

2. **Configuración de Negocio (Independiente por Cliente):**
   - Identificador único en URL (`slug`).
   - Identidad visual (paleta de colores: esmeralda, ámbar, rosa, cielo, índigo, pizarra, violeta).
   - Teléfono de WhatsApp y canales de contacto.
   - Tasa de cambio oficial o acordada.
   - Catálogo de productos (cargado de forma estática ultra-rápida o conectado a Google Sheets vía OpenSheet API).
   - Almacenamiento local del carrito aislado por negocio (`digitalizador_cart_<slug>`).

---

## 2. Negocios Preconfigurados (Demos en Vivo)

El proyecto incluye 4 verticales comerciales listas para demostración y venta:

1. **Bodegón Express (`/?b=bodegon-express`):**
   - Vertical: Víveres, lácteos, bebidas y artículos del hogar.
   - Paleta: Esmeralda (`#059669`).
   - Moneda: USD con conversión automática a Bs. a tasa 55.20.

2. **Burger Craft & Grill (`/?b=burger-craft`):**
   - Vertical: Hamburguesería gourmet, combos familiares y bebidas artesanales.
   - Paleta: Ámbar / Fuego (`#d97706`).

3. **Café Aroma & Bakery (`/?b=cafe-aroma`):**
   - Vertical: Cafetería de especialidad, bollería fresca, brunch y repostería fina.
   - Paleta: Rosa / Frambuesa (`#e11d48`).

4. **Farmacia Vital Salud (`/?b=farmacia-vital`):**
   - Vertical: Medicamentos, vitaminas, dermatología y cuidado infantil.
   - Paleta: Cielo / Turquesa (`#0284c7`).

Al visitar la raíz sin slug (`/`), se despliega la **Vitrina Comercial**, que presenta la propuesta de valor de $10 USD, las instrucciones de pago por Binance/Airtm y el acceso a todas las demos interactivas.

---

## 3. Procedimiento para Registrar un Nuevo Negocio (< 90 minutos)

El proceso de incorporación puede completarse en **menos de 15 minutos** utilizando cualquiera de los dos métodos:

### Método A: Mediante el "Configurador Express" (Interfaz Gráfica)
1. Abrir la aplicación y pulsar en **"Personalizar ($10 USD)"** o **"Abrir Configurador Express"**.
2. **Paso 1 (Datos):** Ingresar nombre comercial, slug deseado (ej. `mi-tienda`), WhatsApp, eslogan, horarios y tasa de cambio.
3. **Paso 2 (Diseño):** Seleccionar la paleta de color que mejor se adapte al rubro y especificar las formas de pago del negocio.
4. **Paso 3 (Productos):** Agregar los productos o platos con su precio, categoría y foto.
5. **Paso 4 (Publicación):**
   - Hacer clic en **"Previsualizar Catálogo Ahora"** para verificar el funcionamiento inmediato en el navegador con la URL `/?b=mi-tienda`.
   - Pulsar **"Copiar URL"** o **"Descargar .ts"** para incorporarlo a la base de código.

### Método B: Incorporación Directa en Código
1. Crear un archivo en `src/config/stores/<nombre-slug>.ts` siguiendo la estructura:
```typescript
import { BusinessTenantConfig } from '../../types/catalog';

export const MI_TIENDA_STORE: BusinessTenantConfig = {
  slug: 'mi-tienda',
  name: 'Mi Tienda Local',
  description: 'Descripción del catálogo o menú.',
  whatsappNumber: '584121234567',
  isOpen: true,
  openingHours: 'Lun - Sáb: 9:00 AM - 7:00 PM',
  exchangeRate: 55.20,
  defaultCurrency: 'USD',
  theme: {
    preset: 'amber',
  },
  contact: {
    address: 'Calle Principal #12, Centro',
    instagram: '@mitienda.ve',
    paymentMethodsNotice: 'Aceptamos Pago Móvil, Binance Pay y Efectivo.',
  },
  initialProducts: [
    {
      id: 'p-1',
      name: 'Producto 1',
      description: 'Detalle del producto',
      price: 4.50,
      category: 'General',
      image: 'https://images.unsplash.com/...',
      available: true,
    },
  ],
};
```
2. Registrar el nuevo archivo en `src/config/stores/index.ts` añadiéndolo al arreglo `BUILTIN_TENANTS`.
3. Ejecutar `npm run build` y desplegar.

---

## 4. Procedimiento de Cobro y Verificación Comercial ($10 USD)

Para mantener la máxima simplicidad operativa y evitar dependencias financieras pesadas:

1. **Recepción del Pago:**
   - **Binance Pay:** El cliente transfiere $10.00 USDT a través de Binance Pay utilizando el Pay ID asignado.
   - **Airtm:** El cliente transfiere $10.00 AirUSD al correo de la cuenta de Airtm asignada.
2. **Confirmación del Cliente:**
   - El cliente envía su número de referencia / TXID y el comprobante de pago vía WhatsApp mediante el formulario integrado de confirmación.
3. **Activación y Entrega:**
   - El operador valida en su aplicación de Binance o Airtm la acreditación de los $10 USD.
   - Habilita la URL definitiva del catálogo (ej. `https://catalogo.tudominio.com/?b=nombre-cliente`).
   - Envía el enlace al cliente junto con un código QR listo para imprimir.

> **Seguridad:** El sistema no almacena credenciales bancarias, claves privadas ni frases semilla.

---

## 5. Comandos del Proyecto

- **Desarrollo local:** `npm run dev`
- **Compilación de producción:** `npm run build`
- **Batería de pruebas indispensables:** `npm test`
- **Previsualización:** `npm run preview`
