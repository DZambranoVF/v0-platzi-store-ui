import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Check, Clock, Package, Truck, Home, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'

interface GraciasPageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function GraciasPage({ searchParams }: GraciasPageProps) {
  const { status } = await searchParams

  if (!status || (status !== 'approved' && status !== 'pending')) {
    redirect('/catalogo')
  }

  const isApproved = status === 'approved'
  const orderNumber = '384721'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 py-24">

        {/* Background glow */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(152,202,63,0.05) 0%, transparent 70%)',
          }}
        />

        <div className="relative w-full max-w-lg mx-auto text-center">

          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isApproved ? 'btn-neon-3d' : 'bg-amber-500/20 border-2 border-amber-500/40'}`}>
              {isApproved
                ? <Check className="h-12 w-12 text-[#0A0A0A]" strokeWidth={3} />
                : <Clock className="h-12 w-12 text-amber-400" />
              }
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
            {isApproved ? (
              <>¡Pedido <span className="text-neon-green">confirmado!</span></>
            ) : (
              <>Pago en <span className="text-amber-400">proceso...</span></>
            )}
          </h1>

          {/* Slogan */}
          <p className="text-sm font-bold tracking-[0.2em] uppercase mb-6">
            <span className="text-white">NUNCA PARES </span>
            <span className="text-neon-green" style={{ textShadow: '0 0 10px rgba(152,202,63,0.6)' }}>
              DE COMPRAR
            </span>
          </p>

          {/* Description */}
          <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-sm mx-auto">
            {isApproved
              ? 'Gracias por tu compra. Recibirás un correo con los detalles de tu pedido y el seguimiento del envío.'
              : 'Estamos verificando tu pago. Te notificaremos por email cuando se confirme.'}
          </p>

          {/* Order Card */}
          <div className="bg-[#111111] border border-border rounded-2xl p-6 mb-8 text-left space-y-4">

            {/* Order number */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Número de pedido</span>
              <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-neon-green text-sm">
                #{orderNumber}
              </span>
            </div>

            <div className="h-px bg-border" />

            {/* Status steps */}
            <div className="space-y-3">
              {[
                { icon: Check,   label: 'Pago confirmado',        done: isApproved },
                { icon: Package, label: 'Preparando tu pedido',   done: isApproved },
                { icon: Truck,   label: 'En camino pronto',       done: false },
              ].map(({ icon: Icon, label, done }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${done ? 'bg-[#98CA3F]/20 border border-[#98CA3F]' : 'bg-secondary border border-border'}`}>
                    <Icon className={`h-4 w-4 ${done ? 'text-neon-green' : 'text-muted-foreground'}`} />
                  </div>
                  <span className={`text-sm font-medium ${done ? 'text-white' : 'text-muted-foreground'}`}>
                    {label}
                  </span>
                  {done && (
                    <span className="ml-auto text-xs text-neon-green font-semibold">Listo</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="rounded-full text-[#0A0A0A] font-semibold px-8 h-12 btn-neon-3d border-0"
            >
              <Link href="/catalogo" className="flex items-center gap-2">
                Seguir comprando
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full font-semibold px-8 h-12 border-border text-white hover:text-neon-green hover:border-[#98CA3F] hover:bg-white/5"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Ir al inicio
              </Link>
            </Button>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
