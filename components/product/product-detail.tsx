'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, ShoppingBag, Zap, Truck, Shield } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/products'
import { useCartStore } from '@/lib/cart-store'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0])
  const [selectedImage, setSelectedImage] = useState(0)
  const { addItem, openCart } = useCartStore()

  const handleAddToCart = () => {
    addItem(product, selectedColor, selectedSize)
    openCart()
  }

  const handleBuyNow = () => {
    addItem(product, selectedColor, selectedSize)
    window.location.href = '/checkout'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gradient-to-br from-[#181818] to-[#0f0f0f] rounded-2xl overflow-hidden relative" style={{ boxShadow: '0 0 0 1px rgba(152,202,63,0.2), 0 0 30px rgba(152,202,63,0.12), 0 0 70px rgba(152,202,63,0.05)' }}>
            {product.images && product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingBag className="h-32 w-32 text-muted-foreground/20" />
              </div>
            )}
            {product.isNew && (
              <div className="absolute top-4 left-4 px-3 py-1.5 badge-neon-3d text-[#0A0A0A] text-sm font-semibold rounded-full z-10">
                Nuevo
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className="aspect-square bg-[#141414] rounded-lg overflow-hidden transition-all duration-200 relative"
                  style={i === selectedImage
                    ? { boxShadow: '0 0 0 1.5px rgba(152,202,63,0.6), 0 0 10px rgba(152,202,63,0.2)' }
                    : { boxShadow: '0 0 0 1px rgba(255,255,255,0.06)' }}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - Vista ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Category */}
          <span className="text-neon-green-soft text-sm font-semibold uppercase tracking-wider">
            {product.category}
          </span>

          {/* Name */}
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-white mt-2">
            {product.name}
          </h1>

          {/* Price */}
          <p className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-neon-green mt-4">
            {formatPrice(product.price)}
          </p>

          {/* Description */}
          <p className="text-muted-foreground mt-4 leading-relaxed">
            {product.description}
          </p>

          {/* Divider */}
          <div className="h-px bg-border my-6" />

          {/* Color Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">
              Color: <span className="text-muted-foreground">{selectedColor}</span>
            </label>
            <div className="flex items-center gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center',
                    selectedColor === color
                      ? 'border-[#98CA3F] scale-110'
                      : 'border-transparent hover:border-white/30'
                  )}
                  title={color}
                >
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full',
                      color === 'Negro' && 'bg-black border border-white/20',
                      color === 'Blanco' && 'bg-white',
                      color === 'Verde' && 'bg-[#98CA3F]',
                      color === 'Gris' && 'bg-gray-500',
                      color === 'Rosa' && 'bg-[#FF6B2C]',
                      color === 'Multicolor' && 'bg-gradient-to-r from-[#98CA3F] via-[#FF6B2C] to-purple-500'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          {product.sizes && (
            <div className="space-y-3 mt-6">
              <label className="text-sm font-medium text-white">
                Talla: <span className="text-muted-foreground">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'min-w-[48px] h-10 px-4 rounded-lg border text-sm font-medium transition-all',
                      selectedSize === size
                        ? 'bg-[#98CA3F] text-[#0A0A0A] border-[#98CA3F]'
                        : 'bg-transparent text-white border-border hover:border-white/30'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              onClick={handleAddToCart}
              className="flex-1 h-14 rounded-full text-[#0A0A0A] font-semibold text-base btn-neon-3d border-0"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Agregar al carrito
            </Button>
            <Button
              onClick={handleBuyNow}
              variant="outline"
              className="flex-1 h-14 rounded-full border-[#FF6B2C] text-[#FF6B2C] hover:bg-[#FF6B2C]/10 font-semibold text-base"
            >
              <Zap className="h-5 w-5 mr-2" />
              Comprar ahora
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 p-4 bg-[#111111] rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#98CA3F]/10 flex items-center justify-center">
                <Truck className="h-5 w-5 text-[#98CA3F]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Envío gratis</p>
                <p className="text-xs text-muted-foreground">A todo Colombia</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#98CA3F]/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-[#98CA3F]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Garantía</p>
                <p className="text-xs text-muted-foreground">30 días</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#98CA3F]/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-[#98CA3F]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Exclusivo</p>
                <p className="text-xs text-muted-foreground">Solo en Platzi</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="descripcion" className="mt-8">
            <TabsList className="w-full bg-[#111111] border border-border rounded-lg p-1">
              <TabsTrigger 
                value="descripcion" 
                className="flex-1 data-[state=active]:bg-[#98CA3F] data-[state=active]:text-[#0A0A0A] rounded-md"
              >
                Descripción
              </TabsTrigger>
              <TabsTrigger 
                value="materiales"
                className="flex-1 data-[state=active]:bg-[#98CA3F] data-[state=active]:text-[#0A0A0A] rounded-md"
              >
                Materiales
              </TabsTrigger>
              <TabsTrigger 
                value="cuidados"
                className="flex-1 data-[state=active]:bg-[#98CA3F] data-[state=active]:text-[#0A0A0A] rounded-md"
              >
                Cuidados
              </TabsTrigger>
              {product.sizes && (
                <TabsTrigger 
                  value="tallas"
                  className="flex-1 data-[state=active]:bg-[#98CA3F] data-[state=active]:text-[#0A0A0A] rounded-md"
                >
                  Tallas
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="descripcion" className="mt-4 text-muted-foreground leading-relaxed">
              {product.description}
            </TabsContent>
            <TabsContent value="materiales" className="mt-4 text-muted-foreground leading-relaxed">
              {product.materials || 'Información de materiales no disponible.'}
            </TabsContent>
            <TabsContent value="cuidados" className="mt-4 text-muted-foreground leading-relaxed">
              {product.care || 'Información de cuidados no disponible.'}
            </TabsContent>
            {product.sizes && (
              <TabsContent value="tallas" className="mt-4">
                <div className="bg-[#111111] rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 text-white font-medium">Talla</th>
                        <th className="text-left p-3 text-white font-medium">Pecho (cm)</th>
                        <th className="text-left p-3 text-white font-medium">Largo (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border"><td className="p-3">XS</td><td className="p-3">86-91</td><td className="p-3">66</td></tr>
                      <tr className="border-b border-border"><td className="p-3">S</td><td className="p-3">91-96</td><td className="p-3">69</td></tr>
                      <tr className="border-b border-border"><td className="p-3">M</td><td className="p-3">96-101</td><td className="p-3">72</td></tr>
                      <tr className="border-b border-border"><td className="p-3">L</td><td className="p-3">101-106</td><td className="p-3">74</td></tr>
                      <tr className="border-b border-border"><td className="p-3">XL</td><td className="p-3">106-111</td><td className="p-3">76</td></tr>
                      <tr><td className="p-3">XXL</td><td className="p-3">111-116</td><td className="p-3">78</td></tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
