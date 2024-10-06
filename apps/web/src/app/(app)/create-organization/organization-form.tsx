'use client'

import StatusAlert from '@/components/alert-status'
import { SubmitButton } from '@/components/submit-button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import {
  createOrganizationAction,
  type OrganizationSchema,
  updateOrganizationAction,
} from './actions'

interface OrganizationFormProps {
  isUpdating?: boolean
  initialData?: OrganizationSchema
}

export function OrganizationForm({
  isUpdating = false,
  initialData,
}: OrganizationFormProps) {
  const formAction = isUpdating
    ? updateOrganizationAction
    : createOrganizationAction

  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState(formAction)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StatusAlert
        message={message}
        success={success}
        failTitle="Falha ao Salvar organização!"
        successTitle="Salvo!"
      />

      <div className="space-y-1">
        <Label htmlFor="name">Nome da organização</Label>
        <Input name="name" id="name" defaultValue={initialData?.name} />

        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="domain">E-mail domain</Label>
        <Input
          defaultValue={initialData?.domain ?? undefined}
          name="domain"
          type="text"
          id="domain"
          inputMode="url"
          placeholder="example.com"
        />

        {errors?.domain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.domain[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-start space-x-2">
          <div className="translate-y-0.5">
            <Checkbox
              name="shouldAttachUsersByDomain"
              id="shouldAttachUsersByDomain"
              defaultChecked={initialData?.shouldAttachUsersByDomain}
            />
          </div>

          <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
            <span className="text-sm font-medium leading-none">
              Adicionar novos membros automaticamente
            </span>
            <p className="text-sm text-muted-foreground">
              Isso irá convidar automaticamente todos os membros com o mesmo
              domínio de e-mail para esta organização.
            </p>
          </label>
        </div>

        {errors?.shouldAttachUsersByDomain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.shouldAttachUsersByDomain[0]}
          </p>
        )}
      </div>

      <SubmitButton isSubmitting={isPending} isSubmitSuccessful={success}>
        Salvar
      </SubmitButton>
    </form>
  )
}
