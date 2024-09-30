'use client'

import { CheckIcon, PlusIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'cookies-next'
import { Loader2, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

import useDebounceValue from '@/hooks/useDebounceValue'
import { getProducts } from '@/http/get-products'

import { CreateNewTagDialog } from './create-new-product-dialog'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import { Dialog } from './ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
export interface Product {
  id: string
  name: string
  price: number
  description: string | null
  status: boolean
  quantity: number
}

interface ProductInputProps {
  name: string
  error?: string
  previewProductsAmount?: number
  allowProductCreation?: boolean
  onProductsChange?: (selectedProducts: Product[]) => void
}

export function ProductInput({
  name,
  error,
  previewProductsAmount = 5,
  allowProductCreation = true,
  onProductsChange,
}: ProductInputProps) {
  const [createProductDialogOpen, setCreateProductDialogOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const slug = getCookie('org') ?? ''

  // Usar debounce para evitar chamadas excessivas à API
  const searchTerm = useDebounceValue(search, 300)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', searchTerm],
    queryFn: async () => await getProducts({ slug }),
    enabled: true,
  })

  function handleAddProduct(product: Product) {
    const updatedProducts = [...selectedProducts, product]
    setSelectedProducts(updatedProducts)
    if (onProductsChange) {
      onProductsChange(updatedProducts)
    }
  }

  function handleRemoveProduct(product: Product) {
    const updatedProducts = selectedProducts.filter((p) => p.id !== product.id)
    setSelectedProducts(updatedProducts)
    if (onProductsChange) {
      onProductsChange(updatedProducts)
    }
  }

  return (
    <Dialog
      open={createProductDialogOpen}
      onOpenChange={setCreateProductDialogOpen}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            data-error={!!error}
            variant="outline"
            size="sm"
            className="flex h-8 items-center border-dashed px-2 data-[error=true]:border-red-400 data-[error=true]:bg-red-50"
          >
            <ShoppingCart className="mr-2 h-3 w-3" />
            <span className="text-xs">Produtos</span>

            {!!error && (
              <span className="ml-2 text-xs font-normal">{error}</span>
            )}

            {selectedProducts.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <div className="flex gap-1">
                  {selectedProducts.length > previewProductsAmount ? (
                    <Badge
                      variant="secondary"
                      className="pointer-events-none text-nowrap rounded-sm px-1 font-normal"
                    >
                      {selectedProducts.length} selecionados
                    </Badge>
                  ) : (
                    selectedProducts.map((product) => (
                      <Badge
                        variant="secondary"
                        key={product.id}
                        className="pointer-events-none rounded-sm px-1 font-normal"
                      >
                        {product.name}
                      </Badge>
                    ))
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Produtos"
              onValueChange={setSearch}
              value={search}
            />

            <CommandList>
              <ScrollArea className="h-[240px] w-full">
                <CommandGroup>
                  {allowProductCreation && (
                    <CommandItem
                      onSelect={() => {
                        setCreateProductDialogOpen(true)
                      }}
                      className="flex items-center gap-2"
                    >
                      <PlusIcon className="h-3 w-3" />
                      Criar novo produto
                    </CommandItem>
                  )}

                  {isLoading || isFetching ? (
                    <div className="flex cursor-default select-none items-center justify-center gap-2 rounded-sm p-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Carregando produtos...</span>
                    </div>
                  ) : data?.products && data.products.length === 0 ? (
                    <div className="flex cursor-default select-none items-center justify-center gap-2 rounded-sm p-2 text-sm text-muted-foreground">
                      Nenhum produto encontrado.
                    </div>
                  ) : (
                    data?.products &&
                    data.products.map((option) => {
                      const isSelected = selectedProducts.some(
                        (p) => p.id === option.id,
                      )

                      const product: Product = {
                        id: option.id,
                        name: option.name,
                        price: option.price,
                        description: option.description,
                        status: option.status,
                        quantity: 1, // Valor padrão de quantidade
                      }

                      return (
                        <CommandItem
                          key={option.id}
                          value={option.id}
                          onSelect={() => {
                            if (isSelected) {
                              handleRemoveProduct(product)
                            } else {
                              handleAddProduct(product)
                            }
                          }}
                        >
                          <div
                            className={twMerge(
                              'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'opacity-50 [&_svg]:invisible',
                            )}
                          >
                            <CheckIcon className={twMerge('h-4 w-4')} />
                          </div>
                          <span>{option.name}</span>
                        </CommandItem>
                      )
                    })
                  )}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Campos ocultos para os produtos selecionados */}
      {selectedProducts.map((product, index) => (
        <div key={product.id}>
          <input
            type="hidden"
            name={`${name}[${index}][id]`}
            value={product.id}
          />
          <input
            type="hidden"
            name={`${name}[${index}][name]`}
            value={product.name}
          />
          <input
            type="hidden"
            name={`${name}[${index}][price]`}
            value={product.price}
          />
          <input
            type="hidden"
            name={`${name}[${index}][quantity]`}
            value={product.quantity}
          />
        </div>
      ))}

      {error && (
        <p className="text-xs font-medium text-red-500 dark:text-red-400">
          {error}
        </p>
      )}

      {allowProductCreation && (
        <CreateNewTagDialog
          onRequestClose={() => {
            setCreateProductDialogOpen(false)
          }}
        />
      )}
    </Dialog>
  )
}
