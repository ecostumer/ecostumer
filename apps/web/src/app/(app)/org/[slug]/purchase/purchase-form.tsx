'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import StatusAlert from '@/components/alert-status'
import { ClientAutocomplete } from '@/components/client-input'
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
import { useFormState } from '@/hooks/use-form-state'
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
  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState(createPurchaseAction)

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [productsSelected, setProductsSelected] = useState<Product[]>([])
  const [discountValue, setDiscountValue] = useState<string>('')

  const isProductsSelected = productsSelected.length > 0

  useEffect(() => {
    // Atualize o desconto externamente, se necessário
  }, [discountValue])

  const handleProductsSelect = (selectedProducts: Product[]) => {
    setProductsSelected(selectedProducts)
    // Passe os produtos selecionados para outros componentes, se necessário
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <ClientAutocomplete name="client" error={errors?.client?.[0]} />
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
                selected={date}
                onSelect={(day) => setDate(day)}
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
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
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
