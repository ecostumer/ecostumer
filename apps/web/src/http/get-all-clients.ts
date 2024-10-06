import { api } from './api-client'

interface GetAllClientsRequest {
  slug: string
  pageIndex?: number
  pageSize?: number
  titleFilter?: string
}

interface GetAllClientsResponse {
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
}

export async function getAllClients({
  slug,
}: GetAllClientsRequest): Promise<GetAllClientsResponse> {
  if (!slug) {
    throw new Error('Slug is required to fetch clients.')
  }

  const result = await api
    .get(`organizations/${slug}/allClients`, {
      next: {
        tags: ['clients'],
      },
    })
    .json<GetAllClientsResponse>()

  return result
}
