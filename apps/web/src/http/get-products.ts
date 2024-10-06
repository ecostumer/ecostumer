import { api } from './api-client'

interface GetProductsRequest {
  slug: string | null
  searchTerm?: string
  pageSize?: number
  pageIndex?: number
}

export interface GetProductsResponse {
  products: {
    description: string | null
    name: string
    price: number
    id: string
    status: boolean
  }[]
  totalCount: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export async function getProducts({
  slug,
  pageIndex = 0,
  pageSize = 10,
  searchTerm = '',
}: GetProductsRequest) {
  if (!slug) {
    throw new Error('Slug is required to fetch products.')
  }

  const result = await api
    .get(`organizations/${slug}/products`, {
      next: { tags: ['products'] },
      searchParams: {
        pageIndex,
        pageSize,
        searchTerm,
      },
    })
    .json<GetProductsResponse>()

  return result
}
