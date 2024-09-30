/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { z } from 'zod'

import { createPurchase } from '@/http/create-purchase'

const purchaseSchema = z.object({
  client: z.string().uuid({ message: 'Cliente inválido ou não selecionado.' }),
  date: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: 'Por favor, insira uma data válida.',
  }),
  discount: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val.replace(',', '.')) : 0))
    .refine((num) => num >= 0 && num <= 100, {
      message: 'Por favor, insira um desconto válido entre 0 e 100%.',
    }),
  paymentMethod: z
    .string()
    .min(3, { message: 'Por favor, insira uma forma de pagamento válida.' }),
  observations: z.string().optional(),
})

export async function createPurchaseAction(data: FormData) {
  // Extrair campos simples
  const formDataEntries = Object.fromEntries(data)
  const result = purchaseSchema.safeParse(formDataEntries)

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { client, date, discount, paymentMethod, observations } = result.data

  // Extrair produtos
  const products: any[] = []
  for (const [key, value] of data.entries()) {
    if (key.startsWith('products[')) {
      const match = key.match(/products\[(\d+)\]\[(\w+)\]/)
      if (match) {
        const index = parseInt(match[1], 10)
        const field = match[2]
        if (!products[index]) {
          products[index] = {}
        }
        products[index][field] = value
      }
    }
  }

  // Validar produtos
  const productSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    price: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number()),
    quantity: z.preprocess(
      (a) => parseInt(z.string().parse(a), 10),
      z.number(),
    ),
  })

  const productsResult = z.array(productSchema).safeParse(products)

  if (!productsResult.success) {
    return {
      success: false,
      message: null,
      errors: { products: ['Produtos inválidos ou não selecionados.'] },
    }
  }

  const validProducts = productsResult.data

  if (validProducts.length === 0) {
    return {
      success: false,
      message: null,
      errors: { products: ['Selecione pelo menos um produto.'] },
    }
  }

  try {
    const totalPrice = validProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    )

    // Aplicar o desconto
    const finalPrice = totalPrice - (totalPrice * discount) / 100

    await createPurchase({
      purchase: {
        description: observations || '',
        paymentMethod,
        products: validProducts.map((product) => ({
          id: product.id,
          quantity: product.quantity,
          name: product.name,
          price: product.price,
        })),
        purchaseDate: new Date(date),
        purchaseAmount: finalPrice,
        clientId: client,
      },
    })
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: 'Ocorreu um erro ao salvar a compra.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Compra salva com sucesso.',
    errors: null,
  }
}
