'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { AgentAvatar, AvatarState } from './AgentAvatar'
import { products, formatPrice } from '@/lib/products'

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
}

function buildSystemPrompt(): string {
  const productsList = products
    .map(p =>
      `- ${p.name} (${formatPrice(p.price)}): ${p.description}` +
      (p.colors?.length ? ` Colores: ${p.colors.join(', ')}.` : '') +
      (p.sizes?.length ? ` Tallas: ${p.sizes.join(', ')}.` : '')
    )
    .join('\n')

  return `Eres Alex, el asistente de ventas virtual de Platzi Store.

CATÁLOGO:
${productsList}

INSTRUCCIONES:
- Responde siempre en español, máximo 3 oraciones
- Sugiere productos según las necesidades del cliente
- Menciona precios en pesos colombianos (COP)
- No inventes productos fuera del catálogo`
}

function audioBufferToPcm16(buf: AudioBuffer): Uint8Array {
  const ratio = buf.sampleRate / 16000
  const src = buf.getChannelData(0)
  const numSamples = Math.floor(buf.length / ratio)
  const pcm = new Int16Array(numSamples)
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, src[Math.min(Math.round(i * ratio), src.length - 1)]))
    pcm[i] = s < 0 ? s * 32768 : s * 32767
  }
  return new Uint8Array(pcm.buffer)
}

const FACE_ID = process.env.NEXT_PUBLIC_SIMLI_FACE_ID || ''

export function SalesAssistantWidget() {
  // Estados de UI
  const [minimized, setMinimized] = useState(false)
  const [miniOpen, setMiniOpen] = useState(false)

  // Estados del asistente
  const [avatarState, setAvatarState] = useState<AvatarState>('idle')
  const [isReady, setIsReady] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const busy = avatarState === 'thinking' || avatarState === 'talking'

  const sendAudioRef = useRef<((c: Uint8Array) => void) | null>(null)
  const messagesRef = useRef<{ role: string; content: string }[]>([])
  const playbackRef = useRef<HTMLAudioElement | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Minimizar con scroll
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 400) {
        setMinimized(true)
      } else {
        setMinimized(false)
        setMiniOpen(false)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleClientReady = useCallback(({ sendAudio }: { sendAudio: (c: Uint8Array) => void }) => {
    sendAudioRef.current = sendAudio
    setIsReady(true)
  }, [])

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || busy) return

    if (!playbackRef.current) playbackRef.current = document.createElement('audio')
    playbackRef.current.muted = true
    playbackRef.current.play().catch(() => {})

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text }])
    setAvatarState('thinking')
    messagesRef.current = [...messagesRef.current, { role: 'user', content: text }]
    setTimeout(scrollToBottom, 50)

    try {
      const brainRes = await fetch('/api/brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesRef.current, systemPrompt: buildSystemPrompt() }),
      })
      if (!brainRes.ok) throw new Error(`${brainRes.status}`)

      let fullText = ''
      const reader = brainRes.body!.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        for (const line of decoder.decode(value, { stream: true }).split('\n')) {
          if (line.startsWith('data: ') && line.slice(6) !== '[DONE]') fullText += line.slice(6)
        }
      }

      messagesRef.current = [...messagesRef.current, { role: 'assistant', content: fullText }]
      setMessages(prev => [...prev, { role: 'assistant', text: fullText }])
      setTimeout(scrollToBottom, 50)
      setAvatarState('talking')

      const voiceRes = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText }),
      })
      if (!voiceRes.ok) throw new Error(`voice ${voiceRes.status}`)

      if (voiceRes.body) {
        const audioReader = voiceRes.body.getReader()
        let allBytes = new Uint8Array(0)
        while (true) {
          const { done, value } = await audioReader.read()
          if (done) break
          if (value) {
            const m = new Uint8Array(allBytes.byteLength + value.byteLength)
            m.set(allBytes); m.set(value, allBytes.byteLength)
            allBytes = m
          }
        }
        if (allBytes.byteLength > 0 && playbackRef.current) {
          const url = URL.createObjectURL(new Blob([allBytes], { type: 'audio/mpeg' }))
          const audio = playbackRef.current
          audio.muted = false; audio.src = url; audio.load()
          try {
            const ctx = new AudioContext()
            const decoded = await ctx.decodeAudioData(allBytes.buffer.slice(allBytes.byteOffset, allBytes.byteOffset + allBytes.byteLength))
            ctx.close()
            const pcm = audioBufferToPcm16(decoded)
            for (let i = 0; i < pcm.byteLength; i += 6000)
              sendAudioRef.current?.(pcm.slice(i, Math.min(i + 6000, pcm.byteLength)))
          } catch { /* ignorar error de decode */ }
          await new Promise<void>(resolve => {
            audio.onended = () => { URL.revokeObjectURL(url); resolve() }
            audio.onerror = () => { URL.revokeObjectURL(url); resolve() }
            audio.play().catch(() => resolve())
          })
        }
      }
    } catch (err) {
      console.error('[handleSend]', err)
      setAvatarState('error')
      return
    }
    setAvatarState('idle')
  }, [busy, scrollToBottom])

  // ─── UI ───────────────────────────────────────────────────────────────────

  // Versión expandida en la home
  const expanded = (
    <section className="w-full py-12 px-4 bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8 text-center">
          <p className="text-sm text-green-400 uppercase tracking-widest mb-2">Asistente Virtual</p>
          <h2 className="text-4xl font-bold text-white">Hola, soy Alex 👋</h2>
          <p className="text-gray-400 mt-2">Pregúntame sobre productos, tallas, colores o precios</p>
        </div>

        {/* Cuerpo: avatar + chat */}
        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* Avatar */}
          <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
            <AgentAvatar
              faceId={FACE_ID}
              state={avatarState}
              size={220}
              onReady={() => setIsReady(true)}
              onError={() => setAvatarState('error')}
              onClientReady={handleClientReady}
            />
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col gap-3 min-h-[340px]">
            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto max-h-[280px] space-y-3 pr-1">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 text-sm italic">Empieza una conversación...</p>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-sm px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-gray-200 border border-slate-700'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(input) } }}
                placeholder={isReady ? '¿En qué te puedo ayudar?' : 'Conectando avatar...'}
                disabled={!isReady || busy}
                className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!isReady || busy || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg px-4 py-2.5 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  // Botón flotante minimizado
  const mini = (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      {/* Panel mini cuando está abierto */}
      {miniOpen && (
        <div className="w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header mini */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <AgentAvatar faceId={FACE_ID} state={avatarState} size={36}
                onReady={() => setIsReady(true)}
                onError={() => setAvatarState('error')}
                onClientReady={handleClientReady}
              />
              <span className="text-white text-sm font-medium">Alex</span>
            </div>
            <button onClick={() => setMiniOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mensajes mini */}
          <div className="h-48 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-xs italic text-center mt-8">Empieza una conversación...</p>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[200px] px-3 py-1.5 rounded-xl text-xs ${
                    m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-200'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input mini */}
          <div className="flex gap-2 p-3 border-t border-slate-700">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSend(input) } }}
              placeholder="Escribe aquí..."
              disabled={!isReady || busy}
              className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-gray-500 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!isReady || busy || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg px-3 py-1.5 transition-colors"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Botón burbuja */}
      <button
        onClick={() => setMiniOpen(o => !o)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          avatarState === 'talking' ? 'bg-green-600 animate-pulse' :
          avatarState === 'thinking' ? 'bg-yellow-600 animate-pulse' :
          'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>
    </div>
  )

  return (
    <>
      {!minimized && expanded}
      {minimized && mini}
    </>
  )
}
