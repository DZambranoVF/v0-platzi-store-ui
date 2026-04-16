'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice } from '@/lib/products'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="right" className="bg-[#0A0A0A] border-l border-border w-full sm:max-w-md flex flex-col">
        <SheetHeader className="pb-4">
          <SheetTitle className="font-[family-name:var(--font-space-grotesk)] text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-neon-green-soft" style={{ filter: 'drop-shadow(0 0 4px rgba(152,202,63,0.6))' }} />
            Tu Carrito
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-white mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Explora nuestra colección y encuentra algo increíble.
            </p>
            <Button 
              asChild
              className="rounded-full text-[#0A0A0A] font-semibold px-8 btn-neon-3d border-0"
              onClick={closeCart}
            >
              <Link href="/catalogo">
                Explorar catálogo
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                    className="flex gap-4 p-4 bg-secondary rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-[#1A1A1A] rounded-lg overflow-hidden flex-shrink-0 relative">
                      {item.product.colorImages?.[item.selectedColor] ? (
                        <Image
                          src={item.product.colorImages[item.selectedColor]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          <ShoppingBag className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.selectedColor}
                        {item.selectedSize && ` / ${item.selectedSize}`}
                      </p>
                      <p className="text-sm font-semibold text-neon-green-soft mt-1">
                        {formatPrice(item.product.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedColor,
                              item.quantity - 1,
                              item.selectedSize
                            )
                          }
                          className="w-7 h-7 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white hover:bg-[#98CA3F] hover:text-[#0A0A0A] transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium text-white w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedColor,
                              item.quantity + 1,
                              item.selectedSize
                            )
                          }
                          className="w-7 h-7 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white hover:bg-[#98CA3F] hover:text-[#0A0A0A] transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() =>
                            removeItem(item.product.id, item.selectedColor, item.selectedSize)
                          }
                          className="ml-auto w-7 h-7 rounded-full bg-[#1A1A1A] flex items-center justify-center text-muted-foreground hover:bg-[#FF2D78] hover:text-white transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="pt-4 border-t border-border mt-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-white">
                  {formatPrice(getTotal())}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  asChild
                  className="w-full rounded-full text-[#0A0A0A] font-semibold h-12 btn-neon-3d border-0"
                  onClick={closeCart}
                >
                  <Link href="/checkout">
                    Proceder al pago
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  className="w-full rounded-full border-white/20 text-white hover:bg-white hover:text-[#0A0A0A] hover:border-white h-12 transition-all duration-200"
                  onClick={closeCart}
                  asChild
                >
                  <Link href="/catalogo">
                    Seguir comprando
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
