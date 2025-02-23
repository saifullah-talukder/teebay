import React from 'react'
import { z } from 'zod'
import MultiSelectInputField from '../components/form/MultiSelectInputField'
import TextArea from '../components/form/TextArea'
import TextInputField from '../components/form/TextInputfield'
import { useEditProductStore } from '../store/product/EditProductStore'
import { mockData } from '../utils/data'
import PrimaryActionButton from '../components/shared/PrimaryActionButton'

const EditProduct: React.FC = () => {
  const { state, setAllState, setEditProductState } = useEditProductStore()

  const { categories } = mockData

  const handleSubmit = () => {}

  return (
    <div className="w-full flex justify-center">
      <div className="w-96 flex flex-col gap-y-4 items-center">
        <h1 className="text-slate-800 text-xl mt-4">Edit Product</h1>
        <TextInputField
          className="w-full"
          label="Title"
          placeholder="Enter product title"
          onTextChange={text => setEditProductState('title', text)}
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
        <TextArea label="Description" onTextChange={() => {}} />
        <TextInputField
          className="w-full"
          label="Price"
          placeholder="Enter price"
          validationSchema={z.coerce.number()}
          onTextChange={text => setEditProductState('price', Number(text))}
        />
        <TextInputField
          className="w-full"
          label="Rent Price"
          placeholder="Enter rent price"
          validationSchema={z.coerce.number()}
          onTextChange={text => setEditProductState('rentPrice', Number(text))}
        />
        <div className="w-full flex flex-row-reverse justify-between">
          <PrimaryActionButton label="Submit" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default EditProduct
