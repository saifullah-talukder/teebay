import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import BuyProductDialog from '../components/product/BuyProductDialog'
import RentProductDialog from '../components/product/RentProductDialog'
import Loading from '../components/shared/Loading'
import LoadingError from '../components/shared/LoadingError'
import PrimaryActionButton from '../components/shared/PrimaryActionButton'
import { GET_PRODUCT } from '../graphql/Product'
import { ProductData, ProductVars } from '../types/graphql'
import { formatDateWithOrdinal } from '../utils/DateTime'

const ProductDetails: React.FC = () => {
  const [isRentDialogOpen, setIsRentDialogOpen] = useState(false)
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false)
  const { id: productId } = useParams()
  const { loading, error, data } = useQuery<ProductData, ProductVars>(GET_PRODUCT, {
    variables: { id: productId as string },
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <LoadingError errorMessage="Error fetching product" />
  } else if (!data?.product) {
    return <LoadingError errorMessage="Product not found" />
  }

  const { product } = data

  return (
    <>
      {isBuyDialogOpen && (
        <BuyProductDialog isOpen={isBuyDialogOpen} setIsOpen={setIsBuyDialogOpen} product={product} />
      )}
      {isRentDialogOpen && (
        <RentProductDialog isOpen={isRentDialogOpen} setIsOpen={setIsRentDialogOpen} product={product} />
      )}
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-col gap-y-2 max-w-[520px] mt-4">
          <h2 className="text-slate-800 text-xl">{product.title}</h2>
          <span className="text-slate-500 text-sm">{`Categories: ${product.categories.map(category => category.name).join(', ')}`}</span>
          <span className="text-slate-500 text-sm">{`Price: $${product.price}`}</span>
          <span className="text-slate-500 text-xs">{`Description: ${product.description}`}</span>
          <span className="text-slate-500 text-sm">{`Date Posted: ${formatDateWithOrdinal(new Date(Number(product.createdAt)))}`}</span>
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
