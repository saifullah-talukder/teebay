import React from 'react'
import { BiError } from 'react-icons/bi'

type LoadingErrorProps = {
  errorMessage: string
}

const LoadingError: React.FC<LoadingErrorProps> = ({ errorMessage }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-[80vh]">
      <BiError size={72} className="text-[red]" />
      <p className="text-[red] text-center text-lg font-semibold m-1">Error!</p>
      <p className="text-[#362B73] text-center text-sm font-normal m-1">{errorMessage}</p>
    </div>
  )
}

export default LoadingError
