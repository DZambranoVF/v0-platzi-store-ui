'use client'

import { useState } from 'react'
import { Send, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus('success')
    setEmail('')
    
    // Reset after 3 seconds
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <section className="py-16 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#98CA3F]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#FF6B2C]/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#98CA3F]/10 text-neon-green-soft text-sm font-semibold mb-6" style={{ boxShadow: '0 0 15px rgba(152,202,63,0.15), inset 0 0 10px rgba(152,202,63,0.05)' }}>
            Newsletter
          </span>

          {/* Title */}
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-white mb-4">
            Únete a la comunidad
          </h2>

          {/* Description */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Sé el primero en enterarte de nuevos lanzamientos, ofertas exclusivas 
            y contenido especial para la comunidad Platzi.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 bg-[#111111] border-border rounded-full px-6 text-white placeholder:text-muted-foreground focus-visible:ring-[#98CA3F]"
              disabled={status === 'loading' || status === 'success'}
            />
            <Button
              type="submit"
              disabled={status === 'loading' || status === 'success' || !email}
              className="h-12 px-8 rounded-full text-[#0A0A0A] font-semibold disabled:opacity-50 btn-neon-3d border-0"
            >
              {status === 'loading' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : status === 'success' ? (
                <Check className="h-5 w-5" />
              ) : (
                <>
                  <span className="hidden sm:inline">Suscribirse</span>
                  <Send className="h-5 w-5 sm:ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Success Message */}
          {status === 'success' && (
            <p className="mt-4 text-sm text-neon-green-soft">
              ¡Genial! Ya estás suscrito. Revisa tu correo.
            </p>
          )}

          {/* Privacy Note */}
          <p className="mt-6 text-xs text-muted-foreground">
            Respetamos tu privacidad. Puedes darte de baja cuando quieras.
          </p>
        </div>
      </div>
    </section>
  )
}
