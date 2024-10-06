import { OrganizationForm } from '@/app/(app)/create-organization/organization-form'
import { ability, getCurrentOrg } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getOrganization } from '@/http/get-organization'

import { Billing } from './billing'
import { ShutdownOrganizationWithConfirmation } from './shutdown-organization-with-confirmation'

export default async function Settings() {
  const currentOrg = getCurrentOrg()
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')
  const canShutdownOrganization = permissions?.can('delete', 'Organization')

  const { organization } = await getOrganization(currentOrg!)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <div className="space-y-4">
        {canUpdateOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Configurações da organização</CardTitle>
              <CardDescription>
                Atualize os detalhes da sua organização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationForm
                isUpdating
                initialData={{
                  name: organization.name,
                  domain: organization.domain,
                  shouldAttachUsersByDomain:
                    organization.shouldAttachUsersByDomain,
                }}
              />
            </CardContent>
          </Card>
        )}
        {canGetBilling && <Billing />}
        {canShutdownOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Encerrar organização</CardTitle>
              <CardDescription>
                Isso excluirá todos os dados da organização, incluindo todos os
                projetos. Esta ação não pode ser desfeita.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShutdownOrganizationWithConfirmation />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
