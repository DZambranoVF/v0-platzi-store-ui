'use client'

import { useState } from 'react'
import { User, Mail, Phone, ArrowRight } from 'lucide-react'
import type { CheckoutData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface StepPersonalDataProps {
  data: CheckoutData
  onUpdate: (data: Partial<CheckoutData>) => void
  onComplete: () => void
}

interface FieldErrors {
  nombre?: string
  email?: string
  telefono?: string
}

export function StepPersonalData({ data, onUpdate, onComplete }: StepPersonalDataProps) {
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const validateField = (field: keyof FieldErrors, value: string): string | undefined => {
    switch (field) {
      case 'nombre':
        if (!value.trim()) return 'El nombre es requerido'
        if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres'
        return undefined
      case 'email':
        if (!value.trim()) return 'El email es requerido'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un email válido'
        return undefined
      case 'telefono':
        if (!value.trim()) return 'El teléfono es requerido'
        if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) return 'Ingresa un teléfono de 10 dígitos'
        return undefined
      default:
        return undefined
    }
  }

  const handleBlur = (field: keyof FieldErrors) => {
    setTouched(prev => new Set([...prev, field]))
    const error = validateField(field, data[field])
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleChange = (field: keyof FieldErrors, value: string) => {
    onUpdate({ [field]: value })
    if (touched.has(field)) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const validateAll = (): boolean => {
    const newErrors: FieldErrors = {
      nombre: validateField('nombre', data.nombre),
      email: validateField('email', data.email),
      telefono: validateField('telefono', data.telefono),
    }
    setErrors(newErrors)
    setTouched(new Set(['nombre', 'email', 'telefono']))
    return !Object.values(newErrors).some(error => error !== undefined)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateAll()) {
      onComplete()
    }
  }

  const isValid = !errors.nombre && !errors.email && !errors.telefono &&
    data.nombre && data.email && data.telefono

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-white mb-2">
          Datos personales
        </h2>
        <p className="text-sm text-muted-foreground">
          Ingresa tu información de contacto para el envío.
        </p>
      </div>

      {/* Nombre */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          Nombre completo
        </label>
        <Input
          type="text"
          value={data.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          onBlur={() => handleBlur('nombre')}
          placeholder="Tu nombre completo"
          className={cn(
            'h-12 bg-secondary border-border rounded-lg text-white placeholder:text-muted-foreground',
            errors.nombre && touched.has('nombre') && 'border-[#FF2D78] focus-visible:ring-[#FF2D78]'
          )}
        />
        {errors.nombre && touched.has('nombre') && (
          <p className="text-xs text-[#FF2D78]">{errors.nombre}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          Email
        </label>
        <Input
          type="email"
          value={data.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          placeholder="tu@email.com"
          className={cn(
            'h-12 bg-secondary border-border rounded-lg text-white placeholder:text-muted-foreground',
            errors.email && touched.has('email') && 'border-[#FF2D78] focus-visible:ring-[#FF2D78]'
          )}
        />
        {errors.email && touched.has('email') && (
          <p className="text-xs text-[#FF2D78]">{errors.email}</p>
        )}
      </div>

      {/* Teléfono */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          Teléfono
        </label>
        <Input
          type="tel"
          value={data.telefono}
          onChange={(e) => handleChange('telefono', e.target.value.replace(/\D/g, ''))}
          onBlur={() => handleBlur('telefono')}
          placeholder="3001234567"
          maxLength={10}
          className={cn(
            'h-12 bg-secondary border-border rounded-lg text-white placeholder:text-muted-foreground',
            errors.telefono && touched.has('telefono') && 'border-[#FF2D78] focus-visible:ring-[#FF2D78]'
          )}
        />
        {errors.telefono && touched.has('telefono') && (
          <p className="text-xs text-[#FF2D78]">{errors.telefono}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isValid}
        className="w-full h-14 rounded-full bg-[#98CA3F] text-[#0A0A0A] hover:bg-[#98CA3F]/90 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed glow-green-sm"
      >
        Continuar
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </form>
  )
}
