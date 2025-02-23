import { SpinnerCircular } from 'spinners-react'
import colors from 'tailwindcss/colors'

const Loading: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-custom-gray">
      <SpinnerCircular color={colors.blue[600]} secondaryColor={colors.gray[200]} />
    </div>
  )
}

export default Loading
