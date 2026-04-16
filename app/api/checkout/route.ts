import { MercadoPagoConfig, Preference } from 'mercadopago'
import { NextRequest, NextResponse } from 'next/server'

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })

export async function POST(req: NextRequest) {
  try {
    const { items, shippingData } = await req.json()

    const preference = new Preference(client)
    const result = await preference.create({
      body: {
        items: items.map((item: {
          id: string
          title: string
          quantity: number
          unit_price: number
          picture_url: string
        }) => ({
          id: item.id,
          title: item.title,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          picture_url: item.picture_url,
          currency_id: 'COP',
        })),
        payer: {
          name: shippingData.name,
          email: shippingData.email,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/gracias?status=approved`,
          failure: `${process.env.NEXT_PUBLIC_URL}/catalogo?status=failed`,
          pending: `${process.env.NEXT_PUBLIC_URL}/gracias?status=pending`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
        statement_descriptor: 'PLATZI STORE',
      },
    })

    return NextResponse.json({ preferenceId: result.id })
  } catch (err) {
    console.error('[checkout] Error creando preferencia:', err)
    return NextResponse.json({ error: 'Error creando preferencia de pago' }, { status: 500 })
  }
}
