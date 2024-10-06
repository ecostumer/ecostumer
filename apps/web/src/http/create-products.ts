import { api } from './api-client'

interface CreateProductsRequest {
  product: {
    description: string | null
    name: string
    price: number
  }
  slug: string
}

type CreateProductsResponse = void

export async function createProducts({
  product,
  slug,
}: CreateProductsRequest): Promise<CreateProductsResponse> {
  const { name, description, price } = product

  await api.post(`organizations/${slug}/products`, {
    json: {
      description,
      name,
      price,
    },
  })
}
