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

interface InvoicePDFProps {
  purchase: Purchase
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ purchase }) => {
  const generatePDF = () => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF()

    // Set font
    doc.setFont('helvetica', 'normal')

    // Title
    doc.setFontSize(18)
    doc.text('Nota Fiscal', 105, 20, { align: 'center' })

    // Invoice details
    doc.setFontSize(10)
    doc.text(`Número da NF: ${Math.floor(Math.random() * 1000000)}`, 20, 30)
    doc.text(`Data de Emissão: ${new Date().toLocaleString('pt-BR')}`, 20, 35)

    // Customer details
    doc.setFontSize(12)
    doc.text(`Cliente: ${purchase.clientName}`, 20, 50)
    doc.text(
      `Data da Compra: ${new Date(purchase.purchaseDate).toLocaleString('pt-BR')}`,
      20,
      60,
    )
    doc.text(`Método de Pagamento: ${purchase.paymentMethod}`, 20, 70)

    // Products table
    doc.setFontSize(10)
    doc.text('Produto', 20, 90)
    doc.text('Qtd', 100, 90)
    doc.text('Preço Unit.', 130, 90)
    doc.text('Total', 170, 90)

    let yPos = 100
    purchase.products.forEach((product) => {
      doc.text(product.name, 20, yPos)
      doc.text(product.quantity.toString(), 100, yPos)
      doc.text(formatCurrency(product.price), 130, yPos)
      doc.text(formatCurrency(product.price * product.quantity), 170, yPos)
      yPos += 10
    })

    // Total
    doc.setFontSize(12)
    doc.text(
      `Subtotal: ${formatCurrency(purchase.purchaseAmount)}`,
      130,
      yPos + 20,
    )
    doc.text(
      `Impostos: ${formatCurrency(purchase.purchaseAmount * 0.1)}`,
      130,
      yPos + 30,
    )
    doc.text(
      `Total: ${formatCurrency(purchase.purchaseAmount * 1.1)}`,
      130,
      yPos + 40,
    )

    // Description (if any)
    if (purchase.description) {
      doc.text(`Observações: ${purchase.description}`, 20, yPos + 60)
    }

    // Footer
    doc.setFontSize(8)
    doc.text('Este documento é uma nota fiscal válida', 105, 280, {
      align: 'center',
    })

    // Save the PDF
    doc.save(`Nota_Fiscal_${purchase.id}.pdf`)
  }

  return (
    <Button onClick={generatePDF} className="flex-1">
      <PrinterIcon className="mr-2 h-4 w-4" />
      Nota Fiscal
    </Button>
  )
}

export default InvoicePDF
