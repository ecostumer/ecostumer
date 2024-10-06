export interface Product {
  id: string
  name: string
  price: number
  description: string | null
  status: boolean
  quantity: number
}

export interface PurchaseContextType {
  selectedProductsDetails: Product[]
  setSelectedProductsDetails: React.Dispatch<React.SetStateAction<Product[]>>
  totalPrice: number
  finalPrice: number
  discountAmount: number
  discount: string
  setDiscount: React.Dispatch<React.SetStateAction<string>>
}
