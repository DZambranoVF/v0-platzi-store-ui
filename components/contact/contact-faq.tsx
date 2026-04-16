'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: '¿Cuánto tiempo tarda el envío?',
    answer: 'Los envíos a las principales ciudades de Colombia tardan entre 3-5 días hábiles. Para ciudades intermedias o zonas rurales, el tiempo puede extenderse hasta 7-10 días hábiles.',
  },
  {
    question: '¿El envío es gratis?',
    answer: 'Sí, todos los envíos dentro de Colombia son completamente gratis, sin importar el monto de tu compra ni tu ubicación.',
  },
  {
    question: '¿Puedo hacer devoluciones?',
    answer: 'Claro que sí. Tienes 30 días desde la recepción de tu pedido para solicitar una devolución. El producto debe estar en su empaque original y sin usar. Contáctanos por email y te guiaremos en el proceso.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de crédito y débito Visa, Mastercard y American Express. Todos los pagos son procesados de forma segura con encriptación SSL.',
  },
  {
    question: '¿Los productos son originales?',
    answer: 'Absolutamente. Todos nuestros productos son diseñados y producidos exclusivamente por Platzi. Son 100% originales y de la más alta calidad.',
  },
  {
    question: '¿Tienen tienda física?',
    answer: 'Por el momento solo operamos online. Sin embargo, puedes encontrarnos en eventos de Platzi y conferencias tech donde a veces llevamos nuestros productos.',
  },
  {
    question: '¿Cómo puedo rastrear mi pedido?',
    answer: 'Una vez que tu pedido sea despachado, recibirás un email con el número de guía y un enlace para rastrear tu envío en tiempo real.',
  },
  {
    question: '¿Tienen tallas grandes?',
    answer: 'Sí, manejamos tallas desde XS hasta XXL en la mayoría de nuestras prendas. Revisa la guía de tallas en cada producto para encontrar tu talla ideal.',
  },
]

export function ContactFAQ() {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="bg-[#0A0A0A] border border-border rounded-xl px-6 data-[state=open]:border-[#98CA3F]/30"
        >
          <AccordionTrigger className="text-left text-white hover:text-[#98CA3F] hover:no-underline py-4 font-medium">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
