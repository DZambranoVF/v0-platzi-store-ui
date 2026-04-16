# CLAUDE.md — Platzi Store

Guía para Claude Code al trabajar en este repositorio.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Estilos**: Tailwind CSS v4 + shadcn/ui
- **Estado**: Zustand (`lib/cart-store.ts`) — NO React Context
- **Package manager**: `pnpm` (usar siempre `pnpm`, nunca `npm`)

## Comandos clave

```bash
pnpm dev          # Servidor de desarrollo (http://localhost:3000)
pnpm build        # Build de producción — verificar que compile sin errores
pnpm lint         # Linting
```

## Arquitectura de módulos

### Tienda
- **Catálogo**: `lib/products.ts` es la fuente de verdad de todos los productos
- **Carrito**: Zustand store en `lib/cart-store.ts` — `{ items, addItem, removeItem, updateQuantity, clearCart, getTotal }`
- **Checkout**: flujo de 4 pasos en `components/checkout/`
  - `checkout-flow.tsx` — orquestador con estado de pasos
  - `step-payment.tsx` — llama `/api/checkout` para obtener `preferenceId` y renderiza `MercadoPagoBrick`
  - Al pagar con MP: el flujo salta directamente a `/gracias?status=approved`, el Paso 4 queda en el código pero no se usa en el flujo MP
- **Página de confirmación**: `app/gracias/page.tsx` — acepta `?status=approved` o `?status=pending`

### MercadoPago
- `app/api/checkout/route.ts` — crea la preferencia MP con `back_urls` y `notification_url`
- `app/api/webhook/route.ts` — recibe notificaciones de MP, siempre retorna 200
- `components/MercadoPagoBrick.tsx` — wrapper de `<Payment>` de `@mercadopago/sdk-react`
- Credenciales: `MP_ACCESS_TOKEN` (server), `NEXT_PUBLIC_MP_PUBLIC_KEY` (client), `NEXT_PUBLIC_URL` (back_urls)

### VEGA-BOT (Asistente de Ventas)
- `app/api/brain/route.ts` — Claude Sonnet 4.5, streaming SSE, `max_tokens: 512`
- `app/api/voice/route.ts` — ElevenLabs TTS, devuelve stream MP3
- `components/sales-assistant/AgentAvatar.tsx` — Simli WebRTC
- `components/sales-assistant/SalesAssistantPanel.tsx` — chat + pipeline audio (MP3 → PCM16 → Simli)
- `components/sales-assistant/SalesAssistantBubble.tsx` — botón flotante `fixed bottom-6 right-6 z-[60]`
- El system prompt se construye dinámicamente desde `lib/products.ts` en `buildSystemPrompt()`

## Convenciones

- Colores principales: verde neon `#98CA3F`, fondo oscuro `#0A0A0A`, paneles `#111111`
- Clases CSS custom: `btn-neon-3d`, `glow-green-sm`, `text-neon-green` (definidas en `globals.css`)
- Fuentes: `font-[family-name:var(--font-space-grotesk)]` para títulos, Inter para cuerpo
- `reactStrictMode: false` en `next.config.mjs` — OBLIGATORIO para Simli (no cambiar)
- No usar markdown en respuestas del asistente — limpiar con `stripMarkdown()` antes de mostrar y antes de enviar a TTS
- Precios en prompts de IA: usar `formatPriceForPrompt()` (genera "89.900 pesos", no "$") para que ElevenLabs no lea "duales"

## Variables de entorno requeridas

```
# VEGA-BOT
ANTHROPIC_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
NEXT_PUBLIC_SIMLI_API_KEY=
NEXT_PUBLIC_SIMLI_FACE_ID=

# MercadoPago
MP_ACCESS_TOKEN=
NEXT_PUBLIC_MP_PUBLIC_KEY=
NEXT_PUBLIC_URL=
```

## Deploy

Producción en Vercel. Todas las variables de entorno deben configurarse en el dashboard de Vercel antes del deploy. El webhook de MP apunta a `NEXT_PUBLIC_URL/api/webhook`.
