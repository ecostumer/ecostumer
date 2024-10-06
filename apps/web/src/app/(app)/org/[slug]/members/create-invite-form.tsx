'use client'

import { toast } from 'sonner'

import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFormState } from '@/hooks/use-form-state'

import { createInviteAction } from './actions'

export function CreateInviteForm() {
  const [{ errors, success }, handleSubmit, isPending] = useFormState(
    createInviteAction,
    () => {
      if (success) {
        toast.success('Convite enviado com sucesso!')
      }
    },
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <Input
            name="email"
            id="email"
            type="email"
            placeholder="joao@exemplo.com"
          />
          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>
        <Select name="role" defaultValue="MEMBER">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MEMBER">Membro</SelectItem>
            <SelectItem value="BILLING">Faturamento</SelectItem>
          </SelectContent>
        </Select>
        <SubmitButton
          isSubmitting={isPending}
          isSubmitSuccessful={success}
          className="w-32"
        >
          Convidar usuário
        </SubmitButton>
      </div>
    </form>
  )
}
