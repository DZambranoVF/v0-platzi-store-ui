export function ManifestoSection() {
  return (
    <section className="py-16 bg-[#111111] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#98CA3F]/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Manifesto Text */}
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-widest uppercase">
              NUNCA PARES
            </span>
            <span className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-6xl md:text-7xl font-bold tracking-widest uppercase" style={{ color: '#98CA3F', textShadow: '0 0 30px rgba(152,202,63,0.9), 0 0 60px rgba(152,202,63,0.5), 0 0 90px rgba(152,202,63,0.3)' }}>
              DE COMPRAR
            </span>
          </div>

          {/* Description */}
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Cada producto de Platzi Store representa tu compromiso con el aprendizaje continuo. 
            No es solo merch, es una declaración de quién eres y hacia dónde vas.
          </p>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 bg-[#0A0A0A] rounded-2xl border border-border">
            {[
              { value: '5M+', label: 'Estudiantes en Platzi' },
              { value: '1000+', label: 'Cursos disponibles' },
              { value: '20+', label: 'Países en LATAM' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
