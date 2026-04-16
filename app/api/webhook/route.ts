import { MercadoPagoConfig, Payment } from 'mercadopago'
import { NextRequest, NextResponse } from 'next/server'

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.type === 'payment') {
      const payment = new Payment(client)
      const paymentData = await payment.get({ id: body.data.id })

      if (paymentData.status === 'approved') {
        console.log('[webhook] Pago aprobado:', {
          id: paymentData.id,
          status: paymentData.status,
          amount: paymentData.transaction_amount,
          payer: paymentData.payer?.email,
        })
      } else {
        console.log('[webhook] Pago recibido con estado:', paymentData.status)
      }
    }
  } catch (err) {
    console.error('[webhook] Error procesando notificación:', err)
  }

  // Siempre retornar 200 — MP reintenta si recibe non-200
  return NextResponse.json({ ok: true }, { status: 200 })
}
