import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const ASUNTOS: Record<string, string> = {
  pedido: 'Sobre mi pedido',
  producto: 'Información de producto',
  devolucion: 'Devoluciones',
  otro: 'Otro',
}

export async function POST(req: NextRequest) {
  const { nombre, email, asunto, mensaje } = await req.json()

  if (!nombre || !email || !asunto || !mensaje) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const asuntoLabel = ASUNTOS[asunto] ?? asunto

  const { error } = await resend.emails.send({
    from: 'Platzi Store <onboarding@resend.dev>',
    to: process.env.CONTACT_EMAIL ?? 'ddzs2014@gmail.com',
    replyTo: email,
    subject: `[Platzi Store] ${asuntoLabel} — ${nombre}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #e0e0e0; padding: 32px; border-radius: 12px;">
        <h2 style="color: #98CA3F; margin-top: 0;">Nuevo mensaje de contacto</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #888; width: 100px;">Nombre</td>
            <td style="padding: 8px 0; color: #fff; font-weight: 600;">${nombre}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #98CA3F;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888;">Asunto</td>
            <td style="padding: 8px 0; color: #fff;">${asuntoLabel}</td>
          </tr>
        </table>
        <hr style="border-color: #222; margin: 20px 0;" />
        <p style="color: #888; margin-bottom: 8px;">Mensaje:</p>
        <p style="background: #111; border-left: 3px solid #98CA3F; padding: 16px; border-radius: 4px; white-space: pre-wrap; margin: 0;">${mensaje}</p>
        <p style="color: #444; font-size: 12px; margin-top: 24px;">Puedes responder directamente a este email — irá a ${email}</p>
      </div>
    `,
  })

  if (error) {
    console.error('[contact] Resend error:', error)
    return NextResponse.json({ error: 'Error al enviar el mensaje' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
