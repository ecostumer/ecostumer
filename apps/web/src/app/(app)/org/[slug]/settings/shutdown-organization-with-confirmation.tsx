'use client'

import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import StatusAlert from '@/components/alert-status'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useFormState } from '@/hooks/use-form-state'

import { shutdownOrganizationAction } from './action'

export function ShutdownOrganizationWithConfirmation() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const [{ message, success }, handleSubmit, isPending] = useFormState(
    shutdownOrganizationAction,

    () => {
      setTimeout(() => {
        router.push('/')
        toast.success('Organização deletada com sucesso!')
      }, 1000)
    },
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Encerrar Organização</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Você tem certeza absoluta?</DialogTitle>
          <DialogDescription>
            <StatusAlert
              message={message}
              success={success}
              failTitle="Falha ao deletar organização!"
              successTitle="Deletado!"
            />
            Esta ação não pode ser desfeita. Isso irá deletar permanentemente
            sua organização e remover todos os dados associados a ela.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <form onSubmit={handleSubmit}>
            <Button
              type="submit"
              variant="destructive"
              className="w-56"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : success ? (
                <CheckCircle className="mr-2 h-4 w-4" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              {isPending
                ? 'Encerrando...'
                : success
                  ? 'Encerramento concluído'
                  : 'Encerrar organização'}
            </Button>
          </form>{' '}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
