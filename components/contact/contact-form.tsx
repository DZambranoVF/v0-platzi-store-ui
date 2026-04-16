'use client'

import { useState } from 'react'
import { Send, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface FormData {
  nombre: string
  email: string
  asunto: string
  mensaje: string
}

interface FormErrors {
  nombre?: string
  email?: string
  asunto?: string
  mensaje?: string
}

const asuntos = [
  { value: 'pedido', label: 'Sobre mi pedido' },
  { value: 'producto', label: 'Información de producto' },
  { value: 'devolucion', label: 'Devoluciones' },
  { value: 'otro', label: 'Otro' },
]

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const validateField = (field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case 'nombre':
        if (!value.trim()) return 'El nombre es requerido'
        return undefined
      case 'email':
        if (!value.trim()) return 'El email es requerido'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido'
        return undefined
      case 'asunto':
        if (!value) return 'Selecciona un asunto'
        return undefined
      case 'mensaje':
        if (!value.trim()) return 'El mensaje es requerido'
        if (value.trim().length < 10) return 'El mensaje es muy corto'
        return undefined
      default:
        return undefined
    }
  }

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => new Set([...prev, field]))
    const error = validateField(field, formData[field])
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (touched.has(field)) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {
      nombre: validateField('nombre', formData.nombre),
      email: validateField('email', formData.email),
      asunto: validateField('asunto', formData.asunto),
      mensaje: validateField('mensaje', formData.mensaje),
    }
    setErrors(newErrors)
    setTouched(new Set(['nombre', 'email', 'asunto', 'mensaje']))
    return !Object.values(newErrors).some(error => error !== undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateAll()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Error al enviar')
      setStatus('success')
      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' })
      setTouched(new Set())
    } catch {
      setStatus('idle')
      setErrors(prev => ({ ...prev, mensaje: 'No se pudo enviar. Intenta de nuevo.' }))
    }
  }

  const isValid = !Object.values(errors).some(e => e) &&
    formData.nombre && formData.email && formData.asunto && formData.mensaje

  if (status === 'success') {
    return (
      <div className="bg-[#111111] rounded-2xl border border-border p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#98CA3F] flex items-center justify-center glow-green-sm">
          <Check className="h-8 w-8 text-[#0A0A0A]" />
        </div>
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-white mb-2">
          Mensaje enviado
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Gracias por contactarnos. Te responderemos pronto.
        </p>
        <Button
          onClick={() => setStatus('idle')}
          variant="outline"
          className="rounded-full border-border text-white hover:bg-white/5"
        >
          Enviar otro mensaje
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#111111] rounded-2xl border border-border p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-white mb-2">
          Envíanos un mensaje
        </h2>
        <p className="text-sm text-muted-foreground">
          Completa el formulario y te responderemos en menos de 24 horas.
        </p>
      </div>

      {/* Nombre */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Nombre</label>
        <Input
          type="text"
          value={formData.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          onBlur={() => handleBlur('nombre')}
          placeholder="Tu nombre"
          className={cn(
            'h-12 bg-secondary border-border rounded-lg text-white placeholder:text-muted-foreground',
            errors.nombre && touched.has('nombre') && 'border-[#FF2D78]'
          )}
        />
        {errors.nombre && touched.has('nombre') && (
          <p className="text-xs text-[#FF2D78]">{errors.nombre}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          placeholder="tu@email.com"
          className={cn(
            'h-12 bg-secondary border-border rounded-lg text-white placeholder:text-muted-foreground',
            errors.email && touched.has('email') && 'border-[#FF2D78]'
          )}
        />
        {errors.email && touched.has('email') && (
          <p className="text-xs text-[#FF2D78]">{errors.email}</p>
        )}
      </div>

      {/* Asunto */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Asunto</label>
        <Select
          value={formData.asunto}
          onValueChange={(value) => {
            handleChange('asunto', value)
            setTouched(prev => new Set([...prev, 'asunto']))
          }}
        >
          <SelectTrigger
            className={cn(
              'h-12 bg-secondary border-border rounded-lg text-white',
              errors.asunto && touched.has('asunto') && 'border-[#FF2D78]'
            )}
          >
            <SelectValue placeholder="Selecciona un asunto" />
          </SelectTrigger>
          <SelectContent className="bg-[#111111] border-border">
            {asuntos.map((asunto) => (
              <SelectItem key={asunto.value} value={asunto.value}>
                {asunto.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.asunto && touched.has('asunto') && (
          <p className="text-xs text-[#FF2D78]">{errors.asunto}</p>
        )}
      </div>

      {/* Mensaje */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Mensaje</label>
        <Textarea
          value={formData.mensaje}
          onChange={(e) => handleChange('mensaje', e.target.value)}
          onBlur={() => handleBlur('mensaje')}
          placeholder="¿En qué podemos ayudarte?"
          className={cn(
            'min-h-[120px] bg-secondary border-border rounded-lg text-white placeholder:text-muted-foreground',
            errors.mensaje && touched.has('mensaje') && 'border-[#FF2D78]'
          )}
        />
        {errors.mensaje && touched.has('mensaje') && (
          <p className="text-xs text-[#FF2D78]">{errors.mensaje}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isValid || status === 'loading'}
        className="w-full h-14 rounded-full bg-[#98CA3F] text-[#0A0A0A] hover:bg-[#98CA3F]/90 font-semibold disabled:opacity-50 glow-green-sm"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-5 w-5 mr-2" />
            Enviar mensaje
          </>
        )}
      </Button>
    </form>
  )
}
