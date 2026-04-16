'use client'

import { useCallback, useRef, useState } from 'react'
import { AgentAvatar, AvatarState } from './AgentAvatar'
import { products, getProductLandingUrl } from '@/lib/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, ImagePlus, X } from 'lucide-react'

export interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  imagePreview?: string
}

function formatPriceForPrompt(price: number): string {
  return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price) + ' pesos'
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\n+/g, ' ')
    .trim()
}

function buildSystemPrompt(): string {
  const productsList = products
    .map(p => {
      const stockInfo = p.stock !== undefined
        ? `Stock: ${p.stock} unidades disponibles`
        : 'Stock: consultar disponibilidad'
      const landing = getProductLandingUrl(p.slug)
      const colors = p.colors?.length ? `Colores: ${p.colors.join(', ')}` : ''
      const sizes = p.sizes?.length ? `Tallas: ${p.sizes.join(', ')}` : ''
      return `- ${p.name} (${formatPriceForPrompt(p.price)}): ${p.description} ${colors} ${sizes} ${stockInfo} Ver producto: ${landing}`
    })
    .join('\n')

  return `Eres VEGA-BOT, el asistente de ventas virtual de Platzi Store — la tienda oficial de la comunidad tech más grande de Latinoamérica.

CATÁLOGO COMPLETO:
${productsList}

INSTRUCCIONES:
- Responde SIEMPRE en español, de forma concisa — máximo 3 oraciones
- Eres amigable y entusiasta del tech y la educación
- Sugiere productos según las necesidades del cliente
- Menciona precios en pesos colombianos sin usar el símbolo de pesos, di el número seguido de "pesos"
- Si preguntan por colores o tallas disponibles, responde con precisión
- No inventes productos que no están en el catálogo
- No uses markdown, asteriscos ni formato especial — responde en texto plano
- Sé breve para que la síntesis de voz no tarde demasiado
- Si el usuario envía una foto suya, analiza su estilo y tonos de color para recomendar el producto y color del catálogo que mejor le quedaría. Sé específico y entusiasta`
}

function audioBufferToPcm16(buf: AudioBuffer): Uint8Array {
  const srcRate = buf.sampleRate
  const dstRate = 16000
  const ratio = srcRate / dstRate
  const src = buf.getChannelData(0)
  const numSamples = Math.floor(buf.length / ratio)
  const pcm = new Int16Array(numSamples)
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, src[Math.min(Math.round(i * ratio), src.length - 1)]))
    pcm[i] = s < 0 ? s * 32768 : s * 32767
  }
  return new Uint8Array(pcm.buffer)
}

export function SalesAssistantPanel() {
  const [avatarState, setAvatarState] = useState<AvatarState>('idle')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isReady, setIsReady] = useState(false)
  const [pendingImage, setPendingImage] = useState<{ base64: string; mediaType: string; preview: string } | null>(null)

  const sendAudioRef = useRef<((chunk: Uint8Array) => void) | null>(null)
  const messagesRef = useRef<{ role: string; content: unknown }[]>([])
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const busy = avatarState === 'thinking' || avatarState === 'talking'

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const handleClientReady = useCallback(({ sendAudio }: {
    sendAudio: (chunk: Uint8Array) => void
  }) => {
    sendAudioRef.current = sendAudio
    setIsReady(true)
    setAvatarState('idle')
  }, [])

  const handleAvatarReady = useCallback(() => {
    setAvatarState('idle')
  }, [])

  const handleAvatarError = useCallback((e: string) => {
    console.error('[avatar] error:', e)
    setAvatarState('error')
  }, [])

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const mediaType = file.type as string
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      const base64 = dataUrl.split(',')[1]
      setPendingImage({ base64, mediaType, preview: dataUrl })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [])

  const handleSend = useCallback(async (text: string) => {
    const hasImage = !!pendingImage
    if (!text.trim() && !hasImage) return
    if (busy) return

    if (!playbackAudioRef.current) {
      playbackAudioRef.current = document.createElement('audio')
    }
    playbackAudioRef.current.muted = true
    playbackAudioRef.current.play().catch(() => {})

    const displayText = text.trim() || (hasImage ? '📷 [foto enviada]' : '')
    setInput('')
    setMessages(prev => [...prev, {
      role: 'user',
      text: displayText,
      imagePreview: pendingImage?.preview,
    }])
    setAvatarState('thinking')
    scrollToBottom()

    const apiContent = hasImage
      ? [
          { type: 'image', source: { type: 'base64', media_type: pendingImage!.mediaType, data: pendingImage!.base64 } },
          { type: 'text', text: text.trim() || '¿Qué producto me recomiendas basándote en mi foto?' },
        ]
      : text.trim()
    messagesRef.current = [...messagesRef.current, { role: 'user', content: apiContent }]
    setPendingImage(null)

    try {
      const brainRes = await fetch('/api/brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesRef.current,
          systemPrompt: buildSystemPrompt()
        }),
      })
      if (!brainRes.ok) throw new Error(`Brain error: ${brainRes.status}`)

      let fullText = ''
      const reader = brainRes.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ') && line.slice(6) !== '[DONE]') {
            fullText += line.slice(6)
          }
        }
      }

      const cleanText = stripMarkdown(fullText)
      messagesRef.current = [...messagesRef.current, { role: 'assistant', content: cleanText as unknown }]
      setMessages(prev => [...prev, { role: 'assistant', text: cleanText }])
      scrollToBottom()

      setAvatarState('talking')

      const voiceRes = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText }),
      })
      if (!voiceRes.ok) {
        const err = await voiceRes.text()
        throw new Error(`Voice error ${voiceRes.status}: ${err}`)
      }

      if (voiceRes.body) {
        const audioReader = voiceRes.body.getReader()
        let allBytes = new Uint8Array(0)
        while (true) {
          const { done, value } = await audioReader.read()
          if (done) break
          if (value) {
            const merged = new Uint8Array(allBytes.byteLength + value.byteLength)
            merged.set(allBytes)
            merged.set(value, allBytes.byteLength)
            allBytes = merged
          }
        }

        if (allBytes.byteLength > 0 && playbackAudioRef.current) {
          const mp3Blob = new Blob([allBytes], { type: 'audio/mpeg' })
          const url = URL.createObjectURL(mp3Blob)
          const audio = playbackAudioRef.current
          audio.muted = false
          audio.src = url
          audio.load()

          try {
            const decodeCtx = new AudioContext()
            const arrayBuf = allBytes.buffer.slice(allBytes.byteOffset, allBytes.byteOffset + allBytes.byteLength)
            const decoded = await decodeCtx.decodeAudioData(arrayBuf)
            decodeCtx.close()
            const pcm16 = audioBufferToPcm16(decoded)
            const CHUNK = 6000
            for (let i = 0; i < pcm16.byteLength; i += CHUNK) {
              sendAudioRef.current?.(pcm16.slice(i, Math.min(i + CHUNK, pcm16.byteLength)))
            }
          } catch (e) {
            console.warn('[decode] error al decodificar MP3:', e)
          }

          await new Promise<void>(resolve => {
            audio.onended = () => { URL.revokeObjectURL(url); resolve() }
            audio.onerror = () => { URL.revokeObjectURL(url); resolve() }
            audio.play().catch(() => resolve())
          })
        }
      }
    } catch (err) {
      console.error('[handleSend] error:', err)
      setAvatarState('error')
      return
    }

    setAvatarState('idle')
  }, [busy, pendingImage, scrollToBottom])

  const FACE_ID = process.env.NEXT_PUBLIC_SIMLI_FACE_ID || ''
  const G = '#98CA3F'

  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <div className="flex flex-col h-full" style={{ background: 'linear-gradient(160deg, #050a04 0%, #071209 55%, #0a1a08 100%)' }}>
      {/* Avatar Section */}
      <div className="flex-shrink-0 pt-5 pb-3 flex flex-col items-center gap-2"
        style={{ borderBottom: `1px solid ${G}20` }}>
        <AgentAvatar
          faceId={FACE_ID}
          state={avatarState}
          size={160}
          onReady={handleAvatarReady}
          onError={handleAvatarError}
          onClientReady={handleClientReady}
        />
        <p className="text-xs tracking-wide" style={{
          color: avatarState === 'error' ? '#ef4444' :
                 avatarState === 'talking' ? G :
                 avatarState === 'thinking' ? '#f59e0b' : `${G}99`,
          textShadow: avatarState === 'talking' ? `0 0 8px ${G}` : 'none',
        }}>
          {avatarState === 'thinking' ? '⏳ Pensando...' :
           avatarState === 'talking'  ? '🎙 Hablando...' :
           avatarState === 'error'    ? '⚠️ Error de conexión' :
           'VEGA-BOT listo para ayudarte'}
        </p>
      </div>

      {/* Messages — scroll nativo para garantizar comportamiento correcto */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        scrollbarWidth: 'thin',
        scrollbarColor: `${G}30 transparent`,
      }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60px' }}>
            <div style={{
              background: `rgba(152,202,63,0.06)`,
              border: `1px solid ${G}25`,
              borderRadius: '16px 16px 16px 4px',
              padding: '12px 14px',
              maxWidth: '260px',
            }}>
              <p style={{ color: '#c8d8c0', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                👋 Hola, soy <strong style={{ color: G }}>VEGA-BOT</strong>, tu asistente de ventas.
                Hoy es <strong style={{ color: G }}>{today}</strong> y estoy aquí
                para ayudarte a encontrar el producto perfecto. ¿En qué te puedo ayudar?
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
            >
              <div
                style={msg.role === 'user' ? {
                  background: `linear-gradient(135deg, ${G} 0%, #6aad1a 100%)`,
                  color: '#050d04',
                  fontWeight: 600,
                  boxShadow: `0 0 12px ${G}40`,
                  borderRadius: '14px 14px 4px 14px',
                  padding: '8px 12px',
                  maxWidth: '240px',
                  fontSize: '13px',
                  lineHeight: 1.55,
                  wordBreak: 'break-word',
                } : {
                  background: `rgba(152,202,63,0.06)`,
                  color: '#c8d8c0',
                  border: `1px solid ${G}20`,
                  borderRadius: '14px 14px 14px 4px',
                  padding: '8px 12px',
                  maxWidth: '240px',
                  fontSize: '13px',
                  lineHeight: 1.55,
                  wordBreak: 'break-word',
                }}
              >
                {msg.imagePreview && (
                  <img
                    src={msg.imagePreview}
                    alt="foto enviada"
                    style={{ width: '100%', borderRadius: '8px', marginBottom: msg.text && msg.text !== '📷 [foto enviada]' ? '6px' : 0, display: 'block' }}
                  />
                )}
                {msg.text && msg.text !== '📷 [foto enviada]' && <span>{msg.text}</span>}
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-3" style={{ borderTop: `1px solid ${G}20`, background: `rgba(152,202,63,0.03)` }}>
        {/* Preview de imagen pendiente */}
        {pendingImage && (
          <div style={{ marginBottom: '8px', position: 'relative', display: 'inline-block' }}>
            <img
              src={pendingImage.preview}
              alt="adjunto"
              style={{ height: '60px', borderRadius: '8px', border: `1px solid ${G}40`, display: 'block' }}
            />
            <button
              onClick={() => setPendingImage(null)}
              style={{
                position: 'absolute', top: '-6px', right: '-6px',
                background: '#1a1a1a', border: `1px solid ${G}40`,
                borderRadius: '50%', width: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', padding: 0,
              }}
            >
              <X style={{ width: '10px', height: '10px', color: G }} />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          {/* Botón adjuntar imagen */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageSelect}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={!isReady || busy}
            size="sm"
            title="Adjuntar foto"
            style={(!isReady || busy) ? {
              background: 'rgba(30,40,30,0.8)',
              color: '#334',
              flexShrink: 0,
            } : {
              background: 'rgba(10,18,12,0.8)',
              border: `1px solid ${G}40`,
              color: pendingImage ? G : `${G}80`,
              flexShrink: 0,
            }}
          >
            <ImagePlus className="w-4 h-4" />
          </Button>
          <Input
            placeholder={isReady ? 'Escribe tu pregunta...' : 'Conectando VEGA-BOT...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend(input)
              }
            }}
            disabled={!isReady || busy}
            style={{
              background: 'rgba(10,18,12,0.8)',
              border: `1px solid ${G}28`,
              color: '#e0ead8',
            }}
            className="placeholder-gray-600 focus-visible:ring-[#98CA3F] focus-visible:ring-1 focus-visible:border-[#98CA3F]"
          />
          <Button
            onClick={() => handleSend(input)}
            disabled={!isReady || busy || (!input.trim() && !pendingImage)}
            size="sm"
            style={(!isReady || busy || (!input.trim() && !pendingImage)) ? {
              background: 'rgba(30,40,30,0.8)',
              color: '#334',
            } : {
              background: `linear-gradient(135deg, ${G} 0%, #6aad1a 100%)`,
              color: '#050d04',
              boxShadow: `0 0 12px ${G}50`,
            }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
