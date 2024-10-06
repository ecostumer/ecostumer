'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createProducts } from '@/http/create-products'

const productSchema = z.object({
  name: z.string().min(1, { message: 'Por favor, forneça um nome válido.' }),
  description: z
    .string()
    .min(1, { message: 'Por favor, forneça uma descrição válida.' }),
  price: z.coerce
    .number()
    .positive({ message: 'O preço deve ser um valor positivo.' }),
})

export async function createProductAction(data: FormData) {
  const result = productSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { name, price, description } = result.data

  try {
    await createProducts({
      slug: getCurrentOrg()!,
      product: {
        name,
        price,
        description,
      },
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    console.error(err)

    return {
      success: false,
      message: 'Erro inesperado, tente novamente em alguns minutos.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Produto salvo com sucesso.',
    errors: null,
  }
}
