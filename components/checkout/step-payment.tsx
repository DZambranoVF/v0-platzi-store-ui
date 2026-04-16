'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import type { CheckoutData, CartItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { MercadoPagoBrick } from '@/components/MercadoPagoBrick'

interface StepPaymentProps {
  data: CheckoutData
  onUpdate: (data: Partial<CheckoutData>) => void
  onComplete: () => void
  onBack: () => void
  items: CartItem[]
  onPaymentSuccess: () => void
}

export function StepPayment({ data, onBack, items, onPaymentSuccess }: StepPaymentProps) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

  useEffect(() => {
    const fetchPreference = async () => {
      try {
        const mpItems = items.map(item => ({
          id: String(item.product.id),
          title: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.price,
          picture_url: item.product.images?.[0] ?? '',
        }))

        const shippingData = {
          name: data.nombre,
          email: data.email,
          phone: data.telefono,
          address: data.direccion,
          city: data.ciudad,
          department: data.departamento,
        }

        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: mpItems, shippingData }),
        })

        if (!res.ok) throw new Error(`Error ${res.status}`)

        const json = await res.json()
        setPreferenceId(json.preferenceId)
      } catch {
        setErrorMsg('No se pudo inicializar el pago. Intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    fetchPreference()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-white mb-2">
          Método de pago
        </h2>
        <p className="text-sm text-muted-foreground">
          Elige tu método de pago preferido de forma segura.
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#98CA3F]" />
          <p className="text-sm text-muted-foreground">Preparando pasarela de pago...</p>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-sm text-red-400">{errorMsg}</p>
        </div>
      )}

      {preferenceId && !loading && (
        <MercadoPagoBrick
          preferenceId={preferenceId}
          amount={total}
          onSuccess={onPaymentSuccess}
          onError={() => setErrorMsg('Error procesando el pago, intenta de nuevo.')}
        />
      )}

      <div>
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 rounded-full border-border text-white hover:bg-white/5"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver
        </Button>
      </div>
    </div>
  )
}
