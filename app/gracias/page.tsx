import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Check, Clock } from 'lucide-react'
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center py-16">
          {/* Icono */}
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isApproved
                ? 'btn-neon-3d'
                : 'bg-amber-500/20 border-2 border-amber-500/40'
            }`}
          >
            {isApproved ? (
              <Check className="h-10 w-10 text-[#0A0A0A]" />
            ) : (
              <Clock className="h-10 w-10 text-amber-400" />
            )}
          </div>

          {/* Título */}
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-white mb-4">
            {isApproved ? '¡Pedido confirmado!' : 'Tu pago está siendo procesado'}
          </h1>

          {/* Mensaje */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {isApproved
              ? 'Te enviaremos un email con los detalles de tu pedido y el seguimiento del envío.'
              : 'Estamos verificando tu pago. Te notificaremos por email cuando se confirme.'}
          </p>

          {/* CTA */}
          <Button
            asChild
            className="rounded-full text-[#0A0A0A] font-semibold px-8 h-12 btn-neon-3d border-0"
          >
            <Link href="/catalogo">Seguir comprando</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  )
}
