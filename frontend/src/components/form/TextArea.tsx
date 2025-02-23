import { ChangeEvent, HTMLAttributes, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import InputFieldLabel from './InputFieldLabel'

type TextAreaProps = HTMLAttributes<HTMLTextAreaElement> & {
  onTextChange: (input: string) => void
  label: string
  value: string
}

export default function TextArea(props: TextAreaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const { onTextChange, label, value, ...rest } = props

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(event.target.value)

    const target = event.target as HTMLTextAreaElement
    if (textAreaRef?.current?.style) {
      textAreaRef.current.style.height = '64px'
      textAreaRef.current.style.height = `${target.scrollHeight}px`
    }
  }

  return (
    <div className="flex flex-col gap-y-2 w-full">
      <InputFieldLabel label={label} />
      <textarea
        ref={textAreaRef}
        className={twMerge(
          'w-full p-2 rounded-md ring-transparent bg-white font-medium text-slate-800 text-sm ring-1 placeholder:text-xs placeholder:font-light placeholder:text-slate-400 focus:ring-2 focus:outline-none focus:ring-blue-600',
          props.className
        )}
        onChange={handleChange}
        value={value}
        {...rest}
      />
    </div>
  )
}
