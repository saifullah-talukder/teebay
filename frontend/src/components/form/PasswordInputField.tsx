import { HTMLAttributes, useEffect, useState } from 'react'
import { FiEye, FiEyeOff, FiUnlock } from 'react-icons/fi'
import { twMerge } from 'tailwind-merge'
import InputFieldLabel from './InputFieldLabel'
import { ZodSchema } from 'zod'

type PasswordInputFieldProps = {
  inputClasses?: string
  label: string
  onTextChange: (input: string) => void
  placeholder?: string
  isDisabled?: boolean
  validationSchema?: ZodSchema
} & HTMLAttributes<HTMLDivElement>

export default function PasswordInputField(props: PasswordInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordVisible, setPasswordVisible] = useState(false)
  const [text, setText] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const inputTag = `input-password-${props.label}`

  useEffect(() => {
    props.onTextChange(text)

    if (props.isDisabled) {
      setErrorMessage('')
      return
    }

    if (props.validationSchema) {
      const result = props.validationSchema.safeParse(text)

      if (!result.success) {
        setErrorMessage(result.error.errors[0]?.message)
      } else {
        setErrorMessage('')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, props.isDisabled])

  return (
    <div className="flex w-full flex-col items-stretch gap-y-1">
      <InputFieldLabel htmlFor={'#' + inputTag} className="ml-5" label={props.label} />
      <div className="relative">
        <input
          type={isPasswordVisible ? 'text' : 'password'}
          id={inputTag}
          value={text}
          onChange={event => {
            const val = event.target.value
            setText(val)
            props.onTextChange(val)
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={props.placeholder ?? 'Enter password here...'}
          className={twMerge(
            'w-full rounded-full bg-white ring-1 ring-transparent py-2.5 pl-12 pr-5 text-sm font-medium text-slate-800 placeholder:text-xs placeholder:font-light placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 md:py-3',
            props.inputClasses
          )}
        />
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-800">
          <FiUnlock />
        </div>
        <button
          className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500"
          onClick={() => setPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {props.validationSchema && !!text && !isFocused && (
        <span className="pl-4 text-xs font-normal italic text-red-500">{errorMessage}</span>
      )}
    </div>
  )
}
