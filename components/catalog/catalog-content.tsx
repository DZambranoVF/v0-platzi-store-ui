'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { products, categories } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular'

export function CatalogContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'todos'
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = selectedCategory === 'todos' 
      ? [...products]
      : products.filter(p => p.category === selectedCategory)

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered = filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'price-asc':
        filtered = filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered = filtered.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        filtered = filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
        break
    }

    return filtered
  }, [selectedCategory, sortBy])

  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-white uppercase tracking-wider mb-4">
          Categorías
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id)
                setMobileFiltersOpen(false)
              }}
              className={cn(
                'w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                selectedCategory === category.id
                  ? 'bg-[#98CA3F] text-[#0A0A0A]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Info */}
      <div>
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-white uppercase tracking-wider mb-4">
          Rango de precios
        </h3>
        <p className="text-sm text-muted-foreground">
          Desde $25.000 hasta $245.000 COP
        </p>
      </div>

      {/* Clear Filters */}
      {selectedCategory !== 'todos' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedCategory('todos')}
          className="w-full rounded-full border-border text-white hover:bg-white/5"
        >
          <X className="h-4 w-4 mr-2" />
          Limpiar filtros
        </Button>
      )}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 p-6 bg-[#111111] rounded-xl border border-border">
            <FilterSidebar />
          </div>
        </aside>

        {/* Products */}
        <div className="lg:col-span-3">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            {/* Mobile Filter Button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="lg:hidden rounded-full border-border text-white hover:bg-white/5"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#0A0A0A] border-r border-border w-[280px]">
                <SheetHeader className="mb-6">
                  <SheetTitle className="font-[family-name:var(--font-space-grotesk)] text-white">
                    Filtros
                  </SheetTitle>
                </SheetHeader>
                <FilterSidebar />
              </SheetContent>
            </Sheet>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground hidden lg:block">
              {filteredAndSortedProducts.length} productos
            </p>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">Ordenar por:</span>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[160px] bg-[#111111] border-border text-white rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#111111] border-border">
                  <SelectItem value="newest">Más nuevo</SelectItem>
                  <SelectItem value="price-asc">Precio menor</SelectItem>
                  <SelectItem value="price-desc">Precio mayor</SelectItem>
                  <SelectItem value="popular">Más popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No se encontraron productos.</p>
              <Button
                variant="link"
                onClick={() => setSelectedCategory('todos')}
                className="text-[#98CA3F] mt-2"
              >
                Ver todos los productos
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
