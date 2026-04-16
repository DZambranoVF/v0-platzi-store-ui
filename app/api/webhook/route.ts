import { MercadoPagoConfig, Payment } from 'mercadopago'
import { NextRequest, NextResponse } from 'next/server'

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })

const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/74vg3cqy7kvmicdhk364f1iqw2tijipa'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Log para debug - ver que tipo de notificacion llega
    console.log('[webhook] Notificacion recibida:', JSON.stringify(body, null, 2))

    if (body.type === 'payment') {
      const payment = new Payment(client)
      const paymentData = await payment.get({ id: body.data.id })

      console.log('[webhook] Pago recibido:', {
        id: paymentData.id,
        status: paymentData.status,
        amount: paymentData.transaction_amount,
        payer: paymentData.payer?.email,
      })

      // Reenviar a Make con todos los detalles del pago
      const makePayload = {
        payment_id: paymentData.id,
        status: paymentData.status,
        status_detail: paymentData.status_detail,
        amount: paymentData.transaction_amount,
        currency: paymentData.currency_id,
        payer_email: paymentData.payer?.email,
        payer_name: `${paymentData.payer?.first_name ?? ''} ${paymentData.payer?.last_name ?? ''}`.trim(),
        items: paymentData.additional_info?.items ?? [],
        created_at: paymentData.date_created,
        approved_at: paymentData.date_approved,
        payment_method: paymentData.payment_method_id,
        payment_type: paymentData.payment_type_id,
        installments: paymentData.installments,
      }

      try {
        const makeResponse = await fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(makePayload),
        })
        console.log('[webhook] Reenviado a Make - Status:', makeResponse.status, 'OK:', makeResponse.ok)
        
        if (!makeResponse.ok) {
          const errorText = await makeResponse.text()
          console.error('[webhook] Make respondio con error:', errorText)
        }
      } catch (makeErr) {
        console.error('[webhook] Error reenviando a Make:', makeErr)
      }
    } else {
      console.log('[webhook] Tipo de notificacion no manejado:', body.type, '- action:', body.action)
    }
  } catch (err) {
    console.error('[webhook] Error procesando notificación:', err)
  }

  // Siempre retornar 200 — MP reintenta si recibe non-200
  return NextResponse.json({ ok: true }, { status: 200 })
}
