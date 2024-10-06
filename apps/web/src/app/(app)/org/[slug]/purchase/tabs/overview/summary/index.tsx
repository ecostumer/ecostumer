import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, CreditCard, User } from 'lucide-react'
import { useMemo } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { usePurchase } from '@/context/purchase-context'

export function PurchaseSummaryCard() {
  const {
    selectedProductsDetails,
    discount,
    client,
    date,
    paymentMethod,
    observations,
  } = usePurchase()

  const totalAmount = useMemo(() => {
    return selectedProductsDetails.reduce((total, product) => {
      return total + product.price * product.quantity
    }, 0)
  }, [selectedProductsDetails])

  const discountAmount = useMemo(() => {
    const discountPercentage = parseFloat(discount) || 0
    return (totalAmount * discountPercentage) / 100
  }, [totalAmount, discount])

  const finalAmount = totalAmount - discountAmount

  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="flex-shrink-0 ">
        <CardTitle className="text-xl font-bold">Resumo da Compra</CardTitle>
      </CardHeader>
      <ScrollArea className="flex-grow">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <Label className="text-sm font-semibold">Cliente</Label>
                </div>
                <p className="text-sm">
                  {client ? client.name : 'Nenhum cliente selecionado'}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <Label className="text-sm font-semibold">Data</Label>
                </div>
                <p className="text-sm">
                  {date
                    ? format(date, 'dd/MM/yyyy', { locale: ptBR })
                    : 'Data não selecionada'}
                </p>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Produtos</Label>
              <ul className="space-y-1">
                {selectedProductsDetails.map((product) => (
                  <li key={product.id} className="flex justify-between text-sm">
                    <span>
                      {product.name} x {product.quantity}
                    </span>
                    <span>
                      R$ {(product.price * product.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator className="my-2" />

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <Label>Subtotal</Label>
                <span>R$ {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <Label>Desconto ({discount}%)</Label>
                <span>- R$ {discountAmount.toFixed(2)}</span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between font-bold">
                <Label>Total</Label>
                <span>R$ {finalAmount.toFixed(2)}</span>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <Label className="text-sm font-semibold">
                    Forma de Pagamento
                  </Label>
                </div>
                <p className="text-sm">{paymentMethod || 'Não especificado'}</p>
              </div>

              {observations && (
                <div className="space-y-1">
                  <Label className="text-sm font-semibold">Observações</Label>
                  <p className="text-xs text-muted-foreground">
                    {observations}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  )
}
