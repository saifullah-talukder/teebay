import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'
import MultiSelectInputField from '../components/form/MultiSelectInputField'
import TextArea from '../components/form/TextArea'
import TextInputField from '../components/form/TextInputfield'
import Loading from '../components/shared/Loading'
import LoadingError from '../components/shared/LoadingError'
import PrimaryActionButton from '../components/shared/PrimaryActionButton'
import { GET_CATEGORIES } from '../graphql/Category'
import { GET_PRODUCT, UPDATE_PRODUCT } from '../graphql/Product'
import { useEditProductStore } from '../store/product/EditProductStore'
import { CategoriesData, ProductData, ProductVars } from '../types/graphql'

const EditProduct: React.FC = () => {
  const navigate = useNavigate()
  const { state, setAllState, isValidated, errorMessage, setEditProductState, reset } = useEditProductStore()
  const { id: productId } = useParams()
  const {
    loading: productLoading,
    error: productFetchError,
    data: productData,
  } = useQuery<ProductData, ProductVars>(GET_PRODUCT, {
    variables: { id: productId as string },
  })
  const { error: categoriesFetchError, data: categoriesData } = useQuery<CategoriesData>(GET_CATEGORIES)
  const [updateProduct, { loading, error }] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: ['GetProducts', 'GetMyProducts'],
    awaitRefetchQueries: true,
  })

  useEffect(() => {
    if (productData?.product) {
      setAllState({ ...productData.product, categories: productData.product.categories.map(category => category.name) })
    }
  }, [productData, setAllState])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  if (productLoading || state === null) {
    return <Loading />
  } else if (productFetchError) {
    return <LoadingError errorMessage="Error fetching product" />
  } else if (!productData?.product) {
    return <LoadingError errorMessage="Product not found" />
  } else if (categoriesFetchError || !categoriesData) {
    return <LoadingError errorMessage="Error fetching categories" />
  }

  const { categories } = categoriesData

  const handleSubmit = async () => {
    if (!isValidated) {
      toast.error(`Error trying to create product. ${errorMessage}`)
      return
    }

    try {
      await updateProduct({ variables: state })
      toast.success('Product update successful')
      reset()
      navigate('/product/my')
    } catch (error) {
      console.error(`Product update failed. ${(error as Error).message}`)
    }
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-96 flex flex-col gap-y-4 items-center">
        <h1 className="text-slate-800 text-xl mt-4">Edit Product</h1>
        <TextInputField
          className="w-full"
          label="Title"
          placeholder="Enter product title"
          onTextChange={text => setEditProductState('title', text)}
          value={state.title}
        />
        <MultiSelectInputField
          className="w-full"
          inputClasses="ring-custom-gray ring-1"
          label="Categories"
          items={categories.map(r => ({ _id: `${r}`, name: r.name }))}
          placeholder="Select Categories ..."
          selectedItems={state.categories.map(r => ({ _id: `${r}`, name: r }))}
          onItemsChange={items =>
            setEditProductState(
              'categories',
              items.map(item => item.name)
            )
          }
          isClearable={true}
        />
        <TextArea
          label="Description"
          value={state.description}
          onTextChange={text => setEditProductState('description', text)}
        />
        <TextInputField
          className="w-full"
          label="Price"
          placeholder="Enter price"
          validationSchema={z.coerce.number()}
          onTextChange={text => setEditProductState('price', Number(text))}
          value={String(state.price)}
        />
        <TextInputField
          className="w-full"
          label="Rent Price"
          placeholder="Enter rent price"
          validationSchema={z.coerce.number()}
          onTextChange={text => setEditProductState('rentPrice', Number(text))}
          value={String(state.rentPrice)}
        />
        <div className="w-full flex flex-row-reverse justify-between">
          <PrimaryActionButton label="Submit" onClick={handleSubmit} isLoading={loading} />
        </div>
      </div>
    </div>
  )
}

export default EditProduct
