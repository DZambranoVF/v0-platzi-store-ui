import { Mail, Clock, MapPin, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react'

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    content: 'soporte@platzistore.com',
    description: 'Respuesta en menos de 24h',
  },
  {
    icon: Clock,
    title: 'Horario de atención',
    content: 'Lunes a Viernes',
    description: '9:00 AM - 6:00 PM (COT)',
  },
  {
    icon: MapPin,
    title: 'Ubicación',
    content: 'Bogotá, Colombia',
    description: 'Envíos a todo el país',
  },
]

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/platzi', label: 'Instagram', color: '#E4405F' },
  { icon: Twitter, href: 'https://twitter.com/platzi', label: 'Twitter', color: '#1DA1F2' },
  { icon: Youtube, href: 'https://youtube.com/platzi', label: 'YouTube', color: '#FF0000' },
  { icon: Linkedin, href: 'https://linkedin.com/company/platzi', label: 'LinkedIn', color: '#0A66C2' },
]

export function ContactInfo() {
  return (
    <div className="space-y-8">
      {/* Branding */}
      <div>
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-white mb-4">
          PLATZI<span className="text-[#98CA3F]">STORE</span>
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Somos la tienda oficial de Platzi, la plataforma de educación online más grande de Latinoamérica. 
          Creamos productos exclusivos para nuestra comunidad de más de 5 millones de estudiantes.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="space-y-4">
        {contactInfo.map((info) => (
          <div
            key={info.title}
            className="flex items-start gap-4 p-4 bg-[#111111] rounded-xl border border-border"
          >
            <div className="w-12 h-12 rounded-lg bg-[#98CA3F]/10 flex items-center justify-center flex-shrink-0">
              <info.icon className="h-6 w-6 text-[#98CA3F]" />
            </div>
            <div>
              <h3 className="font-medium text-white">{info.title}</h3>
              <p className="text-sm text-[#98CA3F]">{info.content}</p>
              <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Social Links */}
      <div>
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-white uppercase tracking-wider mb-4">
          Síguenos
        </h3>
        <div className="flex items-center gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-lg bg-[#111111] border border-border flex items-center justify-center text-muted-foreground hover:text-white hover:border-white/20 transition-all group"
            >
              <social.icon 
                className="h-5 w-5 transition-colors group-hover:text-[#98CA3F]" 
              />
              <span className="sr-only">{social.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Manifesto */}
      <div className="p-6 bg-gradient-to-br from-[#98CA3F]/10 to-[#FF2D78]/10 rounded-2xl border border-[#98CA3F]/20">
        <p className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold tracking-widest uppercase mb-2">
          <span className="text-white">NUNCA PARES </span>
          <span className="text-[#98CA3F]" style={{ textShadow: '0 0 12px rgba(152,202,63,0.7)' }}>DE COMPRAR</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Cada producto que creamos representa el espíritu de nuestra comunidad: 
          la pasión por aprender y construir el futuro.
        </p>
      </div>
    </div>
  )
}
