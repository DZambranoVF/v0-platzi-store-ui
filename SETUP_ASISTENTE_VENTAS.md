# 🤖 Asistente de Ventas — Implementación Completada

## ✅ Estado: Completado

El avatar interactivo con Simli + ElevenLabs + Claude ha sido integrado exitosamente en la tienda. El botón flotante está listo en la esquina inferior derecha.

---

## 📁 Archivos Creados

### API Routes
- **`app/api/brain/route.ts`** — Claude API streaming (SSE) con modelo `claude-haiku-4-5-20251001`
- **`app/api/voice/route.ts`** — ElevenLabs TTS (MP3 PCM16 a 16kHz)

### Componentes
- **`components/sales-assistant/AgentAvatar.tsx`** — Avatar Simli WebRTC (160x160px, adaptable)
- **`components/sales-assistant/SalesAssistantPanel.tsx`** — Panel completo con chat, avatar y orquestación audio
- **`components/sales-assistant/SalesAssistantBubble.tsx`** — Botón flotante + Sheet lateral

### Configuración
- **`.env.local`** — Plantilla con variables de entorno

---

## 📝 Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `app/layout.tsx` | + Importación de `SalesAssistantBubble` + componente en body |
| `next.config.mjs` | + `reactStrictMode: false` (obligatorio para Simli) |
| `package.json` | + `simli-client`, `@anthropic-ai/sdk` |

---

## 🔑 Variables de Entorno (`.env.local`)

Completa con tus API keys:

```bash
# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# ElevenLabs
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=7EtWwuYaqwXBRXAwxWZw  # ID de la voz (Freddy, Bella, etc.)

# Simli
NEXT_PUBLIC_SIMLI_API_KEY=...
NEXT_PUBLIC_SIMLI_FACE_ID=...  # UUID del avatar (subir foto en app.simli.com)
```

### ℹ️ Origen de las Keys

**Claude API** → https://console.anthropic.com/  
**ElevenLabs** → https://elevenlabs.io/ (voice ID en Settings)  
**Simli** → https://app.simli.com/ (Face ID después de subir foto)

---

## 🎯 Características del Asistente

- **Nombre:** Alex (personalizable en `SalesAssistantPanel.tsx`)
- **Idioma:** Español
- **Conocimiento:** 10 productos de Platzi Store con precios, colores, tallas, descripciones
- **Respuestas:** Máximo 3 oraciones (optimizado para TTS)
- **Avatar:** Simli WebRTC < 300ms latencia
- **Voz:** ElevenLabs `eleven_flash_v2_5` ultra low latency
- **Inteligencia:** Claude Haiku 4.5

---

## 🚀 Cómo Usar

### Desarrollo Local
```bash
cd /c/Users/asus/v0-platzi-store-ui
pnpm install  # Si aún no lo hiciste
pnpm dev
```

Abre http://localhost:3000 → busca el botón azul flotante en la esquina inferior derecha

### Botón Flotante
- **Posición:** Fixed bottom-right, z-index 60 (sobre navbar)
- **Ícono:** Chat bubble (lucide-react)
- **Al click:** Abre panel lateral 800px con avatar + chat

### Funcionamiento
1. Usuario escribe mensaje en el input
2. Click "Enviar" o Enter
3. Estado avatar → "pensando" (amarillo, pulse)
4. Claude responde en streaming
5. ElevenLabs genera audio MP3
6. Avatar anima la boca sincronizada
7. Audio se reproduce automáticamente
8. Estado avatar → "hablando" (verde, pulse) → "idle" (gris)

---

## 🔧 Personalizaciones

### Cambiar nombre del asistente
Abre `components/sales-assistant/SalesAssistantPanel.tsx` línea 30:
```typescript
Eres Alex, el asistente de ventas virtual de Platzi Store...
```

### Cambiar tamaño del avatar
En `SalesAssistantPanel.tsx` línea 142:
```typescript
<AgentAvatar size={160}  /* cambiar este número */ />
```

### Cambiar colores del botón flotante
En `components/sales-assistant/SalesAssistantBubble.tsx` línea 17:
```typescript
className="... bg-gradient-to-br from-blue-500 to-blue-600 ..."
// cambiar a: from-purple-500, from-green-500, etc.
```

### Usar otro modelo de Claude
En `app/api/brain/route.ts` línea 13:
```typescript
model: 'claude-haiku-4-5-20251001', // cambiar a claude-sonnet-4-6, etc.
```

---

## ❌ Sin API Keys

Sin las keys configuradas, el asistente:
- ✅ No rompe la tienda
- ✅ El botón flotante aparece normal
- ✅ Al click abre el panel
- ❌ Avatar muestra "conectando..." (timeout después de 30s)
- ❌ El chat no responde (error en /api/brain)

**Esto es normal.** Configurar las keys en `.env.local` y reiniciar `pnpm dev`.

---

## 📊 Arquitectura

```
app/layout.tsx
  └── SalesAssistantBubble (fixed bottom-right)
        └── Sheet (shadcn/ui)
              └── SalesAssistantPanel
                    ├── AgentAvatar (Simli WebRTC)
                    ├── ScrollArea (messages)
                    └── Input + Send

app/api/
  ├── brain/route.ts  ← Claude streaming
  └── voice/route.ts  ← ElevenLabs TTS

lib/
  └── products.ts  ← System prompt se construye dinámicamente aquí
```

---

## 🔍 Verificación

- [x] Build exitoso (`pnpm build`)
- [x] Dev server corriendo (`pnpm dev`)
- [x] Botón flotante visible en todas las páginas
- [x] Sin errores TypeScript
- [x] Tienda original funcionando (catálogo, carrito, checkout, contacto)
- [x] Componentes no rompen SSR (SalesAssistantBubble y Panel son 'use client')

---

## 🐛 Troubleshooting

### Botón no aparece
1. Verificar que `SalesAssistantBubble` esté en `app/layout.tsx`
2. Verificar z-index: debe ser z-60 (sobre navbar z-50)
3. Limpiar cache: `rm -rf .next` y reiniciar

### Avatar no conecta (timeout)
1. Verificar `NEXT_PUBLIC_SIMLI_API_KEY` en `.env.local`
2. Verificar `NEXT_PUBLIC_SIMLI_FACE_ID` válido
3. Comprobar conectividad a internet (Simli requiere WebRTC)
4. Revisar console del navegador (F12 → Console tab)

### Chat no responde
1. Verificar `ANTHROPIC_API_KEY` en `.env.local`
2. Verificar API key válida (ir a https://console.anthropic.com/)
3. Revisar Network tab (F12) → POST /api/brain → Status 200
4. Si error 500: revisar logs del servidor (`pnpm dev` output)

### Audio no suena
1. Verificar `ELEVENLABS_API_KEY` y `ELEVENLABS_VOICE_ID` en `.env.local`
2. Probar en otra pestaña (algunos navegadores bloquean autoplay)
3. Verificar volumen del navegador
4. Revisar Network tab → POST /api/voice → Status 200

---

## 📚 Recursos

- **Simli Docs:** https://docs.simli.ai/
- **ElevenLabs Docs:** https://elevenlabs.io/docs/
- **Anthropic API:** https://docs.anthropic.com/
- **Next.js 16:** https://nextjs.org/docs

---

## 🎉 ¡Listo!

El asistente de ventas está integrado y listo para usar. Solo falta configurar las API keys en `.env.local` y reiniciar el servidor.

**¿Preguntas o personalizaciones?** Revisar la sección "🔧 Personalizaciones" arriba.
