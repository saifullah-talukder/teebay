import { HTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type IconButtonProps = {
  icon: ReactNode
} & HTMLAttributes<HTMLButtonElement>

export default function IconButton(props: IconButtonProps) {
  return (
    <button
      type="button"
      className={twMerge(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 transition-all duration-300 hover:bg-blue-200 focus:outline-none focus:ring-0 cursor-pointer',
        props.className
      )}
      onClick={props.onClick}
    >
      {props.icon}
    </button>
  )
}
