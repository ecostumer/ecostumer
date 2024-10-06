'use server'

import { HTTPError } from 'ky'

import { getCurrentOrg } from '@/auth/auth'
import { shutdownOrganization } from '@/http/shutdown-organization'

export async function shutdownOrganizationAction() {
  try {
    const currentOrg = getCurrentOrg()
    await shutdownOrganization({ org: currentOrg! })

    // revalidateTag('organizations')
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
    message: 'Organização salva com sucesso.',
    errors: null,
  }
}
