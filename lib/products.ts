import type { Product } from './types'

export const products: Product[] = [
  {
    id: '1',
    name: 'Camiseta Platzi',
    slug: 'camiseta-platzi',
    price: 89000,
    category: 'ropa',
    colors: ['Blanco', 'Negro', 'Verde'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['/images/camiseta-blanca.jpg', '/images/camiseta-negra.jpg', '/images/camiseta-verde.jpg'],
    colorImages: {
      'Blanco': '/images/camiseta-blanca.jpg',
      'Negro': '/images/camiseta-negra.jpg',
      'Verde': '/images/camiseta-verde.jpg',
    },
    description: 'La camiseta oficial de Platzi. 100% algodón premium con diseño neon "Nunca pares de aprender". Perfecta para codear con estilo.',
    materials: '100% algodón peinado premium, 180g/m²',
    care: 'Lavar a máquina en frío. No usar secadora. Planchar a temperatura media.',
    isNew: true,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Hoodie Platzi',
    slug: 'hoodie-platzi',
    price: 189000,
    category: 'ropa',
    colors: ['Negro', 'Gris'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['/products/hoodie-1.jpg', '/products/hoodie-2.jpg'],
    description: 'El hoodie más cómodo para tus sesiones de código nocturnas. Interior fleece ultra suave con capucha ajustable.',
    materials: '80% algodón, 20% poliéster. Interior fleece.',
    care: 'Lavar a máquina en frío. Secar a baja temperatura.',
    isNew: true,
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Gorra Platzi',
    slug: 'gorra-platzi',
    price: 65000,
    category: 'accesorios',
    colors: ['Negro', 'Verde'],
    images: ['/images/gorra-verde.jpg', '/images/gorra-freddy.jpg'],
    description: 'Gorra snapback con logo Platzi bordado en 3D. Ajuste perfecto para cualquier dev.',
    materials: '100% algodón con visera estructurada',
    care: 'Limpiar con paño húmedo. No lavar a máquina.',
    isFeatured: true,
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
  },
  {
    id: '5',
    name: 'Mug Platzi',
    slug: 'mug-platzi',
    price: 45000,
    category: 'accesorios',
    colors: ['Verde', 'Negro', 'Blanco'],
    images: ['/images/mug-verde.jpg', '/images/mug-negro.jpg', '/images/mug-blanco.jpg'],
    colorImages: {
      'Verde': '/images/mug-verde.jpg',
      'Negro': '/images/mug-negro.jpg',
      'Blanco': '/images/mug-blanco.jpg',
    },
    description: 'Mug de cerámica de 350ml. Perfecto para tu café mientras debuggeas. Diseño minimalista con logo Platzi.',
    materials: 'Cerámica premium con acabado mate',
    care: 'Apto para microondas y lavavajillas.',
    isFeatured: true,
  },
  {
    id: '6',
    name: 'Termo Platzi',
    slug: 'termo-platzi',
    price: 85000,
    category: 'accesorios',
    colors: ['Negro', 'Blanco', 'Verde'],
    images: ['/images/termo-negro.jpg', '/images/termo-blanco.jpg', '/images/termo-verde.jpg'],
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
  },
  {
    id: '8',
    name: 'Calcetines Platzi',
    slug: 'calcetines-platzi',
    price: 35000,
    category: 'ropa',
    colors: ['Negro', 'Verde', 'Blanco'],
    sizes: ['S/M', 'L/XL'],
    images: ['/images/medias-negro.jpg', '/images/medias-verde.jpg', '/images/medias-blanco.jpg'],
    description: 'Pack de 3 pares de calcetines con diseños únicos. Algodón premium con refuerzo en talón y puntera.',
    materials: '80% algodón, 15% poliamida, 5% elastano',
    care: 'Lavar a máquina en frío. No usar blanqueador.',
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
  },
  {
    id: '10',
    name: 'Agenda Platzi',
    slug: 'agenda-platzi',
    price: 75000,
    category: 'oficina',
    colors: ['Negro', 'Blanco', 'Verde'],
    images: ['/images/agenda-negra.jpg', '/images/agenda-blanca.jpg', '/images/agenda-verde.jpg'],
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

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
