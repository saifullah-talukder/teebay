import { useMutation } from '@apollo/client'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BUY_PRODUCT } from '../../graphql/Transaction'
import { Product } from '../../types/graphql'
import PopupDialog, { PopupDialogProps } from '../shared/PopupDialog'
import PrimaryActionButton from '../shared/PrimaryActionButton'

type BuyProductDialogDialogProps = Pick<PopupDialogProps, 'isOpen' | 'setIsOpen'> & {
  product: Product
}

const BuyProductDialog: React.FC<BuyProductDialogDialogProps> = props => {
  const navigate = useNavigate()
  const [buyProduct, { loading, error }] = useMutation(BUY_PRODUCT, {
    refetchQueries: ['GetBoughtProducts'],
    awaitRefetchQueries: true,
  })

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  const handleBuy = async () => {
    try {
      await buyProduct({ variables: { productId: props.product.id } })
      props.setIsOpen(false)
      toast.success(`Product bought successfully`)
      navigate('/product/bought')
    } catch (error) {
      console.error(`Product buying failed. ${(error as Error).message}`)
    }
  }

  return (
    <PopupDialog isOpen={props.isOpen} setIsOpen={props.setIsOpen} title="Buy Product" className="max-w-[420px]">
      <div className="flex h-auto w-full flex-col gap-y-4 pt-4">
        <p className="text-slate-800">Are you sure you want to buy this product?</p>

        <div className="flex flex-row-reverse gap-x-4">
          <PrimaryActionButton label="Yes" onClick={handleBuy} isLoading={loading} />
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

export default BuyProductDialog
