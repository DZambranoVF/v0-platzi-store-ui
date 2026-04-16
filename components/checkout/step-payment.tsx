'use client'

import { useState } from 'react'
import { CreditCard, ArrowRight, ArrowLeft, Lock } from 'lucide-react'
import type { CheckoutData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface StepPaymentProps {
  data: CheckoutData
  onUpdate: (data: Partial<CheckoutData>) => void
  onComplete: () => void
  onBack: () => void
}

interface FieldErrors {
  numeroTarjeta?: string
  nombreTarjeta?: string
  expiracion?: string
  cvv?: string
}

export function StepPayment({ data, onUpdate, onComplete, onBack }: StepPaymentProps) {
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})/g, '$1 ').trim()
  }

  const formatExpiration = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2)
    }
    return digits
  }

  const getCardType = (number: string): string => {
    const digits = number.replace(/\D/g, '')
    if (digits.startsWith('4')) return 'visa'
    if (/^5[1-5]/.test(digits)) return 'mastercard'
    if (/^3[47]/.test(digits)) return 'amex'
    return ''
  }

  const validateField = (field: keyof FieldErrors, value: string): string | undefined => {
    switch (field) {
      case 'numeroTarjeta':
        const digits = value.replace(/\D/g, '')
        if (!digits) return 'El número de tarjeta es requerido'
        if (digits.length < 15) return 'Número de tarjeta inválido'
        return undefined
      case 'nombreTarjeta':
        if (!value.trim()) return 'El nombre es requerido'
        return undefined
      case 'expiracion':
        if (!value) return 'La fecha es requerida'
        const [month, year] = value.split('/')
        if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12) {
          return 'Fecha inválida'
        }
        return undefined
      case 'cvv':
        if (!value) return 'El CVV es requerido'
        if (value.length < 3) return 'CVV inválido'
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
      numeroTarjeta: validateField('numeroTarjeta', data.numeroTarjeta),
      nombreTarjeta: validateField('nombreTarjeta', data.nombreTarjeta),
      expiracion: validateField('expiracion', data.expiracion),
      cvv: validateField('cvv', data.cvv),
    }
    setErrors(newErrors)
    setTouched(new Set(['numeroTarjeta', 'nombreTarjeta', 'expiracion', 'cvv']))
    return !Object.values(newErrors).some(error => error !== undefined)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateAll()) {
      onComplete()
    }
  }

  const isValid = !errors.numeroTarjeta && !errors.nombreTarjeta && !errors.expiracion && !errors.cvv &&
    data.numeroTarjeta && data.nombreTarjeta && data.expiracion && data.cvv

  const cardType = getCardType(data.numeroTarjeta)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-white mb-2">
          Método de pago
        </h2>
        <p className="text-sm text-muted-foreground">
          Ingresa los datos de tu tarjeta de forma segura.
        </p>
      </div>

      {/* Card Logos */}
      <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
        <div className={cn(
          'px-3 py-2 rounded bg-white/10 transition-opacity',
          cardType === 'visa' ? 'opacity-100' : 'opacity-40'
        )}>
          <span className="text-sm font-bold text-blue-500">VISA</span>
        </div>
        <div className={cn(
          'px-3 py-2 rounded bg-white/10 transition-opacity',
          cardType === 'mastercard' ? 'opacity-100' : 'opacity-40'
        )}>
          <div className="flex">
            <div className="w-4 h-4 rounded-full bg-red-500 -mr-1" />
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
          </div>
        </div>
        <div className={cn(
          'px-3 py-2 rounded bg-white/10 transition-opacity',
          cardType === 'amex' ? 'opacity-100' : 'opacity-40'
        )}>
          <span className="text-sm font-bold text-blue-400">AMEX</span>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          Encriptado SSL
        </div>
      </div>

      {/* Número de tarjeta */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          Número de tarjeta
        </label>
        <Input
          type="text"
          value={data.numeroTarjeta}
          onChange={(e) => handleChange('numeroTarjeta', formatCardNumber(e.target.value))}
          onBlur={() => handleBlur('numeroTarjeta')}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          className={cn(
            'h-12 bg-secondary border-border rounded-lg text-white placeholder:text-muted-foreground font-mono',
            errors.numeroTarjeta && touched.has('numeroTarjeta') && 'border-[#FF2D78] focus-visible:ring-[#FF2D78]'
          )}
        />
        {errors.numeroTarjeta && touched.has('numeroTarjeta') && (
          <p className="text-xs text-[#FF2D78]">{errors.numeroTarjeta}</p>
        )}
      </div>

      {/* Nombre en la tarjeta */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Nombre en la tarjeta</label>
        <Input
          type="text"
          value={data.nombreTarjeta}
          onChange={(e) => handleChange('nombreTarjeta', e.target.value.toUpperCase())}
          onBlur={() => handleBlur('nombreTarjeta')}
          placeholder="NOMBRE APELLIDO"
          className={cn(
            'h-12 bg-secondary border-border rounded-lg text-white placeholder:text-muted-foreground uppercase',
            errors.nombreTarjeta && touched.has('nombreTarjeta') && 'border-[#FF2D78] focus-visible:ring-[#FF2D78]'
          )}
        />
        {errors.nombreTarjeta && touched.has('nombreTarjeta') && (
          <p className="text-xs text-[#FF2D78]">{errors.nombreTarjeta}</p>
        )}
      </div>

      {/* Expiration and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Expiración</label>
          <Input
            type="text"
            value={data.expiracion}
            onChange={(e) => handleChange('expiracion', formatExpiration(e.target.value))}
            onBlur={() => handleBlur('expiracion')}
            placeholder="MM/AA"
            maxLength={5}
            className={cn(
              'h-12 bg-secondary border-border rounded-lg text-white placeholder:text-muted-foreground font-mono',
              errors.expiracion && touched.has('expiracion') && 'border-[#FF2D78] focus-visible:ring-[#FF2D78]'
            )}
          />
          {errors.expiracion && touched.has('expiracion') && (
            <p className="text-xs text-[#FF2D78]">{errors.expiracion}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">CVV</label>
          <Input
            type="text"
            value={data.cvv}
            onChange={(e) => handleChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
            onBlur={() => handleBlur('cvv')}
            placeholder="123"
            maxLength={4}
            className={cn(
              'h-12 bg-secondary border-border rounded-lg text-white placeholder:text-muted-foreground font-mono',
              errors.cvv && touched.has('cvv') && 'border-[#FF2D78] focus-visible:ring-[#FF2D78]'
            )}
          />
          {errors.cvv && touched.has('cvv') && (
            <p className="text-xs text-[#FF2D78]">{errors.cvv}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 h-14 rounded-full border-border text-white hover:bg-white/5"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver
        </Button>
        <Button
          type="submit"
          disabled={!isValid}
          className="flex-1 h-14 rounded-full text-[#0A0A0A] font-semibold disabled:opacity-50 disabled:cursor-not-allowed btn-neon-3d border-0"
        >
          Revisar pedido
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </form>
  )
}
