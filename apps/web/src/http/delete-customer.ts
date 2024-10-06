import { api } from './api-client'

interface DeleteCustomerRequest {
  clientId: string
  slug: string
}

type DeleteCustomerResponse = void

export async function deleteCustomer({
  clientId,
  slug,
}: DeleteCustomerRequest): Promise<DeleteCustomerResponse> {
  if (!slug) {
    throw new Error('Organização não encontrada no cookie.')
  }
  await api.delete(`organizations/${slug}/clients/${clientId}`)
}
