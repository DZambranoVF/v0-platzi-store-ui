import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedProducts } from '@/components/home/featured-products'
import { ManifestoSection } from '@/components/home/manifesto-section'
import { CategoriesSection } from '@/components/home/categories-section'
import { SocialProofSection } from '@/components/home/social-proof-section'
import { NewsletterSection } from '@/components/home/newsletter-section'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen">
        <HeroSection />
        <FeaturedProducts />
        <ManifestoSection />
        <CategoriesSection />
        <SocialProofSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
