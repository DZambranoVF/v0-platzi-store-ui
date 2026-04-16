export interface Product {
  id: string
  name: string
  slug: string
  price: number
  category: string
  colors: string[]
  sizes?: string[]
  images: string[]
  description: string
  materials?: string
  care?: string
  isNew?: boolean
  isFeatured?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  selectedColor: string
  selectedSize?: string
}

export interface CheckoutData {
  // Step 1: Personal Data
  nombre: string
  email: string
  telefono: string
  // Step 2: Shipping Address
  departamento: string
  ciudad: string
  direccion: string
  complemento: string
  referencias: string
  // Step 3: Payment
  numeroTarjeta: string
  nombreTarjeta: string
  expiracion: string
  cvv: string
}

export type CheckoutStep = 1 | 2 | 3 | 4
