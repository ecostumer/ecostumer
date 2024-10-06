'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { PurchaseForm } from '../../purchase-form'
import { PurchaseSummaryCard } from './summary'

export function Overview() {
  return (
    <div className="grid flex-1 grid-cols-[1fr_minmax(320px,480px)] gap-4">
      <Card className="self-start">
        <CardHeader>
          <CardTitle>Criar Venda</CardTitle>
          <CardDescription>Preencha os detalhes da venda</CardDescription>
        </CardHeader>
        <CardContent>
          <PurchaseForm />
        </CardContent>
      </Card>

      <PurchaseSummaryCard />
    </div>
  )
}
