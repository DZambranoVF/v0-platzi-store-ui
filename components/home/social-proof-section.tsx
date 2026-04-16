import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Carlos Mendoza',
    role: 'Full Stack Developer',
    avatar: 'CM',
    content: 'El hoodie es increíblemente cómodo. Lo uso para codear todas las noches. La calidad es top tier.',
    rating: 5,
  },
  {
    id: 2,
    name: 'María García',
    role: 'UX Designer',
    avatar: 'MG',
    content: 'La mochila tiene espacio para todo mi setup. El diseño es minimalista y premium.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Andrés Silva',
    role: 'Data Engineer',
    avatar: 'AS',
    content: 'Los stickers holográficos son brutales. Mi laptop nunca se había visto tan bien.',
    rating: 5,
  },
]

export function SocialProofSection() {
  return (
    <section className="py-16 bg-[#111111]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[#98CA3F] text-sm font-semibold uppercase tracking-wider">
            La comunidad habla
          </span>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-white mt-2">
            Lo que dicen nuestros devs
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-6 bg-[#0A0A0A] rounded-2xl border border-border relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-[#98CA3F]/20" />

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#98CA3F] text-[#98CA3F]" />
                ))}
              </div>

              {/* Content */}
              <p className="text-white/80 leading-relaxed mb-6">
                {`"${testimonial.content}"`}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#98CA3F] flex items-center justify-center text-[#0A0A0A] font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#98CA3F]" />
            <span className="text-sm">Envío a todo Colombia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#98CA3F]" />
            <span className="text-sm">Pago seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#98CA3F]" />
            <span className="text-sm">Garantía de calidad</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#98CA3F]" />
            <span className="text-sm">Soporte 24/7</span>
          </div>
        </div>
      </div>
    </section>
  )
}
