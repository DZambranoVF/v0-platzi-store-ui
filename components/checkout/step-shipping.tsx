'use client'

import { useState } from 'react'
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react'
import type { CheckoutData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface StepShippingProps {
  data: CheckoutData
  onUpdate: (data: Partial<CheckoutData>) => void
  onComplete: () => void
  onBack: () => void
}

interface FieldErrors {
  departamento?: string
  ciudad?: string
  direccion?: string
}

const departamentos = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá',
  'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca',
  'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño',
  'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia',
  'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
]

export function StepShipping({ data, onUpdate, onComplete, onBack }: StepShippingProps) {
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const validateField = (field: keyof FieldErrors, value: string): string | undefined => {
    switch (field) {
      case 'departamento':
        if (!value) return 'Selecciona un departamento'
        return undefined
      case 'ciudad':
        if (!value.trim()) return 'La ciudad es requerida'
        return undefined
      case 'direccion':
        if (!value.trim()) return 'La dirección es requerida'
        if (value.trim().length < 10) return 'Ingresa una dirección más detallada'
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
      departamento: validateField('departamento', data.departamento),
      ciudad: validateField('ciudad', data.ciudad),
      direccion: validateField('direccion', data.direccion),
    }
    setErrors(newErrors)
    setTouched(new Set(['departamento', 'ciudad', 'direccion']))
    return !Object.values(newErrors).some(error => error !== undefined)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateAll()) {
      onComplete()
    }
  }

  const isValid = !errors.departamento && !errors.ciudad && !errors.direccion &&
    data.departamento && data.ciudad && data.direccion

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-white mb-2">
          Dirección de envío
        </h2>
        <p className="text-sm text-muted-foreground">
          ¿A dónde enviamos tu pedido?
        </p>
      </div>

      {/* Departamento */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          Departamento
        </label>
        <Select
          value={data.departamento}
          onValueChange={(value) => {
            handleChange('departamento', value)
            setTouched(prev => new Set([...prev, 'departamento']))
          }}
        >
          <SelectTrigger
            className={cn(
              'h-12 bg-secondary border-border rounded-lg text-white',
              errors.departamento && touched.has('departamento') && 'border-[#FF2D78]'
            )}
          >
            <SelectValue placeholder="Selecciona tu departamento" />
          </SelectTrigger>
          <SelectContent className="bg-[#111111] border-border max-h-[300px]">
            {departamentos.map((dep) => (
              <SelectItem key={dep} value={dep}>{dep}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.departamento && touched.has('departamento') && (
          <p className="text-xs text-[#FF2D78]">{errors.departamento}</p>
        )}
      </div>

      {/* Ciudad */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Ciudad</label>
        <Input
          type="text"
          value={data.ciudad}
          onChange={(e) => handleChange('ciudad', e.target.value)}
          onBlur={() => handleBlur('ciudad')}
          placeholder="Tu ciudad"
          className={cn(
            'h-12 bg-secondary border-border rounded-lg text-white placeholder:text-muted-foreground',
            errors.ciudad && touched.has('ciudad') && 'border-[#FF2D78] focus-visible:ring-[#FF2D78]'
          )}
        />
        {errors.ciudad && touched.has('ciudad') && (
          <p className="text-xs text-[#FF2D78]">{errors.ciudad}</p>
        )}
      </div>

      {/* Dirección */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Dirección</label>
        <Input
          type="text"
          value={data.direccion}
          onChange={(e) => handleChange('direccion', e.target.value)}
          onBlur={() => handleBlur('direccion')}
          placeholder="Calle, número, barrio"
          className={cn(
            'h-12 bg-secondary border-border rounded-lg text-white placeholder:text-muted-foreground',
            errors.direccion && touched.has('direccion') && 'border-[#FF2D78] focus-visible:ring-[#FF2D78]'
          )}
        />
        {errors.direccion && touched.has('direccion') && (
          <p className="text-xs text-[#FF2D78]">{errors.direccion}</p>
        )}
      </div>

      {/* Complemento */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">
          Complemento <span className="text-muted-foreground">(opcional)</span>
        </label>
        <Input
          type="text"
          value={data.complemento}
          onChange={(e) => onUpdate({ complemento: e.target.value })}
          placeholder="Apartamento, oficina, piso..."
          className="h-12 bg-secondary border-border rounded-lg text-white placeholder:text-muted-foreground"
        />
      </div>

      {/* Referencias */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">
          Referencias <span className="text-muted-foreground">(opcional)</span>
        </label>
        <Textarea
          value={data.referencias}
          onChange={(e) => onUpdate({ referencias: e.target.value })}
          placeholder="Cerca de..., frente a..., edificio color..."
          className="bg-secondary border-border rounded-lg text-white placeholder:text-muted-foreground min-h-[80px]"
        />
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
          className="flex-1 h-14 rounded-full bg-[#98CA3F] text-[#0A0A0A] hover:bg-[#98CA3F]/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed glow-green-sm"
        >
          Continuar
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </form>
  )
}
