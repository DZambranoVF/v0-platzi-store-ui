import { Navbar } from '@/components/navbar'
import { CartDrawer } from '@/components/cart-drawer'
import { CheckoutFlow } from '@/components/checkout/checkout-flow'

export const metadata = {
  title: 'Checkout | Platzi Store',
  description: 'Completa tu compra en Platzi Store de forma segura.',
}

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen pt-16 bg-[#0A0A0A]">
        <CheckoutFlow />
      </main>
    </>
  )
}
