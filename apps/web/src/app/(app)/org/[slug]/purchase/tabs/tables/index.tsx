'use client'

import { useQuery } from '@tanstack/react-query'
import { EyeIcon, Loader2, PencilIcon, TrashIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { parseAsString, useQueryStates } from 'nuqs'
import { Suspense, useState } from 'react'

import InvoicePDF from '@/components/invoice-pdf'
import NonFiscalReceiptPDF from '@/components/non-fiscal-receipt-pdf'
import {
  AlertDialog,
  AlertDialogAction,
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getPurchases } from '@/http/get-purchases'
import { formatCurrency } from '@/utils/format-currency'

import { TablesPagination } from './tables-pagination'

export interface PurchasesProps {
  videoId: string
}

interface Purchase {
  id: string
  clientName: string
  purchaseAmount: number
  paymentMethod: string
  purchaseDate: string
  description: string | null
  products: { id: string; name: string; price: number; quantity: number }[]
}

export default function Purchases() {
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null,
  )
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const [params] = useQueryStates({
    pageIndex: parseAsString.withDefault('0'),
    pageSize: parseAsString.withDefault('10'),
    titleFilter: parseAsString.withDefault(''),
  })

  const pageIndex = Number(params.pageIndex)
  const pageSize = Number(params.pageSize)

  const { data: purchasesResponse, isLoading } = useQuery({
    queryKey: ['purchases', slug, pageIndex, pageSize],
    queryFn: () => getPurchases({ slug, page: pageIndex + 1, pageSize }),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  })

  const purchases: Purchase[] = Array.isArray(purchasesResponse?.purchases)
    ? purchasesResponse.purchases
    : []

  const pageCount = purchasesResponse?.totalPages || 1

  const handleEdit = (purchaseId: string) => {
    router.push(`/purchases/${purchaseId}/edit`)
  }

  const handleDelete = (purchaseId: string) => {
    console.log(`Deleting purchase ${purchaseId}`)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Compras</CardTitle>
          <CardDescription>
            Lista de todas as compras realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Cliente</TableHead>
                <TableHead>Valor da Compra</TableHead>
                <TableHead>Método de Pagamento</TableHead>
                <TableHead>Data da Compra</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : purchases.length > 0 ? (
                purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.clientName}</TableCell>
                    <TableCell>
                      {formatCurrency(purchase.purchaseAmount)}
                    </TableCell>
                    <TableCell className="capitalize">
                      {purchase.paymentMethod}
                    </TableCell>
                    <TableCell>
                      {new Date(purchase.purchaseDate).toLocaleDateString(
                        'pt-BR',
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPurchase(purchase)}
                            >
                              <EyeIcon className="mr-2 h-4 w-4" />
                              Ver
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Compra</DialogTitle>
                            </DialogHeader>
                            {selectedPurchase && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="font-bold">Cliente</Label>
                                    <p>{selectedPurchase.clientName}</p>
                                  </div>
                                  <div>
                                    <Label className="font-bold">Data</Label>
                                    <p>
                                      {new Date(
                                        selectedPurchase.purchaseDate,
                                      ).toLocaleString('pt-BR')}
                                    </p>
                                  </div>
                                </div>
                                <Separator />
                                <div>
                                  <Label className="font-bold">Produtos</Label>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Quantidade</TableHead>
                                        <TableHead>Preço</TableHead>
                                        <TableHead>Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedPurchase.products.map(
                                        (product) => (
                                          <TableRow key={product.id}>
                                            <TableCell>
                                              {product.name}
                                            </TableCell>
                                            <TableCell>
                                              {product.quantity}
                                            </TableCell>
                                            <TableCell>
                                              {formatCurrency(product.price)}
                                            </TableCell>
                                            <TableCell>
                                              {formatCurrency(
                                                product.price *
                                                  product.quantity,
                                              )}
                                            </TableCell>
                                          </TableRow>
                                        ),
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="font-bold">
                                      Método de Pagamento
                                    </Label>
                                    <p className="capitalize">
                                      {selectedPurchase.paymentMethod}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="font-bold">
                                      Valor Total
                                    </Label>
                                    <p className="text-xl font-bold">
                                      {formatCurrency(
                                        selectedPurchase.purchaseAmount,
                                      )}
                                    </p>
                                  </div>
                                </div>
                                {selectedPurchase.description && (
                                  <div>
                                    <Label className="font-bold">
                                      Descrição
                                    </Label>
                                    <p>{selectedPurchase.description}</p>
                                  </div>
                                )}
                                <div className="flex space-x-2">
                                  <NonFiscalReceiptPDF
                                    purchase={selectedPurchase}
                                  />
                                  <InvoicePDF purchase={selectedPurchase} />
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(purchase.id)}
                        >
                          <PencilIcon className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Você tem certeza?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá
                                permanentemente esta compra.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(purchase.id)}
                              >
                                Confirmar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhuma compra encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter>
          <Suspense fallback={null}>
            <TablesPagination
              pageCount={pageCount}
              pageIndex={pageIndex}
              pageSize={pageSize}
            />
          </Suspense>
        </CardFooter>
      </Card>
    </>
  )
}
