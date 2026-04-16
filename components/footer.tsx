import Link from 'next/link'
import { Instagram, Twitter, Youtube, Linkedin } from 'lucide-react'

const footerLinks = {
  tienda: [
    { label: 'Catálogo', href: '/catalogo' },
    { label: 'Novedades', href: '/catalogo?filter=nuevo' },
    { label: 'Más vendidos', href: '/catalogo?sort=popular' },
  ],
  soporte: [
    { label: 'Contacto', href: '/contacto' },
    { label: 'Envíos', href: '/contacto#faq' },
    { label: 'Devoluciones', href: '/contacto#faq' },
  ],
  platzi: [
    { label: 'Platzi.com', href: 'https://platzi.com', external: true },
    { label: 'Cursos', href: 'https://platzi.com/cursos', external: true },
    { label: 'Blog', href: 'https://platzi.com/blog', external: true },
  ],
}

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/platzi', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com/platzi', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/platzi', label: 'YouTube' },
  { icon: Linkedin, href: 'https://linkedin.com/company/platzi', label: 'LinkedIn' },
]

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link 
              href="/" 
              className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold tracking-tight"
            >
              <span className="text-white">PLATZI</span><span className="text-neon-green">STORE</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              La tienda oficial de Platzi. Viste el conocimiento y muestra tu orgullo tech.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#98CA3F] transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Tienda
            </h3>
            <ul className="space-y-3">
              {footerLinks.tienda.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-[#98CA3F] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Soporte
            </h3>
            <ul className="space-y-3">
              {footerLinks.soporte.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-[#98CA3F] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platzi
            </h3>
            <ul className="space-y-3">
              {footerLinks.platzi.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-[#98CA3F] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Platzi Store. Todos los derechos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Hecho con <span className="text-[#FF6B2C]">&hearts;</span> en LATAM
          </p>
        </div>
      </div>
    </footer>
  )
}
