import { Skeleton } from '@/components/ui/skeleton'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'

export interface PurchaseSkeletonTableProps {
  rows?: number
}

export function PurchaseSkeletonTable({
  rows = 5,
}: PurchaseSkeletonTableProps) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, row) => {
        return (
          <TableRow key={row}>
            <TableCell>
              <Skeleton className="h-4 w-[160px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[80px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[80px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[80px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-[58px] w-full" />
            </TableCell>
          </TableRow>
        )
      })}
    </TableBody>
  )
}
