import { api } from './api-client'

interface GetClientsRequest {
  slug: string
  pageIndex?: number
  pageSize?: number
  titleFilter?: string
}

export interface GetClientsResponse {
  clients: {
    id: string
    name: string
    active: boolean | null
    email: string | null
    phoneNumber: string
    birthday: string | null
    street: string | null
    complement: string | null
    city: string | null
    state: string | null
    createdAt: string
    author: {
      id: string
      name: string | null
      email: string | null
      avatarUrl: string | null
    } | null
  }[]
  totalCount: number
  totalPages: number
}

export async function getClients({
  slug,
  pageIndex = 1,
  pageSize = 10,
  titleFilter = '',
}: GetClientsRequest): Promise<GetClientsResponse> {
  if (!slug) {
    throw new Error('Slug is required to fetch clients.')
  }

  const result = await api
    .get(`organizations/${slug}/clients`, {
      next: {
        tags: ['clients'],
      },
      searchParams: {
        pageIndex,
        pageSize,
        ...(titleFilter && { titleFilter }),
      },
    })
    .json<GetClientsResponse>()

  return result
}
