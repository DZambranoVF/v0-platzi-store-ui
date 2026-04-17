'use client'

import { initMercadoPago, Payment } from '@mercadopago/sdk-react'

initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, { locale: 'es-CO' })

interface MercadoPagoBrickProps {
  preferenceId: string
  amount: number
  onSuccess: () => void
  onError: (error: unknown) => void
}

export function MercadoPagoBrick({ preferenceId, amount, onSuccess, onError }: MercadoPagoBrickProps) {
  return (
    <Payment
      initialization={{ amount, preferenceId }}
      customization={{
        visual: {
          style: {
            theme: 'dark',
            customVariables: {
              baseColor: '#98CA3F',
              inputBackgroundColor: '#1A1A1A',
              formBackgroundColor: '#111111',
              textPrimaryColor: '#FFFFFF',
              textSecondaryColor: '#A0A0A0',
            },
          },
        },
        paymentMethods: {
          creditCard: 'all',
          debitCard: 'all',
          ticket: 'all',
          bankTransfer: 'all',
          mercadoPago: 'all',
        },
      }}
      onSubmit={async ({ selectedPaymentMethod, formData }) => {
        const res = await fetch('/api/process-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedPaymentMethod, formData }),
        })
        if (!res.ok) throw new Error('Payment failed')
        onSuccess()
      }}
      onError={onError}
    />
  )
}
