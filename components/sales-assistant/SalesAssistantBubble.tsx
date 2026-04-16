'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { SalesAssistantPanel } from './SalesAssistantPanel'

const G = '#98CA3F' // Platzi green

export function SalesAssistantBubble() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 60, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>

      {/* Panel flotante */}
      {open && (
        <div style={{
          width: '370px',
          height: 'min(620px, calc(100dvh - 110px))',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #050a04 0%, #071209 55%, #0a1a08 100%)',
          border: `1px solid ${G}35`,
          boxShadow: `0 0 0 1px ${G}10, 0 0 40px ${G}18, 0 0 80px rgba(0,0,0,0.7), inset 0 1px 0 ${G}15`,
        }}>
          {/* Header */}
          <div style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderBottom: `1px solid ${G}20`,
            background: `linear-gradient(90deg, ${G}12 0%, transparent 100%)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
                background: G, boxShadow: `0 0 10px ${G}, 0 0 20px ${G}80`,
              }} />
              <span style={{ color: G, fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textShadow: `0 0 12px ${G}` }}>
                VEGA-BOT · ASISTENTE PLATZI
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: '2px', lineHeight: 1, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = G)}
              onMouseLeave={e => (e.currentTarget.style.color = '#555')}
            >
              <X size={15} />
            </button>
          </div>

          {/* Panel con avatar + chat — lógica intacta */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <SalesAssistantPanel />
          </div>
        </div>
      )}

      {/* Botón avatar circular */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Cerrar asistente' : 'Abrir VEGA-BOT'}
        style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          border: `2.5px solid ${G}90`,
          boxShadow: `0 0 20px ${G}50, 0 0 40px ${G}20, 0 4px 20px rgba(0,0,0,0.5)`,
          cursor: 'pointer',
          padding: 0,
          background: `radial-gradient(circle at 40% 35%, #1a2e10 0%, #0a1408 60%, #060e05 100%)`,
          transition: 'border-color 0.3s, box-shadow 0.3s',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = `0 0 30px ${G}80, 0 0 60px ${G}30, 0 4px 24px rgba(0,0,0,0.6)`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = `0 0 20px ${G}50, 0 0 40px ${G}20, 0 4px 20px rgba(0,0,0,0.5)`
        }}
      >
        {/* Glow ring interior */}
        <div style={{
          position: 'absolute', inset: '4px', borderRadius: '50%',
          border: `1px solid ${G}30`,
          boxShadow: `inset 0 0 12px ${G}20`,
        }} />

        {open ? (
          <X size={24} color={G} style={{ filter: `drop-shadow(0 0 8px ${G})`, position: 'relative' }} />
        ) : (
          <span style={{
            fontSize: '20px',
            fontWeight: 800,
            color: G,
            letterSpacing: '-1px',
            textShadow: `0 0 12px ${G}, 0 0 24px ${G}80`,
            position: 'relative',
          }}>VB</span>
        )}
      </button>

    </div>
  )
}
