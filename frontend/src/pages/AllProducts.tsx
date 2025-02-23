import { useQuery } from '@apollo/client'
import React from 'react'
import ProductCard from '../components/product/ProductCard'
import Loading from '../components/shared/Loading'
import LoadingError from '../components/shared/LoadingError'
import { GET_PRODUCTS } from '../graphql/Product'
import { ProductsData } from '../types/graphql'

const AllProducts: React.FC = () => {
  const { loading, error, data } = useQuery<ProductsData>(GET_PRODUCTS)

  if (loading) {
    return <Loading />
  } else if (error) {
    return <LoadingError errorMessage="Error fetching products" />
  }

  return (
    <div className="flex flex-col justify-center items-center w-full pt-4">
      <h1 className="text-3xl text-center">ALL PRODUCTS</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {data?.products.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  )
}

export default AllProducts
