'use client'

import { jsPDF } from 'jspdf'
import { PrinterIcon } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/format-currency'

interface Purchase {
  id: string
  clientName: string
  purchaseAmount: number
  paymentMethod: string
  purchaseDate: string
  description: string | null
  products: { id: string; name: string; price: number; quantity: number }[]
}

interface NonFiscalReceiptPDFProps {
  purchase: Purchase
}

const NonFiscalReceiptPDF: React.FC<NonFiscalReceiptPDFProps> = ({
  purchase,
}) => {
  const generatePDF = () => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF()

    // Set font
    doc.setFont('helvetica', 'normal')

    // Title
    doc.setFontSize(18)
    doc.text('Cupom Não Fiscal', 105, 20, { align: 'center' })

    // Customer details
    doc.setFontSize(12)
    doc.text(`Cliente: ${purchase.clientName}`, 20, 40)
    doc.text(
      `Data: ${new Date(purchase.purchaseDate).toLocaleString('pt-BR')}`,
      20,
      50,
    )
    doc.text(`Método de Pagamento: ${purchase.paymentMethod}`, 20, 60)

    // Products table
    doc.setFontSize(10)
    doc.text('Produto', 20, 80)
    doc.text('Qtd', 100, 80)
    doc.text('Preço', 130, 80)
    doc.text('Total', 160, 80)

    let yPos = 90
    purchase.products.forEach((product) => {
      doc.text(product.name, 20, yPos)
      doc.text(product.quantity.toString(), 100, yPos)
      doc.text(formatCurrency(product.price), 130, yPos)
      doc.text(formatCurrency(product.price * product.quantity), 160, yPos)
      yPos += 10
    })

    // Total
    doc.setFontSize(12)
    doc.text(
      `Valor Total: ${formatCurrency(purchase.purchaseAmount)}`,
      20,
      yPos + 20,
    )

    // Description (if any)
    if (purchase.description) {
      doc.text(`Descrição: ${purchase.description}`, 20, yPos + 40)
    }

    // Footer
    doc.setFontSize(8)
    doc.text('Este documento não possui valor fiscal', 105, 280, {
      align: 'center',
    })

    // Save the PDF
    doc.save(`Cupom_Nao_Fiscal_${purchase.id}.pdf`)
  }

  return (
    <Button onClick={generatePDF} className="flex-1">
      <PrinterIcon className="mr-2 h-4 w-4" />
      Cupom Não Fiscal
    </Button>
  )
}

export default NonFiscalReceiptPDF
