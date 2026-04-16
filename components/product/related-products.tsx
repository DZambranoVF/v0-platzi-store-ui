import { products } from '@/lib/products'
import { ProductCard } from '@/components/product-card'

interface RelatedProductsProps {
  currentProductId: string
  category: string
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const relatedProducts = products
    .filter(p => p.id !== currentProductId && p.category === category)
    .slice(0, 4)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <span className="text-[#98CA3F] text-sm font-semibold uppercase tracking-wider">
            Te puede interesar
          </span>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-white mt-2">
            Productos relacionados
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
