'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, ChevronLeft, Lock, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice } from '@/lib/products'
import type { CheckoutData, CheckoutStep } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { StepPersonalData } from './step-personal-data'
import { StepShipping } from './step-shipping'
import { StepPayment } from './step-payment'
import { StepConfirmation } from './step-confirmation'
import { cn } from '@/lib/utils'

const steps = [
  { number: 1, title: 'Datos personales' },
  { number: 2, title: 'Dirección de envío' },
  { number: 3, title: 'Método de pago' },
  { number: 4, title: 'Confirmación' },
]

const initialFormData: CheckoutData = {
  nombre: '',
  email: '',
  telefono: '',
  departamento: '',
  ciudad: '',
  direccion: '',
  complemento: '',
  referencias: '',
  numeroTarjeta: '',
  nombreTarjeta: '',
  expiracion: '',
  cvv: '',
}

export function CheckoutFlow() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1)
  const [formData, setFormData] = useState<CheckoutData>(initialFormData)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  // Redirect if cart is empty (only on client)
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push('/catalogo')
    }
  }, [items, router, orderComplete])

  const updateFormData = (data: Partial<CheckoutData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const handleStepComplete = (step: CheckoutStep) => {
    setCompletedSteps(prev => new Set([...prev, step]))
    if (step < 4) {
      setCurrentStep((step + 1) as CheckoutStep)
    }
  }

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as CheckoutStep)
    }
  }

  const handleConfirmOrder = async () => {
    setIsSubmitting(true)
    // Simulate order submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    setOrderComplete(true)
    clearCart()
    setIsSubmitting(false)
  }

  const canNavigateToStep = (step: number): boolean => {
    if (step === 1) return true
    return completedSteps.has(step - 1)
  }

  if (items.length === 0 && !orderComplete) {
    return null
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#98CA3F] flex items-center justify-center glow-green">
            <Check className="h-10 w-10 text-[#0A0A0A]" />
          </div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-white mb-4">
            ¡Pedido confirmado!
          </h1>
          <p className="text-muted-foreground mb-8">
            Gracias por tu compra. Recibirás un email con los detalles de tu pedido y el seguimiento del envío.
          </p>
          <Button
            asChild
            className="rounded-full bg-[#98CA3F] text-[#0A0A0A] hover:bg-[#98CA3F]/90 font-semibold px-8 h-12"
          >
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            disabled={currentStep === 1}
            className="text-white hover:text-[#98CA3F] hover:bg-white/5 disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-white">
              Checkout
            </h1>
            <p className="text-sm text-muted-foreground">Paso {currentStep} de 4</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span className="hidden sm:inline">Pago seguro</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
              <div 
                className="absolute top-5 left-0 h-0.5 bg-[#98CA3F] transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
              
              {steps.map((step) => {
                const isCompleted = completedSteps.has(step.number)
                const isCurrent = currentStep === step.number
                const isAccessible = canNavigateToStep(step.number)

                return (
                  <button
                    key={step.number}
                    onClick={() => isAccessible && setCurrentStep(step.number as CheckoutStep)}
                    disabled={!isAccessible}
                    className={cn(
                      'relative flex flex-col items-center gap-2 z-10',
                      isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                        isCompleted && 'bg-[#98CA3F] text-[#0A0A0A]',
                        isCurrent && !isCompleted && 'bg-[#98CA3F] text-[#0A0A0A] glow-green-sm',
                        !isCompleted && !isCurrent && isAccessible && 'bg-secondary text-white',
                        !isAccessible && 'bg-secondary/50 text-muted-foreground'
                      )}
                    >
                      {isCompleted ? <Check className="h-5 w-5" /> : step.number}
                    </div>
                    <span
                      className={cn(
                        'text-xs font-medium hidden sm:block',
                        isCurrent ? 'text-white' : 'text-muted-foreground'
                      )}
                    >
                      {step.title}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-[#111111] rounded-2xl border border-border p-6 sm:p-8">
            {currentStep === 1 && (
              <StepPersonalData
                data={formData}
                onUpdate={updateFormData}
                onComplete={() => handleStepComplete(1)}
              />
            )}
            {currentStep === 2 && (
              <StepShipping
                data={formData}
                onUpdate={updateFormData}
                onComplete={() => handleStepComplete(2)}
                onBack={handleGoBack}
              />
            )}
            {currentStep === 3 && (
              <StepPayment
                data={formData}
                onUpdate={updateFormData}
                onComplete={() => handleStepComplete(3)}
                onBack={handleGoBack}
              />
            )}
            {currentStep === 4 && (
              <StepConfirmation
                data={formData}
                items={items}
                total={getTotal()}
                onConfirm={handleConfirmOrder}
                onBack={handleGoBack}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#111111] rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-white mb-4">
              Resumen del pedido
            </h2>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                  className="flex gap-3"
                >
                  <div className="w-14 h-14 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.selectedColor}
                      {item.selectedSize && ` / ${item.selectedSize}`} x{item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-white">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="h-px bg-border mb-4" />

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-white">{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-[#98CA3F]">Gratis</span>
              </div>
            </div>

            <div className="h-px bg-border my-4" />

            <div className="flex justify-between">
              <span className="font-semibold text-white">Total</span>
              <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[#98CA3F]">
                {formatPrice(getTotal())}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
