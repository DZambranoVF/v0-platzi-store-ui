'use client'

import { useState, useMemo } from 'react'
import { MapPin, ArrowRight, ArrowLeft, Search } from 'lucide-react'
import type { CheckoutData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

const colombiaCities: Record<string, string[]> = {
  'Amazonas': ['Leticia', 'Puerto Nariño'],
  'Antioquia': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Rionegro', 'Apartadó', 'Turbo', 'Caucasia', 'Sabaneta', 'La Estrella', 'Copacabana'],
  'Arauca': ['Arauca', 'Saravena', 'Tame', 'Fortul'],
  'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga', 'Galapa', 'Puerto Colombia'],
  'Bogotá D.C.': ['Bogotá D.C.'],
  'Bolívar': ['Cartagena', 'Magangué', 'Turbaco', 'Arjona', 'El Carmen de Bolívar'],
  'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa'],
  'Caldas': ['Manizales', 'Villamaría', 'Chinchiná', 'Riosucio', 'La Dorada'],
  'Caquetá': ['Florencia', 'San Vicente del Caguán', 'Puerto Rico'],
  'Casanare': ['Yopal', 'Aguazul', 'Tauramena', 'Villanueva'],
  'Cauca': ['Popayán', 'Santander de Quilichao', 'Puerto Tejada', 'Patía'],
  'Cesar': ['Valledupar', 'Aguachica', 'Bosconia', 'La Jagua de Ibirico'],
  'Chocó': ['Quibdó', 'Istmina', 'Tadó', 'Riosucio'],
  'Córdoba': ['Montería', 'Lorica', 'Sahagún', 'Montelíbano', 'Tierralta'],
  'Cundinamarca': ['Soacha', 'Facatativá', 'Zipaquirá', 'Chía', 'Mosquera', 'Madrid', 'Fusagasugá', 'Girardot'],
  'Guainía': ['Inírida'],
  'Guaviare': ['San José del Guaviare', 'Calamar'],
  'Huila': ['Neiva', 'Pitalito', 'Garzón', 'La Plata'],
  'La Guajira': ['Riohacha', 'Maicao', 'Uribia', 'Manaure'],
  'Magdalena': ['Santa Marta', 'Ciénaga', 'Fundación', 'Plato'],
  'Meta': ['Villavicencio', 'Acacías', 'Granada', 'Puerto López'],
  'Nariño': ['Pasto', 'Tumaco', 'Ipiales', 'La Unión'],
  'Norte de Santander': ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario', 'Los Patios'],
  'Putumayo': ['Mocoa', 'Puerto Asís', 'Orito', 'Valle del Guamuez'],
  'Quindío': ['Armenia', 'Calarcá', 'Montenegro', 'Quimbaya'],
  'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia'],
  'San Andrés y Providencia': ['San Andrés', 'Providencia'],
  'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja'],
  'Sucre': ['Sincelejo', 'Corozal', 'Sampués', 'Tolú'],
  'Tolima': ['Ibagué', 'Espinal', 'Melgar', 'Honda', 'Líbano'],
  'Valle del Cauca': ['Cali', 'Buenaventura', 'Palmira', 'Tuluá', 'Buga', 'Cartago', 'Yumbo', 'Jamundí'],
  'Vaupés': ['Mitú'],
  'Vichada': ['Puerto Carreño'],
}

const departamentos = Object.keys(colombiaCities).sort()

export function StepShipping({ data, onUpdate, onComplete, onBack }: StepShippingProps) {
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [citySearch, setCitySearch] = useState('')

  const availableCities = useMemo(() => {
    if (!data.departamento) return []
    const cities = colombiaCities[data.departamento] || []
    if (!citySearch.trim()) return cities
    return cities.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
  }, [data.departamento, citySearch])

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
            onUpdate({ ciudad: '' })
            setCitySearch('')
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
        <Select
          value={data.ciudad}
          onValueChange={(value) => {
            handleChange('ciudad', value)
            setTouched(prev => new Set([...prev, 'ciudad']))
          }}
          disabled={!data.departamento}
        >
          <SelectTrigger
            className={cn(
              'h-12 bg-secondary border-border rounded-lg text-white',
              errors.ciudad && touched.has('ciudad') && 'border-[#FF2D78]',
              !data.departamento && 'opacity-50 cursor-not-allowed'
            )}
          >
            <SelectValue placeholder={data.departamento ? 'Selecciona tu ciudad' : 'Primero selecciona un departamento'} />
          </SelectTrigger>
          <SelectContent className="bg-[#111111] border-border">
            {/* Buscador */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="Buscar ciudad..."
                className="bg-transparent text-sm text-white placeholder:text-muted-foreground outline-none w-full"
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {availableCities.length > 0 ? (
                availableCities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-3">Sin resultados</p>
              )}
            </div>
          </SelectContent>
        </Select>
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
          Continuar
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </form>
  )
}
