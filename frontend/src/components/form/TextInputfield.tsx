import classNames from 'classnames'
import { forwardRef, HTMLAttributes, ReactNode, useEffect, useImperativeHandle, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ZodSchema } from 'zod'
import InputFieldLabel from './InputFieldLabel'

type TextInputFieldProps = {
  inputClasses?: string
  icon?: ReactNode
  label?: string
  placeholder: string
  value?: string
  size?: 'sm' | 'md'
  isDisabled?: boolean
  hasBorder?: boolean
  validationSchema?: ZodSchema
  onTextChange: (input: string) => void
} & HTMLAttributes<HTMLDivElement>

const TextInputField = forwardRef<unknown, TextInputFieldProps>((props, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [textInput, setTextInput] = useState(props.value ?? '')
  const [errorMessage, setErrorMessage] = useState('')
  const inputTag = `input-${props.label}-${props.placeholder}`
  const size = props.size ?? 'md'
  const hasIcon = !!props.icon

  useEffect(() => {
    props.onTextChange(textInput)

    if (props.isDisabled) {
      setErrorMessage('')
      return
    }

    if (props.validationSchema) {
      const result = props.validationSchema.safeParse(textInput)

      if (!result.success) {
        setErrorMessage(result.error.errors[0]?.message)
      } else {
        setErrorMessage('')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textInput, props.isDisabled])

  useImperativeHandle(
    ref,
    () => ({
      isValidated() {
        return props.validationSchema?.safeParse(textInput).success ?? true
      },
      setInputText(val: string) {
        setTextInput(val)
      },
    }),
    [textInput, props.validationSchema]
  )

  const isFieldDisabled = props.isDisabled ?? false
  const hasValidationSchema = !!props.validationSchema
  const hasBorderOutline = props.hasBorder ?? false

  return (
    <div
      className={twMerge(
        classNames('flex flex-col items-stretch', { 'gap-y-1': hasValidationSchema }, props.className)
      )}
    >
      {!!props.label && <InputFieldLabel htmlFor={'#' + inputTag} className="mb-1 ml-5" label={props.label} />}
      <div className="relative">
        <input
          type="text"
          id={inputTag}
          value={textInput}
          onChange={event => setTextInput(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isFieldDisabled}
          placeholder={props.placeholder}
          className={twMerge(
            classNames(
              'w-full rounded-full ring-transparent bg-white font-medium text-slate-800 ring-1 placeholder:text-xs placeholder:font-light placeholder:text-slate-400 focus:ring-2 focus:outline-none focus:ring-blue-600',
              {
                'py-3 pl-12 pr-6 text-sm': size === 'md' && hasIcon,
                'py-3 pl-6 pr-6 text-sm': size === 'md' && !hasIcon,
                'py-2.5 pl-11 pr-5 text-xs': size === 'sm' && hasIcon,
                'py-2.5 pl-6 pr-5 text-xs': size === 'sm' && !hasIcon,
                'border border-slate-200 bg-slate-200': isFieldDisabled,
                'border border-white bg-white': !isFieldDisabled,
                'border border-slate-200': hasBorderOutline,
              }
            ),
            props.inputClasses
          )}
        />
        <div className="text-slate-800 absolute left-5 top-1/2 -translate-y-1/2">{!!props.icon && props.icon}</div>
      </div>
      {hasValidationSchema && !!textInput && !isFocused && (
        <span className="h-3 pl-4 text-xs font-normal italic text-red-600">{errorMessage}</span>
      )}
    </div>
  )
})

TextInputField.displayName = 'TextInputField'
export default TextInputField
