# Platzi Store — Tienda Oficial con Asistente de Ventas por IA

Tienda oficial de Platzi construida con Next.js 15+, con un asistente de ventas conversacional integrado que combina **avatar WebRTC en tiempo real**, **síntesis de voz** e **inteligencia artificial**.

> Proyecto original generado con [v0](https://v0.app/chat/projects/prj_g6uUmJARXfS1XdBE3HlK9Ki0RCGa) · [Abrir en Kiro](https://v0.app/chat/api/kiro/clone/DZambranoVF/v0-platzi-store-ui)

---

## Demo

Abre la tienda y haz clic en el botón **VB** en la esquina inferior derecha para interactuar con **VEGA-BOT**, el asistente de ventas.

---

## Stack Tecnológico

### Tienda
| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Componentes | shadcn/ui |
| Estado carrito | Zustand |
| Tipografías | Inter + Space Grotesk (Google Fonts) |
| Analytics | Vercel Analytics |

### Asistente de Ventas (VEGA-BOT)
| Capa | Tecnología |
|------|-----------|
| IA / Cerebro | Claude Sonnet 4.5 (Anthropic) |
| Síntesis de voz | ElevenLabs TTS (`eleven_flash_v2_5`) |
| Avatar WebRTC | Simli (`simli-client` v3) |
| Audio pipeline | Web Audio API → PCM16 16kHz → Simli |

---

## Características

### Tienda
- Catálogo de productos con filtro por categoría
- Página de detalle por producto (colores, tallas, descripción)
- Carrito lateral con Zustand (persistente en sesión)
- Formulario de contacto
- Hero animado, sección de manifiesto, prueba social, newsletter
- Totalmente responsivo

### Asistente VEGA-BOT
- **Avatar animado en tiempo real**: Simli WebRTC sincroniza los labios del avatar con el audio (<300ms de latencia)
- **Conversación en lenguaje natural**: Claude Sonnet 4.5 responde preguntas sobre productos, precios, tallas y colores
- **Voz sintetizada**: ElevenLabs convierte la respuesta a audio MP3 que se reproduce en el navegador
- **Conocimiento dinámico del catálogo**: El system prompt se construye automáticamente desde `lib/products.ts` — al agregar un producto, VEGA-BOT lo conoce al instante
- **Interfaz flotante**: Panel de 370px que aparece sobre cualquier página sin interrumpir la experiencia de compra
- **Sin markdown en respuestas**: Las respuestas son texto plano, limpias para voz y para chat

---

## Arquitectura del Asistente

```
Usuario escribe
        │
        ▼
SalesAssistantPanel.tsx  (React 'use client')
        │
        ├──► POST /api/brain  ──► Claude Sonnet 4.5
        │         (SSE streaming)       │
        │                               ▼
        │                        Texto respuesta
        │                               │
        ├──► POST /api/voice  ──► ElevenLabs TTS
        │                               │
        │                         MP3 bytes stream
        │                               │
        ├──► AudioContext.decodeAudioData()
        │         │
        │         ▼
        │    PCM16 @ 16kHz (chunks de 6000 bytes)
        │         │
        ├──► Simli.sendAudioData()  ──► Avatar mueve labios
        │
        └──► HTMLAudioElement.play()  ──► Usuario escucha
```

---

## Estructura del Proyecto

```
v0-platzi-store-ui/
├── app/
│   ├── api/
│   │   ├── brain/route.ts          # Claude Sonnet — streaming SSE
│   │   └── voice/route.ts          # ElevenLabs TTS — stream MP3
│   ├── layout.tsx                  # Root layout + SalesAssistantBubble
│   ├── page.tsx                    # Home: Hero + Catálogo + Secciones
│   └── globals.css
├── components/
│   ├── home/
│   │   ├── hero-section.tsx
│   │   ├── featured-products.tsx
│   │   ├── manifesto-section.tsx
│   │   ├── categories-section.tsx
│   │   ├── social-proof-section.tsx
│   │   └── newsletter-section.tsx
│   ├── sales-assistant/
│   │   ├── AgentAvatar.tsx          # Simli WebRTC (160×160px)
│   │   ├── SalesAssistantPanel.tsx  # Chat + orquestación audio
│   │   └── SalesAssistantBubble.tsx # Botón flotante + panel
│   ├── cart-drawer.tsx
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── ui/                          # shadcn/ui components
├── lib/
│   ├── products.ts                  # Catálogo de 10 productos (fuente de verdad)
│   └── store.ts                     # Zustand store del carrito
└── .env.local                       # Variables de entorno (no se sube al repo)
```

---

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Claude API (Anthropic)
ANTHROPIC_API_KEY=sk-ant-...

# ElevenLabs TTS
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=<id-de-voz>

# Simli (WebRTC Avatar)
NEXT_PUBLIC_SIMLI_API_KEY=<api-key-simli>
NEXT_PUBLIC_SIMLI_FACE_ID=<face-id-simli>
```

### Cómo obtener cada key

| Variable | Dónde obtenerla |
|----------|----------------|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `ELEVENLABS_API_KEY` | [elevenlabs.io](https://elevenlabs.io) → Profile → API Keys |
| `ELEVENLABS_VOICE_ID` | ElevenLabs → Voice Library → ID de la voz elegida |
| `NEXT_PUBLIC_SIMLI_API_KEY` | [simli.com](https://simli.com) → Dashboard → API Keys |
| `NEXT_PUBLIC_SIMLI_FACE_ID` | Simli → Avatars → selecciona o crea uno → Face ID |

> **Sin estas keys**: la tienda funciona normalmente. VEGA-BOT mostrará estado "conectando..." pero no hará crash.

---

## Instalación y Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/DZambranoVF/v0-platzi-store-ui.git
cd v0-platzi-store-ui

# Instalar dependencias
pnpm install

# Configurar variables de entorno
# Crea .env.local con las keys indicadas arriba

# Iniciar servidor de desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Agregar Productos al Catálogo

Edita `lib/products.ts` — VEGA-BOT aprenderá los nuevos productos automáticamente:

```ts
{
  id: 11,
  name: 'Nuevo Producto',
  price: 89900,          // en pesos colombianos (COP)
  description: 'Descripción del producto',
  category: 'tech',
  colors: ['negro', 'blanco'],
  sizes: ['S', 'M', 'L'],
}
```

---

## Personalizar VEGA-BOT

| Qué cambiar | Dónde |
|-------------|-------|
| Nombre del asistente | `SalesAssistantPanel.tsx` → `buildSystemPrompt()` |
| Personalidad / instrucciones | `SalesAssistantPanel.tsx` → `buildSystemPrompt()` |
| Tamaño del avatar | prop `size` de `AgentAvatar` en `SalesAssistantPanel.tsx` |
| Colores del panel | constante `G` en `SalesAssistantBubble.tsx` y `SalesAssistantPanel.tsx` |
| Modelo de IA | `app/api/brain/route.ts` → campo `model` |
| Voz | `ELEVENLABS_VOICE_ID` en `.env.local` |
| Avatar (cara) | `NEXT_PUBLIC_SIMLI_FACE_ID` en `.env.local` |

---

## Build para Producción

```bash
pnpm build
pnpm start
```

O despliega directamente en **Vercel** — agrega las variables de entorno en el dashboard antes del deploy.

---

## Notas Técnicas

- `reactStrictMode: false` en `next.config.mjs` — requerido para Simli (evita sesiones WebRTC duplicadas en desarrollo)
- Los callbacks `onReady` y `onError` del avatar van envueltos en `useCallback(fn, [])` — evita reconexiones de Simli al re-renderizar el componente
- `.env*` está en `.gitignore` — las API keys nunca se suben al repositorio
- El audio pipeline convierte MP3 → PCM16 @ 16kHz en el cliente con `AudioContext.decodeAudioData` para sincronizar los labios del avatar

---

## Licencia

MIT — construido para la comunidad Platzi.
