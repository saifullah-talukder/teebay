import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import classNames from 'classnames'
import { HTMLAttributes, ReactNode, useEffect, useState } from 'react'
import { FiCheckCircle, FiChevronDown, FiSearch, FiXCircle } from 'react-icons/fi'
import { twMerge } from 'tailwind-merge'
import { SelectOption, Selectable } from './SelectInputField'
import TextInputField from './TextInputfield'

type MultiSelectInputFieldProps<T> = {
  inputClasses?: string
  size?: 'sm' | 'md'
  icon?: ReactNode
  items: Selectable<T>[]
  placeholder: string
  label?: string
  selectedItems?: T[]
  onItemsChange?: (items: T[]) => void
  isClearable?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function MultiSelectInputField<T extends SelectOption = SelectOption>(
  props: MultiSelectInputFieldProps<T>
) {
  const [selectedItems, setSelectedItems] = useState<T[]>([])
  const [filteredItems, setFilteredItems] = useState<T[]>([])
  const [searchText, setSearchText] = useState('')

  const canBeCleared = props.isClearable ?? false
  const size = props?.size ?? 'sm'

  const isSelected = (item: T) => selectedItems.find(v => v._id === item._id) !== undefined
  const isMatchedWithSearchText = (item: T) => {
    if (!searchText.trim()) return true
    return item.name.toLowerCase().includes(searchText.trim().toLowerCase())
  }

  const getEffectiveLevel = () => {
    switch (selectedItems.length) {
      case 0:
        return props.placeholder

      case 1:
        return selectedItems[0].name

      default:
        return `${selectedItems.map(r => r.name).join(', ')}`
    }
  }

  useEffect(() => {
    if (props.selectedItems) {
      setSelectedItems(props.selectedItems)
      return
    }

    setSelectedItems(props.items.filter(item => item.isSelected))
  }, [props.selectedItems, props.items])

  useEffect(() => {
    setFilteredItems(props.items.filter(isMatchedWithSearchText))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.items, searchText])

  return (
    <Listbox
      as="div"
      className={twMerge('relative flex flex-col items-start gap-y-1', props.className)}
      value={selectedItems}
      multiple={true}
      onChange={val => {
        if (val) {
          setSelectedItems(val)
          props.onItemsChange?.(val)
        }
      }}
    >
      {!!props.label && <Label className="ml-5 mb-2 text-xs font-medium text-slate-400">{props.label}</Label>}
      <ListboxButton
        as="div"
        className={twMerge(
          classNames(
            'flex w-full cursor-pointer items-center justify-between rounded-full bg-white px-3 md:px-4 text-slate-800',
            [size === 'sm' ? 'py-2.5' : 'py-3.5']
          ),
          props.inputClasses
        )}
      >
        <div className="flex items-center gap-x-2">
          <span className="text-secondary">{props.icon}</span>
          <span className={classNames('select-none whitespace-nowrap text-xs font-light')}>{getEffectiveLevel()}</span>
        </div>
        <div className="ml-2 md:ml-4 flex items-center gap-x-2">
          {selectedItems.length > 0 && canBeCleared && (
            <FiXCircle
              className="text-slate-600"
              strokeWidth={1.5}
              onClick={e => {
                e.preventDefault()
                setSelectedItems([])
                props.onItemsChange?.([])
              }}
            />
          )}
          <FiChevronDown className="text-slate-600" strokeWidth={1.5} />
        </div>
      </ListboxButton>

      <ListboxOptions className="z-10 absolute left-0 top-full max-h-72 w-full translate-y-2 divide-y divide-slate-100 overflow-y-scroll rounded-lg border border-slate-100 bg-white py-2 shadow-lg focus:outline-0 focus:ring-0">
        <div className="w-full px-3">
          <TextInputField
            placeholder="Search here..."
            size="sm"
            icon={<FiSearch size={14} className="text-slate-500" />}
            onTextChange={setSearchText}
          />
        </div>
        {filteredItems.map(item => (
          <ListboxOption
            key={item._id}
            value={item}
            className="cursor-pointer transition-all duration-300 hover:bg-slate-100"
          >
            <div className="px-4 py-2.5 flex flex-row items-center">
              <span className="text-xs font-normal text-slate-800 grow">{item.name}</span>
              {isSelected(item) && <FiCheckCircle size={14} className="text-green-600 shrink-0" />}
            </div>
          </ListboxOption>
        ))}

        {!filteredItems.length && (
          <div className="flex w-full flex-col items-center justify-center px-4 py-4">
            <img src="/images/icon/empty-search.svg" className="h-16" />
            <span className="text-xs font-light italic text-slate-400">No Item</span>
          </div>
        )}
      </ListboxOptions>
    </Listbox>
  )
}
