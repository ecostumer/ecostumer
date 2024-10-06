'use client'

import { dayjs, setDayjsLocale } from '@saas/dayjs'
import { useQuery } from '@tanstack/react-query'
import { CopyIcon, Loader2, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Suspense } from 'react'
import { z } from 'zod'

import { CopyButton } from '@/components/copy-button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getClients } from '@/http/get-clients'

import { CustomerItemActions } from './customer-item-actions'
import { CustomersPagination } from './customers-pagination'

setDayjsLocale('pt-br')

const customersPageSearchParams = z.object({
  pageIndex: z.coerce.number().default(0),
  pageSize: z.coerce.number().default(10),
  titleFilter: z.string().optional(),
})

type CustomersPageSearchParams = z.infer<typeof customersPageSearchParams>

export default function CustomersPage({
  searchParams,
}: {
  searchParams: CustomersPageSearchParams
}) {
  const { slug } = useParams<{ slug: string }>()

  const { pageIndex, pageSize, titleFilter } =
    customersPageSearchParams.parse(searchParams)

  const { data, isLoading } = useQuery({
    queryKey: [titleFilter, pageIndex, pageSize, slug, 'clients'],
    queryFn: () =>
      getClients({
        slug,
        pageIndex,
        pageSize,
        titleFilter,
      }),
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
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nascimento</TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Smartphone className="size-4" />
                    Telefone
                  </div>
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.clients && data?.clients.length > 0 ? (
                data?.clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Link
                        href={`/clients/${client.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {client.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {client.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge>{client.active ? 'Ativo' : 'Inativo'}</Badge>
                    </TableCell>
                    <TableCell>
                      {client.birthday
                        ? dayjs(client.birthday).format('DD MMM YYYY')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex max-w-52 items-center justify-between gap-2">
                        {client.phoneNumber}
                        <CopyButton size={'xs'} textToCopy={client.phoneNumber}>
                          <CopyIcon className="h-4 w-4" />
                        </CopyButton>
                      </div>
                    </TableCell>
                    <TableCell>
                      <CustomerItemActions customerId={client.id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Suspense fallback={null}>
        <CustomersPagination
          pageSize={pageSize}
          pageIndex={pageIndex}
          pageCount={pageCount}
        />
      </Suspense>
    </>
  )
}
