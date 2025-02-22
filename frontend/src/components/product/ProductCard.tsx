import React, { HTMLAttributes } from 'react'
import { Product } from '../../types/graphql'
import { twMerge } from 'tailwind-merge'
import { formatDateWithOrdinal } from '../../utils/DateTime'
import { useNavigate } from 'react-router-dom'

type ProductCardProps = {
  product: Product
} & HTMLAttributes<HTMLDivElement>

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const navigate = useNavigate()
  return (
    <div
      className={twMerge(
        'w-80 rounded-md p-4 bg-blue-50 hover:shadow-md hover:shadow-blue-100 cursor-pointer flex flex-col gap-y-2',
        className
      )}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <h2 className="text-slate-800 text-xl">{product.title}</h2>
      <span className="text-slate-500 text-sm">{`Categories: ${product.categories.map(category => category.name).join(', ')}`}</span>
      <span className="text-slate-500 text-sm">{`Price: $${product.price}`}</span>
      <span className="text-slate-500 text-xs line-clamp-4">{product.description}</span>
      <span className="text-slate-500 text-sm">{`Date Posted: ${formatDateWithOrdinal(product.createdAt)}`}</span>
    </div>
  )
}

export default ProductCard
