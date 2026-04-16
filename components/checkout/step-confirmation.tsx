'use client'

import { ArrowLeft, CreditCard, MapPin, User, ShoppingBag, Loader2, Check } from 'lucide-react'
import type { CheckoutData, CartItem } from '@/lib/types'
import { formatPrice } from '@/lib/products'
import { Button } from '@/components/ui/button'

interface StepConfirmationProps {
  data: CheckoutData
  items: CartItem[]
  total: number
  onConfirm: () => void
  onBack: () => void
  isSubmitting: boolean
}

export function StepConfirmation({ data, items, total, onConfirm, onBack, isSubmitting }: StepConfirmationProps) {
  const maskedCard = data.numeroTarjeta.slice(-4).padStart(data.numeroTarjeta.length, '*').replace(/(.{4})/g, '$1 ').trim()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-white mb-2">
          Confirmar pedido
        </h2>
        <p className="text-sm text-muted-foreground">
          Revisa los detalles de tu pedido antes de confirmar.
        </p>
      </div>

      {/* Personal Data */}
      <div className="p-4 bg-secondary rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-white font-medium">
          <User className="h-4 w-4 text-[#98CA3F]" />
          Datos personales
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{data.nombre}</p>
          <p>{data.email}</p>
          <p>{data.telefono}</p>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="p-4 bg-secondary rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-white font-medium">
          <MapPin className="h-4 w-4 text-[#98CA3F]" />
          Dirección de envío
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{data.direccion}</p>
          {data.complemento && <p>{data.complemento}</p>}
          <p>{data.ciudad}, {data.departamento}</p>
          {data.referencias && <p className="italic">Ref: {data.referencias}</p>}
        </div>
      </div>

      {/* Payment Method */}
      <div className="p-4 bg-secondary rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-white font-medium">
          <CreditCard className="h-4 w-4 text-[#98CA3F]" />
          Método de pago
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <p className="font-mono">{maskedCard}</p>
          <p>{data.nombreTarjeta}</p>
        </div>
      </div>

      {/* Products */}
      <div className="p-4 bg-secondary rounded-xl space-y-4">
        <div className="flex items-center gap-2 text-white font-medium">
          <ShoppingBag className="h-4 w-4 text-[#98CA3F]" />
          Productos ({items.length})
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.selectedColor}{item.selectedSize && ` / ${item.selectedSize}`} x{item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium text-white">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="p-4 bg-[#98CA3F]/10 border border-[#98CA3F]/30 rounded-xl">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-white">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Envío</span>
            <span className="text-[#98CA3F]">Gratis</span>
          </div>
          <div className="h-px bg-border my-2" />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-white">Total a pagar</span>
            <span className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#98CA3F]">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 h-14 rounded-full border-border text-white hover:bg-white/5 disabled:opacity-50"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="flex-1 h-14 rounded-full bg-[#98CA3F] text-[#0A0A0A] hover:bg-[#98CA3F]/90 font-semibold disabled:opacity-70 glow-green-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Check className="h-5 w-5 mr-2" />
              Confirmar pedido
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Al confirmar, aceptas nuestros términos y condiciones de compra.
      </p>
    </div>
  )
}
