import { useQuery } from '@apollo/client'
import React from 'react'
import ProductCard from '../components/product/ProductCard'
import Loading from '../components/shared/Loading'
import LoadingError from '../components/shared/LoadingError'
import { GET_LENT_PRODUCTS } from '../graphql/Rental'
import { MyLentProductsData } from '../types/graphql'

const LentProducts: React.FC = () => {
  const { loading, error, data } = useQuery<MyLentProductsData>(GET_LENT_PRODUCTS)

  if (loading) {
    return <Loading />
  } else if (error) {
    return <LoadingError errorMessage="Error fetching lent products" />
  }

  return (
    <div className="flex flex-col justify-center items-center w-full pt-4">
      <h1 className="text-3xl text-center">LENT PRODUCTS</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {data?.me?.lentProducts.map(rental => <ProductCard key={rental.product.id} product={rental.product} />)}
      </div>
    </div>
  )
}

export default LentProducts
