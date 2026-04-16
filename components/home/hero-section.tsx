'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroNodes } from '@/components/hero-nodes'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Interactive Nodes Background */}
      <HeroNodes />
      
      {/* Background */}
      <div className="absolute inset-0 bg-[#0A0A0A] -z-10">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(152, 202, 63, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(152, 202, 63, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/30 to-[#0A0A0A]" />
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#98CA3F]/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#FF6B2C]/10 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#98CA3F]/30 mb-8" style={{ boxShadow: '0 0 15px rgba(152,202,63,0.15), inset 0 0 10px rgba(152,202,63,0.05)' }}>
          <Sparkles className="h-4 w-4 text-neon-green" style={{ filter: 'drop-shadow(0 0 4px rgba(152,202,63,0.6))' }} />
          <span className="text-sm text-neon-green font-semibold">Nueva colección disponible</span>
        </div>

        {/* Main Title */}
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-4">
          <span className="text-3d-white">PLATZI</span>
          <span className="block text-neon-green">STORE</span>
        </h1>

        {/* Subtitle */}
        <p className="font-[family-name:var(--font-space-grotesk)] text-xl sm:text-2xl md:text-3xl text-3d-white-subtitle mb-8 tracking-wide">
          Viste el conocimiento
        </p>

        {/* Description */}
        <p className="max-w-xl mx-auto text-3d-white-desc text-base sm:text-lg mb-10 leading-relaxed">
          Productos exclusivos para la comunidad tech más grande de Latinoamérica. 
          Diseñados para quienes nunca paran de aprender.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            asChild
            size="lg"
            className="rounded-full text-[#0A0A0A] font-semibold px-8 h-14 text-base btn-neon-3d border-0"
          >
            <Link href="/catalogo" className="flex items-center gap-2">
              Explorar colección
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button 
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-white/30 text-white hover:bg-white hover:text-[#0A0A0A] hover:border-white px-8 h-14 text-base transition-all duration-200"
          >
            <Link href="#destacados">
              Ver destacados
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
          {[
            { value: '50K+', label: 'Comunidad' },
            { value: '10+', label: 'Productos' },
            { value: '100%', label: 'Exclusivo' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-neon-green-soft">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-[#98CA3F] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
