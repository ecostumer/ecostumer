import { getCurrentOrg } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getBilling } from '@/http/get-billing'
export async function Billing() {
  const currentOrg = getCurrentOrg()
  const { billing } = await getBilling(currentOrg!)
  return (
    <>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Faturamento</CardTitle>
          <CardDescription>
            Informações sobre os custos da sua organização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de custo</TableHead>
                <TableHead className="text-right" style={{ width: 120 }}>
                  Quantidade
                </TableHead>
                <TableHead className="text-right" style={{ width: 200 }}>
                  Subtotal
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Quantidade de clientes</TableCell>
                <TableCell className="text-right">
                  {billing.clients.amount}
                </TableCell>
                <TableCell className="text-right">
                  {billing.clients.price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'BRL',
                  })}{' '}
                  (
                  {billing.clients.unit.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'BRL',
                  })}{' '}
                  cada)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantidade de membros</TableCell>{' '}
                <TableCell className="text-right">
                  {billing.seats.amount}
                </TableCell>
                <TableCell className="text-right">
                  {billing.seats.price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'BRL',
                  })}{' '}
                  (
                  {billing.seats.unit.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'BRL',
                  })}{' '}
                  cada)
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell />
                <TableCell className="text-right">Total</TableCell>
                <TableCell className="text-right">
                  {billing.total.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
