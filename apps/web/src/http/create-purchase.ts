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
    description?: string
    clientId: string
    discount?: number
  }
  slug: string
}

type CreatePurchaseResponse = void

export async function createPurchase({
  purchase,
  slug,
}: CreatePurchaseRequest): Promise<CreatePurchaseResponse> {
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
        description: purchase.description || '',
        ...(purchase.discount !== undefined && { discount: purchase.discount }),
      },
    },
  )
}
