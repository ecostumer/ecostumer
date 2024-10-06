import React, { createContext, ReactNode, useContext, useState } from 'react'

export interface ClientOption {
  id: string
  name: string
  avatarUrl: string | null
}

interface Product {
  id: string
  name: string
  price: number
  description: string | null
  status: boolean
  quantity: number
}

interface PurchaseContextType {
  selectedProductsDetails: Product[]
  setSelectedProductsDetails: React.Dispatch<React.SetStateAction<Product[]>>
  discount: string
  setDiscount: React.Dispatch<React.SetStateAction<string>>
  client: ClientOption | null
  setClient: React.Dispatch<React.SetStateAction<ClientOption | null>>
  date: Date | null
  setDate: React.Dispatch<React.SetStateAction<Date | null>>
  paymentMethod: string
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>
  observations: string
  setObservations: React.Dispatch<React.SetStateAction<string>>
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(
  undefined,
)

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [selectedProductsDetails, setSelectedProductsDetails] = useState<
    Product[]
  >([])
  const [discount, setDiscount] = useState<string>('')
  const [client, setClient] = useState<ClientOption | null>(null)
  const [date, setDate] = useState<Date | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [observations, setObservations] = useState<string>('')

  return (
    <PurchaseContext.Provider
      value={{
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
      }}
    >
      {children}
    </PurchaseContext.Provider>
  )
}

export function usePurchase() {
  const context = useContext(PurchaseContext)
  if (context === undefined) {
    console.error('usePurchase must be used within a PurchaseProvider')
    throw new Error('usePurchase must be used within a PurchaseProvider')
  }
  return context
}
