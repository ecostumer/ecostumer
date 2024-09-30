import { getCurrentSlug } from '@/utils/get-slug'

import { api } from './api-client'

interface CreatePurchaseRequest {
  purchase: {
    products: {
      id: string
      quantity: number
    }[]
    paymentMethod: string
    purchaseAmount: number
    purchaseDate: Date
    description?: string // Tornar opcional
    clientId: string
    discount?: number // Incluir se necessário
  }
}

type CreatePurchaseResponse = void

export async function createPurchase({
  purchase,
}: CreatePurchaseRequest): Promise<CreatePurchaseResponse> {
  const slug = getCurrentSlug()

  if (!slug) {
    throw new Error('Organização não encontrada no cookie.')
  }

  // Formatar a data como ISO string
  const formattedPurchaseDate = purchase.purchaseDate.toISOString()

  await api.post(
    `organizations/${slug}/clients/${purchase.clientId}/purchases`,
    {
      json: {
        products: purchase.products.map((product) => ({
          id: product.id,
          quantity: product.quantity,
        })),
        paymentMethod: purchase.paymentMethod,
        purchaseAmount: purchase.purchaseAmount,
        purchaseDate: formattedPurchaseDate,
        description: purchase.description || '', // Usar string vazia se undefined
        ...(purchase.discount !== undefined && { discount: purchase.discount }), // Incluir desconto se disponível
        // Remover clientId do corpo da requisição
      },
    },
  )
}
