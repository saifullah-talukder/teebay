import React, { HTMLAttributes, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { Product } from '../../types/graphql'
import { formatDateWithOrdinal } from '../../utils/DateTime'
import IconButton from '../shared/IconButton'
import DeleteProductDialog from './DeleteProductDialog'

type ProductCardProps = {
  product: Product
  isUserOwner?: boolean
} & HTMLAttributes<HTMLDivElement>

const ProductCard: React.FC<ProductCardProps> = ({ product, isUserOwner, className }) => {
  const navigate = useNavigate()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <>
      {isDeleteDialogOpen && (
        <DeleteProductDialog isOpen={isDeleteDialogOpen} setIsOpen={setIsDeleteDialogOpen} product={product} />
      )}
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
        <span className="text-slate-500 text-xs">{`Description: ${product.description}`}</span>
        <span className="text-slate-500 text-sm">{`Date Posted: ${formatDateWithOrdinal(new Date(Number(product.createdAt)))}`}</span>
        {isUserOwner && (
          <div className="flex gap-x-4">
            <IconButton
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setIsDeleteDialogOpen(true)
              }}
              icon={<FaTrash />}
            />
            <IconButton
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                navigate(`/product/${product.id}/edit`)
              }}
              icon={<FaEdit />}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default ProductCard
