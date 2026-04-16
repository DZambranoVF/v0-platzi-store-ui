import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getFeaturedProducts } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'

export function FeaturedProducts() {
  const products = getFeaturedProducts()

  return (
    <section id="destacados" className="py-16 bg-[#0A0A0A]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-neon-green-soft text-sm font-semibold uppercase tracking-wider">
              Lo mejor para ti
            </span>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-white mt-2">
              Productos destacados
            </h2>
          </div>
          <Button 
            asChild
            variant="ghost" 
            className="text-white hover:text-[#98CA3F] hover:bg-transparent p-0 h-auto font-medium"
          >
            <Link href="/catalogo" className="flex items-center gap-2">
              Ver todo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
