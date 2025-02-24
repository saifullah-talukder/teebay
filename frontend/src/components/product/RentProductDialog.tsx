import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { GET_RENTALS_BY_PRODUCT, RENT_PRODUCT } from '../../graphql/Rental'
import { useRentProductStore } from '../../store/rental/RentProductStore'
import { Product, RentalsByProductData, RentalsByProductVars } from '../../types/graphql'
import { dateSchema } from '../../utils/Validation'
import TextInputField from '../form/TextInputfield'
import PopupDialog, { PopupDialogProps } from '../shared/PopupDialog'
import PrimaryActionButton from '../shared/PrimaryActionButton'

type RentProductDialogDialogProps = Pick<PopupDialogProps, 'isOpen' | 'setIsOpen'> & {
  product: Product
}

const RentProductDialog: React.FC<RentProductDialogDialogProps> = props => {
  const navigate = useNavigate()
  const { state, isValidated, errorMessage, setRentProductState } = useRentProductStore()
  const { data: existingRentals } = useQuery<RentalsByProductData, RentalsByProductVars>(GET_RENTALS_BY_PRODUCT, {
    variables: { productId: props.product.id },
  })
  const [rentProduct, { loading, error }] = useMutation(RENT_PRODUCT, {
    refetchQueries: ['GetBorrowedProducts'],
    awaitRefetchQueries: true,
  })

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  const handleRent = async () => {
    try {
      if (!isValidated) {
        toast.error(`Error trying to borrow product. ${errorMessage}`)
        return
      }

      await rentProduct({ variables: { productId: props.product.id, ...state } })
      props.setIsOpen(false)
      toast.success(`Product borrowed successfully`)
      navigate('/product/borrowed')
    } catch (error) {
      console.error(`Product borrowing failed. ${(error as Error).message}`)
    }
  }

  return (
    <PopupDialog isOpen={props.isOpen} setIsOpen={props.setIsOpen} title="Rent Product" className="max-w-[420px]">
      <div className="flex h-auto w-full flex-col gap-y-4 pt-4">
        <p className="text-slate-800">Rented Days</p>
        <div className="flex flex-col gap-y-2 -mt-2">
          {existingRentals?.rentalsByProduct.map(rental => (
            <div className="flex gap-x-2 text-xs text-slate-800">
              <span>{rental.startDate}</span>
              <span>{` - `}</span>
              <span>{rental.endDate}</span>
            </div>
          ))}
        </div>
        <p className="text-slate-800">Rental Period</p>

        <div className="flex flex-col gap-y-4">
          <TextInputField
            label="From"
            placeholder="dd/mm/yyyy"
            validationSchema={dateSchema}
            onTextChange={text => setRentProductState('startDate', text)}
            value={state.startDate}
          />
          <TextInputField
            label="To"
            placeholder="dd/mm/yyyy"
            validationSchema={dateSchema}
            onTextChange={text => setRentProductState('endDate', text)}
            value={state.endDate}
          />
        </div>

        <div className="flex flex-row-reverse gap-x-4">
          <PrimaryActionButton label="Confirm Rent" onClick={handleRent} isLoading={loading} />
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
