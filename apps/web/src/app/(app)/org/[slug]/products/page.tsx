'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Suspense } from 'react'
import { z } from 'zod'

import { ProductItemActions } from '@/app/(app)/org/[slug]/products/product-item-actions'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getProducts } from '@/http/get-products'
import { formatCurrency } from '@/utils/format-currency'

import { ProductsPagination } from './products-pagination'

const productsPageSearchParams = z.object({
  pageIndex: z.coerce.number().default(0),
  pageSize: z.coerce.number().default(10),
  titleFilter: z.string().default(''),
})

type ProductsPageSearchParams = z.infer<typeof productsPageSearchParams>

export default function ProductsPage({
  searchParams,
}: {
  searchParams: ProductsPageSearchParams
}) {
  const { pageIndex, pageSize, titleFilter } =
    productsPageSearchParams.parse(searchParams)

  const { slug } = useParams<{ slug: string }>()

  const { data, isLoading } = useQuery({
    queryKey: [pageIndex, pageSize, titleFilter, slug, 'products'],
    queryFn: () =>
      getProducts({ slug, pageIndex, pageSize, searchTerm: titleFilter }),
    enabled: !!slug,
  })

  const pageCount = data?.totalPages || 1

  return (
    <>
      <div className="rounded-md border">
        {isLoading ? (
          <div className="flex h-24 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead style={{ width: 100 }}>Status</TableHead>
                <TableHead style={{ width: 154 }}>Preço</TableHead>
                <TableHead style={{ width: 220 }} />
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.products && data?.products.length > 0 ? (
                data?.products.map((product) => {
                  return (
                    <TableRow
                      key={product.id}
                      className="has-[a:focus-visible]:bg-muted"
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <Link
                            href={`/products/${product.id}`}
                            prefetch={false}
                            className="font-medium text-primary outline-none hover:underline"
                          >
                            {product.name}
                          </Link>

                          <span className="text-xs text-muted-foreground">
                            {product.description}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <Badge>{product.status ? 'Ativo' : 'Inativo'}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell>
                        <ProductItemActions productId={product.id} />
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Sem resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Suspense fallback={null}>
        <ProductsPagination
          pageCount={pageCount}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </Suspense>
    </>
  )
}
