import { Suspense } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'
import { CatalogContent } from '@/components/catalog/catalog-content'

export const metadata = {
  title: 'Catálogo | Platzi Store',
  description: 'Explora toda la colección de productos exclusivos de Platzi. Ropa, accesorios y más para la comunidad tech.',
}

export default function CatalogoPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen pt-16 bg-[#0A0A0A]">
        {/* Header */}
        <div className="border-b border-border">
          <div className="container mx-auto px-4 py-12">
            <span className="text-[#98CA3F] text-sm font-semibold uppercase tracking-wider">
              Colección completa
            </span>
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold text-white mt-2">
              Catálogo
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl">
              Encuentra el producto perfecto para representar tu pasión por la tecnología y el aprendizaje continuo.
            </p>
          </div>
        </div>

        {/* Catalog Content */}
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

function CatalogSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <div className="h-48 bg-secondary rounded-xl animate-pulse" />
        </div>
        {/* Products Grid Skeleton */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-secondary rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
