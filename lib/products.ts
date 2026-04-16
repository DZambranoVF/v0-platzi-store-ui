import type { Product } from './types'

export const products: Product[] = [
  {
    id: '1',
    name: 'Camiseta Platzi',
    slug: 'camiseta-platzi',
    price: 89000,
    category: 'ropa',
    colors: ['Blanco', 'Negro', 'Verde', 'Negro Neon'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['/images/camiseta-blanca.jpg', '/images/camiseta-negra.jpg', '/images/camiseta-verde.jpg', '/images/camiseta-negra-2.jpg'],
    colorImages: {
      'Blanco': '/images/camiseta-blanca.jpg',
      'Negro': '/images/camiseta-negra.jpg',
      'Verde': '/images/camiseta-verde.jpg',
      'Negro Neon': '/images/camiseta-negra-2.jpg',
    },
    description: 'La camiseta oficial de Platzi. 100% algodón premium con diseño neon "Nunca pares de aprender". Perfecta para codear con estilo.',
    materials: '100% algodón peinado premium, 180g/m²',
    care: 'Lavar a máquina en frío. No usar secadora. Planchar a temperatura media.',
    isNew: true,
    isFeatured: true,
    stock: 42,
  },
  {
    id: '2',
    name: 'Hoodie Platzi',
    slug: 'hoodie-platzi',
    price: 189000,
    category: 'ropa',
    colors: ['Blanco', 'Negro', 'Verde'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      '/images/hoodie-blanca-frente.jpg',
      '/images/hoodie-blanca-espalda.jpg',
      '/images/hoodie-negra-frente.jpg',
      '/images/hoodie-negra-espalda.jpg',
      '/images/hoodie-verde-frente.jpg',
      '/images/hoodie-verde-espalda.jpg',
      '/images/hoodie-negro-freddy.jpg',
    ],
    colorImages: {
      'Blanco': '/images/hoodie-blanca-frente.jpg',
      'Negro': '/images/hoodie-negra-frente.jpg',
      'Verde': '/images/hoodie-verde-frente.jpg',
    },
    description: 'El hoodie oficial de Platzi con diseño neon premium. Interior fleece ultra suave con capucha ajustable. Perfecto para tus sesiones de código.',
    materials: '80% algodón, 20% poliéster. Interior fleece. Capucha ajustable con cordones.',
    care: 'Lavar a máquina en frío. Secar a baja temperatura. No usar blanqueador.',
    isNew: true,
    isFeatured: true,
    stock: 18,
  },
  {
    id: '3',
    name: 'Gorra Platzi',
    slug: 'gorra-platzi',
    price: 65000,
    category: 'accesorios',
    colors: ['Blanco', 'Negro', 'Verde'],
    images: [
      '/images/gorra-blanca-frente.jpg',
      '/images/gorra-blanca-lateral.jpg',
      '/images/gorra-negra-frente.jpg',
      '/images/gorra-negra-lateral.jpg',
      '/images/gorra-verde-frente.jpg',
      '/images/gorra-verde-lateral.jpg',
      '/images/gorra-verde-freddy.jpg',
    ],
    colorImages: {
      'Blanco': '/images/gorra-blanca-frente.jpg',
      'Negro': '/images/gorra-negra-frente.jpg',
      'Verde': '/images/gorra-verde-frente.jpg',
    },
    description: 'Gorra snapback con logo Platzi neon "Aprende sin parar". Diseño premium para cualquier dev.',
    materials: '100% algodón con visera estructurada',
    care: 'Limpiar con paño húmedo. No lavar a máquina.',
    isFeatured: true,
    stock: 55,
  },
  {
    id: '4',
    name: 'Sticker Pack Platzi',
    slug: 'sticker-pack-platzi',
    price: 25000,
    category: 'accesorios',
    colors: ['Multicolor'],
    images: ['/images/sticker-platzi.jpg', '/images/sticker-freddy.jpg'],
    description: 'Pack de 15 stickers holográficos para tu laptop. Incluye logos, frases tech y diseños exclusivos.',
    materials: 'Vinilo holográfico resistente al agua',
    care: 'Aplicar sobre superficie limpia y seca.',
    isNew: true,
    stock: 120,
  },
  {
    id: '5',
    name: 'Mug Platzi',
    slug: 'mug-platzi',
    price: 45000,
    category: 'accesorios',
    colors: ['Blanco', 'Negro', 'Verde'],
    images: ['/images/mug-blanco.jpg', '/images/mug-negro.jpg', '/images/mug-verde.jpg', '/images/mug-blanco-freddy.jpg'],
    colorImages: {
      'Blanco': '/images/mug-blanco.jpg',
      'Negro': '/images/mug-negro.jpg',
      'Verde': '/images/mug-verde.jpg',
    },
    description: 'Mug de cerámica de 350ml. Perfecto para tu café mientras debuggeas. Diseño minimalista con logo Platzi.',
    materials: 'Cerámica premium con acabado mate',
    care: 'Apto para microondas y lavavajillas.',
    isFeatured: true,
    stock: 67,
  },
  {
    id: '6',
    name: 'Termo Platzi',
    slug: 'termo-platzi',
    price: 85000,
    category: 'accesorios',
    colors: ['Negro', 'Blanco', 'Verde'],
    images: ['/images/termo-negro.jpg', '/images/termo-blanco.jpg', '/images/termo-verde.jpg', '/images/termo-blanco-freddy.jpg'],
    colorImages: {
      'Negro': '/images/termo-negro.jpg',
      'Blanco': '/images/termo-blanco.jpg',
      'Verde': '/images/termo-verde.jpg',
    },
    description: 'Termo de acero inoxidable de 500ml. Mantiene tu bebida caliente 12h o fría 24h. Diseño premium con logo Platzi.',
    materials: 'Acero inoxidable 18/8 doble pared',
    care: 'Lavar a mano. No apto para lavavajillas.',
    isNew: true,
    isFeatured: true,
    stock: 34,
  },
  {
    id: '7',
    name: 'Mochila Platzi',
    slug: 'mochila-platzi',
    price: 245000,
    category: 'accesorios',
    colors: ['Negro', 'Verde', 'Blanco'],
    images: ['/images/maleta-negra.jpg', '/images/maleta-verde.jpg', '/images/maleta-blanca.jpg', '/images/freddy-maleta.jpg'],
    colorImages: {
      'Negro': '/images/maleta-negra.jpg',
      'Verde': '/images/maleta-verde.jpg',
      'Blanco': '/images/maleta-blanca.jpg',
    },
    description: 'Mochila de 25L con compartimento acolchado para laptop hasta 15". Diseño premium con logo Platzi neon. Ergonómica y resistente al agua.',
    materials: 'Poliéster 600D resistente al agua con base reforzada. Forro interior 300D.',
    care: 'Limpiar con paño húmedo. No lavar a máquina.',
    isFeatured: true,
    isNew: true,
    stock: 12,
  },
  {
    id: '8',
    name: 'Calcetines Platzi',
    slug: 'calcetines-platzi',
    price: 35000,
    category: 'ropa',
    colors: ['Blanco', 'Negro', 'Verde'],
    sizes: ['S/M', 'L/XL'],
    images: ['/images/medias-blanco.jpg', '/images/medias-negro.jpg', '/images/medias-verde.jpg', '/images/medias-blanco-freddy.jpg'],
    colorImages: {
      'Blanco': '/images/medias-blanco.jpg',
      'Negro': '/images/medias-negro.jpg',
      'Verde': '/images/medias-verde.jpg',
    },
    description: 'Pack de 3 pares de calcetines con diseños únicos. Algodón premium con refuerzo en talón y puntera.',
    materials: '80% algodón, 15% poliamida, 5% elastano',
    care: 'Lavar a máquina en frío. No usar blanqueador.',
    stock: 88,
  },
  {
    id: '9',
    name: 'Pad Mouse Platzi',
    slug: 'pad-mouse-platzi',
    price: 95000,
    category: 'accesorios',
    colors: ['Negro', 'Blanco', 'Verde'],
    images: ['/images/padmouse-negro.jpg', '/images/padmouse-blanco.jpg', '/images/padmouse-verde.jpg'],
    colorImages: {
      'Negro': '/images/padmouse-negro.jpg',
      'Blanco': '/images/padmouse-blanco.jpg',
      'Verde': '/images/padmouse-verde.jpg',
    },
    description: 'Pad mouse gaming XL de 80x40cm con bordes iluminados LED. Base antideslizante y superficie optimizada para tracking preciso. Diseño premium con logo Platzi.',
    materials: 'Tela premium con base de goma natural, bordes cosidos',
    care: 'Limpiar con paño húmedo. Secar al aire.',
    isFeatured: true,
    isNew: true,
    stock: 29,
  },
  {
    id: '10',
    name: 'Agenda Platzi',
    slug: 'agenda-platzi',
    price: 75000,
    category: 'oficina',
    colors: ['Negro', 'Blanco', 'Verde'],
    images: ['/images/agenda-negra.jpg', '/images/agenda-blanca.jpg', '/images/agenda-verde.jpg', '/images/agenda-blanca-freddy.jpg', '/images/agenda-blanca-freddy-2.jpg'],
    colorImages: {
      'Negro': '/images/agenda-negra.jpg',
      'Blanco': '/images/agenda-blanca.jpg',
      'Verde': '/images/agenda-verde.jpg',
    },
    description: 'Agenda 2025 con diseño premium Platzi. 365 páginas para organizar tus proyectos y aprendizajes. Tapa dura y papel de calidad.',
    materials: 'Tapa dura con acabado mate, papel 80g/m²',
    care: 'Mantener en lugar seco.',
    isNew: true,
    isFeatured: true,
    stock: 45,
  },
]

export const categories = [
  { id: 'todos', name: 'Todos', slug: 'todos' },
  { id: 'ropa', name: 'Ropa', slug: 'ropa' },
  { id: 'accesorios', name: 'Accesorios', slug: 'accesorios' },
  { id: 'oficina', name: 'Oficina', slug: 'oficina' },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'todos') return products
  return products.filter(p => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.isFeatured)
}

export function getNewProducts(): Product[] {
  return products.filter(p => p.isNew)
}

export function getProductLandingUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_URL ?? 'https://v0-platzi-store-ui.vercel.app'
  return `${base}/catalogo/${slug}`
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
