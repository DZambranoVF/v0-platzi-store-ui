import Link from 'next/link'
import { Shirt, Headphones, Briefcase, ArrowRight } from 'lucide-react'

const categories = [
  {
    id: 'ropa',
    name: 'Ropa',
    description: 'Camisetas, hoodies y más para vestir tu pasión tech',
    icon: Shirt,
    href: '/catalogo?category=ropa',
    color: '#98CA3F',
  },
  {
    id: 'accesorios',
    name: 'Accesorios',
    description: 'Gorras, mochilas, termos y todo lo que necesitas',
    icon: Headphones,
    href: '/catalogo?category=accesorios',
    color: '#FF6B2C',
  },
  {
    id: 'oficina',
    name: 'Oficina',
    description: 'Equipa tu espacio de trabajo con estilo Platzi',
    icon: Briefcase,
    href: '/catalogo?category=oficina',
    color: '#98CA3F',
  },
]

export function CategoriesSection() {
  return (
    <section className="py-16 bg-[#0A0A0A]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-neon-green-soft text-sm font-semibold uppercase tracking-wider">
            Encuentra lo tuyo
          </span>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-white mt-2">
            Explora por categoría
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative p-8 bg-[#111111] rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:border-white/20"
            >
              {/* Background Glow on Hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${category.color}10 0%, transparent 70%)`,
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <category.icon className="h-7 w-7" style={{ color: category.color }} />
                </div>

                {/* Text */}
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-white mb-2 group-hover:text-[#98CA3F] transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {category.description}
                </p>

                {/* Arrow */}
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-white/60 group-hover:text-[#98CA3F] transition-colors">
                  <span>Ver productos</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
