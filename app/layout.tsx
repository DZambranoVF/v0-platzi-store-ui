import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SalesAssistantBubble } from '@/components/sales-assistant/SalesAssistantBubble'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Platzi Store | Viste el conocimiento',
  description: 'Tienda oficial de Platzi. Productos exclusivos para la comunidad tech más grande de Latinoamérica. Aprende. Construye. Úsalo.',
  keywords: ['Platzi', 'tienda', 'merch', 'programación', 'tecnología', 'educación'],
  authors: [{ name: 'Platzi' }],
  openGraph: {
    title: 'Platzi Store | Viste el conocimiento',
    description: 'Tienda oficial de Platzi. Productos exclusivos para la comunidad tech.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <SalesAssistantBubble />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
