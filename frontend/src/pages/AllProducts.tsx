import React from 'react'
import { mockData } from '../utils/data'
import ProductCard from '../components/product/ProductCard'

const AllProducts: React.FC = () => {
  const { products } = mockData
  return (
    <div className="flex flex-col justify-center items-center w-full pt-4">
      <h1 className="text-3xl text-center">ALL PRODUCTS</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default AllProducts
