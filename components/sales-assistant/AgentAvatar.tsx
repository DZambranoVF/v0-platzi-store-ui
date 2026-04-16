'use client'

import { SimliClient, generateSimliSessionToken, generateIceServers } from 'simli-client'
import { useEffect, useRef, useState, useCallback } from 'react'

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'talking' | 'error'

interface AgentAvatarProps {
  faceId: string
  state: AvatarState
  size?: number
  onReady?: () => void
  onError?: (msg: string) => void
  onClientReady?: (fns: { sendAudio: (chunk: Uint8Array) => void }) => void
}

function suppressLivekitErrors() {
  const handler = (event: PromiseRejectionEvent) => {
    const msg = String(event.reason?.message ?? event.reason ?? '')
    if (
      msg.includes('signal connection') ||
      msg.includes('Abort handler') ||
      msg.includes('livekit') ||
      msg.includes('ConnectionError') ||
      msg.includes('startup_error') ||
      (msg.includes('WebSocket') && msg.includes('CLOSE'))
    ) {
      console.warn('[simli] promesa rechazada interceptada (LiveKit/WS):', msg)
      event.preventDefault()
    }
  }
  window.addEventListener('unhandledrejection', handler)
  return () => window.removeEventListener('unhandledrejection', handler)
}

const CONNECTION_TIMEOUT_MS = 30_000

export function AgentAvatar({
  faceId,
  state,
  size = 160,
  onReady,
  onError,
  onClientReady,
}: AgentAvatarProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const clientRef = useRef<SimliClient | null>(null)
  const [connected, setConnected] = useState(false)
  const connectedRef = useRef(false)
  const [status, setStatus] = useState('iniciando...')
  const [timedOut, setTimedOut] = useState(false)

  const sendAudio = useCallback((chunk: Uint8Array) => {
    if (!clientRef.current) return
    try {
      clientRef.current.sendAudioData(chunk)
    } catch (e) {
      console.warn('[simli] sendAudioData error:', e)
    }
  }, [])

  const [retryKey, setRetryKey] = useState(0)
  const retry = useCallback(() => {
    setTimedOut(false)
    setStatus('reconectando...')
    setRetryKey(k => k + 1)
  }, [])

  useEffect(() => {
    const removeSuppressor = suppressLivekitErrors()
    return removeSuppressor
  }, [])

  useEffect(() => {
    if (!faceId || !videoRef.current) return

    let cancelled = false
    connectedRef.current = false
    setTimedOut(false)
    setStatus('conectando...')

    const timeoutId = setTimeout(() => {
      if (!cancelled && !connectedRef.current) {
        console.warn('[simli] timeout de conexión alcanzado')
        setTimedOut(true)
        setStatus('sin conexión')
        onError?.('timeout')
      }
    }, CONNECTION_TIMEOUT_MS)

    const init = async () => {
      const apiKey = process.env.NEXT_PUBLIC_SIMLI_API_KEY!
      console.log('[simli] generando token y ICE servers...')

      try {
        const [tokenResult, iceServers] = await Promise.all([
          generateSimliSessionToken({
            config: {
              faceId,
              handleSilence: true,
              maxSessionLength: 1800,
              maxIdleTime: 300,
            },
            apiKey,
          }),
          generateIceServers(apiKey),
        ])

        if (cancelled) return
        console.log('[simli] token OK — iniciando WebRTC...')
        setStatus('señalizando...')

        const ghostAudio = document.createElement('audio')
        ghostAudio.volume = 0

        const simli = new SimliClient(
          tokenResult.session_token,
          videoRef.current!,
          ghostAudio,
          iceServers
        )
        clientRef.current = simli

        simli.on('start', () => {
          if (cancelled) return
          clearTimeout(timeoutId)
          console.log('[simli] ✅ conectado')
          connectedRef.current = true
          setConnected(true)
          setTimedOut(false)
          setStatus('listo')
          ghostAudio.volume = 0
          onReady?.()
          onClientReady?.({ sendAudio })
        })

        simli.on('stop', () => {
          if (cancelled) return
          console.log('[simli] sesión detenida')
          setConnected(false)
          setStatus('desconectado')
        })

        simli.on('error', (err: string) => {
          if (cancelled) return
          if (connectedRef.current) {
            console.warn('[simli] error tardío ignorado (ya conectado):', err)
            return
          }
          clearTimeout(timeoutId)
          console.error('[simli] error definitivo:', err)
          setStatus('error')
          setTimedOut(true)
          onError?.(err)
        })

        simli.on('startup_error', (err: string) => {
          console.warn('[simli] startup_error (reintentando internamente):', err)
        })

        simli.start().catch((err) => {
          if (cancelled) return
          console.error('[simli] start() rechazado:', err)
        })
      } catch (err) {
        if (cancelled) return
        clearTimeout(timeoutId)
        console.error('[simli] error generando token/ICE:', err)
        setStatus('error')
        setTimedOut(true)
        onError?.(String(err))
      }
    }

    init()

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
      if (clientRef.current) {
        try { clientRef.current.stop() } catch { /* ignorar */ }
        clientRef.current = null
      }
    }
  }, [faceId, retryKey, onReady, onError, onClientReady, sendAudio])

  const ringColor = {
    idle:      'border-gray-600',
    listening: 'border-blue-400',
    thinking:  'border-yellow-400',
    talking:   'border-green-400',
    error:     'border-red-500',
  }[state]

  const pulseClass = state === 'talking' || state === 'listening' ? 'animate-pulse' : ''

  return (
    <div className="relative flex flex-col items-center gap-2">
      <div
        className={`relative rounded-full border-4 ${ringColor} ${pulseClass} transition-colors duration-300`}
        style={{ width: size, height: size }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="rounded-full w-full h-full object-cover"
          style={{ display: connected ? 'block' : 'none' }}
        />

        {!connected && (
          <div className="absolute inset-0 rounded-full bg-gray-800 flex items-center justify-center flex-col gap-2 p-4">
            {timedOut ? (
              <>
                <span className="text-red-400 text-xs text-center">sin conexión</span>
                <button
                  onClick={retry}
                  className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors"
                >
                  reintentar
                </button>
              </>
            ) : (
              <>
                <div className="w-6 h-6 border-2 border-t-blue-400 border-gray-700 rounded-full animate-spin" />
                <span className="text-xs text-gray-400">{status}</span>
              </>
            )}
          </div>
        )}
      </div>

      <span className="text-xs text-gray-400 tracking-widest uppercase">
        {state === 'idle'      && 'en espera'}
        {state === 'listening' && 'escuchando'}
        {state === 'thinking'  && 'pensando'}
        {state === 'talking'   && 'hablando'}
        {state === 'error'     && 'error'}
      </span>
    </div>
  )
}
