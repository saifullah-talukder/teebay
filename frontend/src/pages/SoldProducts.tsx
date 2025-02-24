import { useQuery } from '@apollo/client'
import React from 'react'
import ProductCard from '../components/product/ProductCard'
import Loading from '../components/shared/Loading'
import LoadingError from '../components/shared/LoadingError'
import { GET_SOLD_PRODUCTS } from '../graphql/Transaction'
import { MySoldProductsData } from '../types/graphql'

const SoldProducts: React.FC = () => {
  const { loading, error, data } = useQuery<MySoldProductsData>(GET_SOLD_PRODUCTS)

  if (loading) {
    return <Loading />
  } else if (error) {
    console.log(error)
    return <LoadingError errorMessage="Error fetching sold products" />
  }

  return (
    <div className="flex flex-col justify-center items-center w-full pt-4">
      <h1 className="text-3xl text-center">SOLD PRODUCTS</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {data?.me?.soldProducts.map(transaction => (
          <ProductCard key={transaction.product.id} product={transaction.product} />
        ))}
      </div>
    </div>
  )
}

export default SoldProducts
