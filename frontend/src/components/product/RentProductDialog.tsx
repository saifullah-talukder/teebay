import React, { useState } from 'react'
import PopupDialog, { PopupDialogProps } from '../shared/PopupDialog'
import { Product } from '../../types/graphql'
import PrimaryActionButton from '../shared/PrimaryActionButton'
import TextInputField from '../form/TextInputfield'
import { dateSchema } from '../../utils/Validation'

type RentProductDialogDialogProps = Pick<PopupDialogProps, 'isOpen' | 'setIsOpen'> & {
  product: Product
}

const RentProductDialog: React.FC<RentProductDialogDialogProps> = props => {
  const [isRenting, setIsRenting] = useState(false)

  return (
    <PopupDialog isOpen={props.isOpen} setIsOpen={props.setIsOpen} title="Rent Product" className="max-w-[420px]">
      <div className="flex h-auto w-full flex-col gap-y-4 pt-4">
        <p className="text-slate-800">Rented Days</p>
        <div></div>
        <p className="text-slate-800">Rental Period</p>

        <div className="flex flex-col gap-y-4">
          <TextInputField
            label="From"
            placeholder="dd/mm/yyyy"
            validationSchema={dateSchema}
            onTextChange={text => {}}
          />
          <TextInputField label="To" placeholder="dd/mm/yyyy" validationSchema={dateSchema} onTextChange={text => {}} />
        </div>

        <div className="flex flex-row-reverse gap-x-4">
          <PrimaryActionButton label="Confirm Rent" onClick={props.handleRent} isLoading={isRenting} />
          <PrimaryActionButton
            className="bg-red-600 hover:bg-red-600 shadow-none"
            label="Go Back"
            onClick={() => props.setIsOpen(false)}
          />
        </div>
      </div>
    </PopupDialog>
  )
}

export default RentProductDialog
