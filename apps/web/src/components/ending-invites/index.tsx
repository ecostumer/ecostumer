'use client'

import { dayjs } from '@saas/dayjs'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, UserPlus2, X } from 'lucide-react'
import { useState } from 'react'

import { getPendingInvites } from '@/http/get-pending-invites'

import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { acceptInviteAction, rejectInviteAction } from './actions'

export function PendingInvites() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  const { data } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: getPendingInvites,
    enabled: isOpen,
  })

  async function handleAcceptInvite(inviteId: string) {
    await acceptInviteAction(inviteId)

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  async function handleRejectInvite(inviteId: string) {
    await rejectInviteAction(inviteId)

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <UserPlus2 className="size-4" />
          <span className="sr-only">Convites pendentes</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-2">
        <span className="block text-sm font-medium">
          Convites pendentes ({data?.invites.length ?? 0})
        </span>

        {data?.invites.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum convite encontrado.
          </p>
        )}

        {data?.invites.map((invite) => {
          return (
            <div key={invite.id} className="space-y-2">
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">
                  {invite.author?.name ?? 'Alguém'}
                </span>{' '}
                convidou você para entrar na{' '}
                <span className="font-medium text-foreground">
                  {invite.organization.name}
                </span>{' '}
                <span>{dayjs(invite.createdAt).fromNow()}</span>
              </p>

              <div className="flex gap-1">
                <Button
                  onClick={() => handleAcceptInvite(invite.id)}
                  size="xs"
                  variant="outline"
                >
                  <Check className="mr-1.5 size-3" />
                  Aceitar
                </Button>

                <Button
                  onClick={() => handleRejectInvite(invite.id)}
                  size="xs"
                  variant="ghost"
                  className="text-muted-foreground"
                >
                  <X className="mr-1.5 size-3" />
                  Rejeitar
                </Button>
              </div>
            </div>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
