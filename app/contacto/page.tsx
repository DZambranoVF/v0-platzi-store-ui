import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'
import { ContactForm } from '@/components/contact/contact-form'
import { ContactInfo } from '@/components/contact/contact-info'
import { ContactFAQ } from '@/components/contact/contact-faq'

export const metadata = {
  title: 'Contacto | Platzi Store',
  description: 'Contáctanos para cualquier duda sobre tu pedido o nuestros productos. Estamos aquí para ayudarte.',
}

export default function ContactoPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen pt-16 bg-[#0A0A0A]">
        {/* Hero Section */}
        <section className="border-b border-border">
          <div className="container mx-auto px-4 py-12">
            <span className="text-[#98CA3F] text-sm font-semibold uppercase tracking-wider">
              Estamos para ti
            </span>
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold text-white mt-2">
              Contacto
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl">
              ¿Tienes alguna pregunta? Nuestro equipo está listo para ayudarte con lo que necesites.
            </p>
          </div>
        </section>

        {/* Split Layout */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Left - Info & Branding */}
              <div className="order-2 lg:order-1">
                <ContactInfo />
              </div>

              {/* Right - Form */}
              <div className="order-1 lg:order-2">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-[#111111]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#98CA3F] text-sm font-semibold uppercase tracking-wider">
                  Preguntas frecuentes
                </span>
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-white mt-2">
                  FAQ
                </h2>
              </div>
              <ContactFAQ />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
