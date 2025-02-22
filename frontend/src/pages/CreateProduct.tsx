import React, { useState } from 'react'
import { z } from 'zod'
import MultiSelectInputField from '../components/form/MultiSelectInputField'
import TextArea from '../components/form/TextArea'
import TextInputField from '../components/form/TextInputfield'
import PrimaryActionButton from '../components/shared/PrimaryActionButton'
import { useCreateProductStore } from '../store/product/CreateProductStore'
import { mockData } from '../utils/data'

type ProductCreationStep = 'title' | 'categories' | 'description' | 'price' | 'summary'

const CreateProduct: React.FC = () => {
  const [currenstStep, setCurrentStep] = useState<ProductCreationStep>('title')
  const { state, setCreateProductState } = useCreateProductStore()

  const { categories } = mockData

  const handleSubmit = () => {}

  return (
    <div className="w-full flex justify-center">
      {currenstStep === 'title' && (
        <div className="w-96 flex flex-col gap-y-4 items-center justify-center my-20">
          <h1 className="text-slate-800 text-xl">Select a title for your product</h1>
          <TextInputField
            className="w-full"
            label="Title"
            placeholder="Enter product title"
            onTextChange={text => setCreateProductState('title', text)}
          />
          <div className="w-full flex flex-row-reverse justify-between">
            <PrimaryActionButton label="Next" onClick={() => setCurrentStep('categories')} />
          </div>
        </div>
      )}
      {currenstStep === 'categories' && (
        <div className="w-96 flex flex-col gap-y-4 items-center justify-center my-20">
          <h1 className="text-slate-800 text-xl">Select categories</h1>
          <MultiSelectInputField
            className="w-full"
            inputClasses="ring-custom-gray ring-1"
            label="Categories"
            items={categories.map(r => ({ _id: `${r}`, name: r.name }))}
            placeholder="Select Categories ..."
            selectedItems={state.categories.map(r => ({ _id: `${r}`, name: r }))}
            onItemsChange={items =>
              setCreateProductState(
                'categories',
                items.map(item => item.name)
              )
            }
            isClearable={true}
          />
          <div className="w-full flex flex-row-reverse justify-between">
            <PrimaryActionButton label="Next" onClick={() => setCurrentStep('description')} />
            <PrimaryActionButton label="Back" onClick={() => setCurrentStep('title')} />
          </div>
        </div>
      )}
      {currenstStep === 'description' && (
        <div className="w-96 flex flex-col gap-y-4 items-center justify-center my-20">
          <h1 className="text-slate-800 text-xl">Select description</h1>
          <TextArea label="Description" onTextChange={() => {}} />
          <div className="w-full flex flex-row-reverse justify-between">
            <PrimaryActionButton label="Next" onClick={() => setCurrentStep('price')} />
            <PrimaryActionButton label="Back" onClick={() => setCurrentStep('categories')} />
          </div>
        </div>
      )}
      {currenstStep === 'price' && (
        <div className="w-96 flex flex-col gap-y-4 items-center justify-center my-20">
          <h1 className="text-slate-800 text-xl">Select price</h1>
          <TextInputField
            className="w-full"
            label="Price"
            placeholder="Enter price"
            validationSchema={z.number()}
            onTextChange={text => setCreateProductState('price', Number(text))}
          />
          <TextInputField
            className="w-full"
            label="Rent Price"
            placeholder="Enter rent price"
            validationSchema={z.number()}
            onTextChange={text => setCreateProductState('rentPrice', Number(text))}
          />
          <div className="w-full flex flex-row-reverse justify-between">
            <PrimaryActionButton label="Next" onClick={() => setCurrentStep('summary')} />
            <PrimaryActionButton label="Back" onClick={() => setCurrentStep('description')} />
          </div>
        </div>
      )}
      {currenstStep === 'summary' && (
        <div className="w-96 flex flex-col gap-y-4 items-start justify-center my-20 text-slate-500 text-sm">
          <div className="w-full">
            <h1 className="text-slate-800 text-xl text-center">Summary</h1>
          </div>
          <span>{`Title: ${state.title}`}</span>
          <span>{`Categories: ${state.categories.join(', ')}`}</span>
          <span>{`Description: ${state.description}`}</span>
          <span>{`Price: ${state.price}$`}</span>
          <span>{`To Rent: ${state.rentPrice}$ per day`}</span>
          <div className="w-full flex flex-row-reverse justify-between">
            <PrimaryActionButton label="Submit" onClick={handleSubmit} />
            <PrimaryActionButton label="Back" onClick={() => setCurrentStep('price')} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateProduct
