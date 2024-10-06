'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useParams } from 'next/navigation'

import StatusAlert from '@/components/alert-status'
import { AutoComplete, ClientOption } from '@/components/client-input'
import { ProductInput } from '@/components/product-input'
import { SubmitButton } from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { usePurchase } from '@/context/purchase-context'
import { useFormState } from '@/hooks/use-form-state'
import { getAllClients } from '@/http/get-all-clients'
import { cn } from '@/lib/utils'

import { createPurchaseAction } from './actions'

interface Product {
  id: string
  name: string
  price: number
  description: string | null
  status: boolean
  quantity: number
}

export function PurchaseForm() {
  const { slug } = useParams<{ slug: string }>()

  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState(createPurchaseAction)

  const {
    selectedProductsDetails,
    setSelectedProductsDetails,
    discount,
    setDiscount,
    client,
    setClient,
    date,
    setDate,
    paymentMethod,
    setPaymentMethod,
    observations,
    setObservations,
  } = usePurchase()

  const isProductsSelected = selectedProductsDetails.length > 0

  const handleProductsSelect = (selectedProducts: Product[]) => {
    setSelectedProductsDetails(selectedProducts)
  }

  const { data, isLoading } = useQuery({
    queryKey: [slug, 'clients'],
    queryFn: () =>
      getAllClients({
        slug,
      }),
    enabled: !!slug,
  })

  const clientOptions: ClientOption[] = data?.clients
    ? data.clients.map((client) => ({
        id: client.id,
        name: client.name,
        avatarUrl: client.author?.avatarUrl || null,
      }))
    : []

  const handleClientChange = (selectedOption: ClientOption | null) => {
    setClient(selectedOption)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="slug" value={slug} />

      <StatusAlert
        message={message}
        success={success}
        failTitle="Falha ao Salvar venda!"
        successTitle="Salvo!"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Cliente */}
        <div className="space-y-1 sm:col-span-1">
          <Label htmlFor="client">Cliente</Label>
          <AutoComplete
            name="client"
            options={clientOptions}
            value={client}
            onValueChange={handleClientChange}
            placeholder="Selecione um cliente"
            emptyMessage="Nenhum cliente encontrado"
            isLoading={isLoading}
            disabled={isLoading}
          />
          {errors?.client && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.client[0]}
            </p>
          )}
        </div>

        {/* Produtos */}
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="products">Produtos</Label>
          <ProductInput
            name="products"
            error={errors?.products?.[0]}
            onProductsChange={handleProductsSelect}
          />
        </div>

        {/* Data */}
        <div className="space-y-1">
          <Label htmlFor="date">Data</Label>
          <input
            type="hidden"
            name="date"
            value={date ? date.toISOString() : ''}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, 'dd/MM/yyyy', { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date!}
                onSelect={(day) => setDate(day!)}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors?.date && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.date[0]}
            </p>
          )}
        </div>

        {/* Desconto */}
        <div className="space-y-1">
          <Label htmlFor="discount">Desconto (%)</Label>
          <Input
            id="discount"
            name="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Digite o desconto em %"
            disabled={!isProductsSelected}
          />
          {errors?.discount && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.discount[0]}
            </p>
          )}
        </div>

        {/* Forma de Pagamento */}
        <div className="space-y-1">
          <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
          <Input
            id="paymentMethod"
            name="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            placeholder="Ex.: Cartão de Crédito, Pix"
          />
          {errors?.paymentMethod && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.paymentMethod[0]}
            </p>
          )}
        </div>

        {/* Observações */}
        <div className="space-y-1 sm:col-span-3">
          <Label htmlFor="observations">Observações</Label>
          <Textarea
            id="observations"
            name="observations"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Anotações adicionais"
          />
          {errors?.observations && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.observations[0]}
            </p>
          )}
        </div>
      </div>

      <SubmitButton isSubmitting={isPending} isSubmitSuccessful={success}>
        Salvar
      </SubmitButton>
    </form>
  )
}
