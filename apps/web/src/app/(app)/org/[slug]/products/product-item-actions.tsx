'use client'

import { Pencil2Icon } from '@radix-ui/react-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, MoreHorizontal, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteProducts } from '@/http/delete-produtcs'

interface ProductItemActionsProps {
  productId: string
}

export function ProductItemActions({ productId }: ProductItemActionsProps) {
  const { slug } = useParams<{ slug: string }>()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutate: handleDeleteProduct, isPending: isDeletingProduct } =
    useMutation({
      mutationFn: () => deleteProducts({ productId }),
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
        toast.success('Produto deletado com sucesso.')
        queryClient.invalidateQueries({
          queryKey: [slug, 'products'],
        })
      },
      onError: () => {
        toast.error('Algo deu errado ao tentar deletar o produto.', {
          description:
            'Ocorreu um erro ao tentar deletar o produto. Se o erro persistir, entre em contato com o administrador.',
        })
      },
    })

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="xs"
            className="data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="size-3" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem asChild>
            <Link href={`/products/${productId}`} prefetch={false}>
              <Pencil2Icon className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-500 data-[highlighted]:text-red-500 dark:text-red-400 dark:data-[highlighted]:text-red-400"
              disabled={isDeletingProduct}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Deletar
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Esta ação não pode ser desfeita e o produto será permanentemente
              excluído do sistema.
            </p>
            <p>
              Isso irá
              <span className="font-semibold text-accent-foreground">
                {' '}
                permanentemente
              </span>
              :
            </p>
            <ol className="list-disc space-y-2 pl-4">
              <li>
                Excluir os arquivos relacionados ao produto do armazenamento;
              </li>
            </ol>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            disabled={isDeletingProduct}
            variant="destructive"
            className="w-20"
            onClick={() => handleDeleteProduct()}
          >
            {isDeletingProduct ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Deletar'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
