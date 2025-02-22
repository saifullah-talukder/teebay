import React, { useState } from 'react'
import PrimaryActionButton from '../components/shared/PrimaryActionButton'
import { mockData } from '../utils/data'
import { formatDateWithOrdinal } from '../utils/DateTime'
import BuyProductDialog from '../components/product/BuyProductDialog'
import RentProductDialog from '../components/product/RentProductDialog'

const ProductDetails: React.FC = () => {
  const [isRentDialogOpen, setIsRentDialogOpen] = useState(false)
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false)

  const { products } = mockData
  const product = products[0]

  const handleBuy = () => {}
  const handleRent = () => {}

  return (
    <>
      {isBuyDialogOpen && (
        <BuyProductDialog
          isOpen={isBuyDialogOpen}
          setIsOpen={setIsBuyDialogOpen}
          product={product}
          handleBuy={handleBuy}
        />
      )}
      {isRentDialogOpen && (
        <RentProductDialog
          isOpen={isRentDialogOpen}
          setIsOpen={setIsRentDialogOpen}
          product={product}
          handleRent={handleRent}
        />
      )}
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-col gap-y-2 max-w-[520px] mt-4">
          <h2 className="text-slate-800 text-xl">{product.title}</h2>
          <span className="text-slate-500 text-sm">{`Categories: ${product.categories.map(category => category.name).join(', ')}`}</span>
          <span className="text-slate-500 text-sm">{`Price: $${product.price}`}</span>
          <span className="text-slate-500 text-xs">{product.description}</span>
          <span className="text-slate-500 text-sm">{`Date Posted: ${formatDateWithOrdinal(product.createdAt)}`}</span>
        </div>
        <div className="flex gap-x-4 mt-4">
          <PrimaryActionButton label="Buy" onClick={() => setIsBuyDialogOpen(true)} />
          <PrimaryActionButton label="Rent" onClick={() => setIsRentDialogOpen(true)} />
        </div>
      </div>
    </>
  )
}

export default ProductDetails
