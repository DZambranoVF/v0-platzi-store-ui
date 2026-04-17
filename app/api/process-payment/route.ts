import { MercadoPagoConfig, Payment } from 'mercadopago'
import { NextRequest, NextResponse } from 'next/server'

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })

export async function POST(req: NextRequest) {
  try {
    const { selectedPaymentMethod, formData } = await req.json()

    const payment = new Payment(client)
    const result = await payment.create({
      body: {
        ...formData,
        payment_method_id: selectedPaymentMethod?.id ?? formData?.payment_method_id,
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
      },
    })

    console.log('[process-payment] Pago creado:', {
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
    })

    if (result.status === 'approved' || result.status === 'in_process') {
      return NextResponse.json({ status: result.status, id: result.id })
    }

    return NextResponse.json(
      { error: 'Pago rechazado', status: result.status, detail: result.status_detail },
      { status: 422 }
    )
  } catch (err) {
    console.error('[process-payment] Error:', err)
    return NextResponse.json({ error: 'Error procesando el pago' }, { status: 500 })
  }
}
