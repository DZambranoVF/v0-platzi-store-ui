'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/contacto', label: 'Contacto' },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { openCart, getItemCount } = useCartStore()
  const itemCount = getItemCount()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md" style={{ borderBottom: '1px solid transparent', backgroundImage: 'linear-gradient(#0A0A0AE6, #0A0A0AE6), linear-gradient(90deg, transparent 0%, rgba(152,202,63,0.35) 30%, rgba(152,202,63,0.35) 70%, transparent 100%)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold tracking-tight text-white hover:text-[#98CA3F] transition-colors"
        >
          PLATZI<span className="text-[#98CA3F]">STORE</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-[#98CA3F]',
                pathname === link.href
                  ? 'text-[#98CA3F]'
                  : 'text-white/80'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:text-[#98CA3F] hover:bg-white/5"
            onClick={openCart}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#98CA3F] text-[#0A0A0A] text-xs font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
            <span className="sr-only">Carrito</span>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:text-[#98CA3F] hover:bg-white/5">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0A0A0A] border-l border-border w-[280px]">
              <div className="flex flex-col gap-6 mt-8">
                <Link 
                  href="/" 
                  className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold tracking-tight text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  PLATZI<span className="text-[#98CA3F]">STORE</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'text-lg font-medium transition-colors hover:text-[#98CA3F]',
                        pathname === link.href
                          ? 'text-[#98CA3F]'
                          : 'text-white/80'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
