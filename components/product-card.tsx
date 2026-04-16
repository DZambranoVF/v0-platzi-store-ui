'use client'

import Link from 'next/link'
import { ShoppingBag, Plus } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/products'
import { useCartStore } from '@/lib/cart-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, product.colors[0], product.sizes?.[0])
    openCart()
  }

  return (
    <Link 
      href={`/producto/${product.slug}`}
      className="group block"
    >
      <div className="card-premium rounded-xl overflow-hidden border border-transparent" style={{ boxShadow: '0 0 0 1px rgba(152,202,63,0.12), 0 0 24px rgba(152,202,63,0.08)' }}>
        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-br from-[#181818] to-[#0f0f0f] overflow-hidden" style={{ boxShadow: 'inset 0 0 40px rgba(152,202,63,0.04)' }}>
          {/* Placeholder with icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 group-hover:scale-110 transition-transform duration-300" />
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="badge-neon-3d text-[#0A0A0A] hover:bg-[#98CA3F] font-semibold border-0">
                Nuevo
              </Badge>
            )}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full btn-quick-add-neon text-[#0A0A0A] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            <span className="sr-only">Agregar al carrito</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Colors */}
          <div className="flex items-center gap-1.5 mb-2">
            {product.colors.slice(0, 4).map((color) => (
              <div
                key={color}
                className={cn(
                  'w-3 h-3 rounded-full border border-white/20',
                  color === 'Negro' && 'bg-black',
                  color === 'Blanco' && 'bg-white',
                  color === 'Verde' && 'bg-[#98CA3F]',
                  color === 'Gris' && 'bg-gray-500',
                  color === 'Rosa' && 'bg-[#FF6B2C]',
                  color === 'Multicolor' && 'bg-gradient-to-r from-[#98CA3F] via-[#FF6B2C] to-purple-500'
                )}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-white group-hover:text-[#98CA3F] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Price */}
          <p className="mt-1 font-semibold text-neon-green-soft">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  )
}
