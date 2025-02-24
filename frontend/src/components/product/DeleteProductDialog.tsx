import { useMutation } from '@apollo/client'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { DELETE_PRODUCT } from '../../graphql/Product'
import { Product } from '../../types/graphql'
import PopupDialog, { PopupDialogProps } from '../shared/PopupDialog'
import PrimaryActionButton from '../shared/PrimaryActionButton'

type DeleteProductDialogProps = Pick<PopupDialogProps, 'isOpen' | 'setIsOpen'> & {
  product: Product
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = props => {
  const [deleteProduct, { loading, error }] = useMutation(DELETE_PRODUCT, {
    refetchQueries: ['GetProducts', 'GetMyProducts'],
    awaitRefetchQueries: true,
  })

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  const handleDelete = async () => {
    try {
      await deleteProduct({ variables: { id: props.product.id } })
      props.setIsOpen(false)
      toast.success(`Product deleted successfully`)
    } catch (error) {
      console.error(`Product deletion failed. ${(error as Error).message}`)
    }
  }

  return (
    <PopupDialog isOpen={props.isOpen} setIsOpen={props.setIsOpen} title="Delete Product" className="max-w-[420px]">
      <div className="flex h-auto w-full flex-col gap-y-4 pt-4">
        <p className="text-slate-800">Are you sure you want to delete this product?</p>

        <div className="flex flex-row-reverse gap-x-4">
          <PrimaryActionButton label="Yes" onClick={handleDelete} isLoading={loading} />
          <PrimaryActionButton
            className="bg-red-600 hover:bg-red-600 shadow-none"
            label="No"
            onClick={() => props.setIsOpen(false)}
          />
        </div>
      </div>
    </PopupDialog>
  )
}

export default DeleteProductDialog
