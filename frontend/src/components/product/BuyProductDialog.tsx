import React, { useState } from 'react'
import PopupDialog, { PopupDialogProps } from '../shared/PopupDialog'
import { Product } from '../../types/graphql'
import PrimaryActionButton from '../shared/PrimaryActionButton'

type BuyProductDialogDialogProps = Pick<PopupDialogProps, 'isOpen' | 'setIsOpen'> & {
  product: Product
  handleBuy: () => void
}

const BuyProductDialog: React.FC<BuyProductDialogDialogProps> = props => {
  const [isBuying, setIsBuying] = useState(false)

  return (
    <PopupDialog isOpen={props.isOpen} setIsOpen={props.setIsOpen} title="Buy Product" className="max-w-[420px]">
      <div className="flex h-auto w-full flex-col gap-y-4 pt-4">
        <p className="text-slate-800">Are you sure you want to buy this product?</p>

        <div className="flex flex-row-reverse gap-x-4">
          <PrimaryActionButton label="Yes" onClick={props.handleBuy} isLoading={isBuying} />
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
