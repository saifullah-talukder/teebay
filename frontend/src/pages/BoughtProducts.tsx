import { useQuery } from '@apollo/client'
import React from 'react'
import ProductCard from '../components/product/ProductCard'
import Loading from '../components/shared/Loading'
import LoadingError from '../components/shared/LoadingError'
import { GET_BOUGHT_PRODUCTS } from '../graphql/Transaction'
import { MyBoughtProductsData } from '../types/graphql'

const BoughtProducts: React.FC = () => {
  const { loading, error, data } = useQuery<MyBoughtProductsData>(GET_BOUGHT_PRODUCTS)

  if (loading) {
    return <Loading />
  } else if (error) {
    return <LoadingError errorMessage="Error fetching bought products" />
  }

  return (
    <div className="flex flex-col justify-center items-center w-full pt-4">
      <h1 className="text-3xl text-center">BOUGHT PRODUCTS</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {data?.me?.boughtProducts.map(transaction => (
          <ProductCard key={transaction.product.id} product={transaction.product} />
        ))}
      </div>
    </div>
  )
}

export default BoughtProducts
