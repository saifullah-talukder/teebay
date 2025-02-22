import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PrimaryActionButton from '../components/shared/PrimaryActionButton'
import { ErrorData } from './ErrorBoundary'

interface ErrorPageProps {
  isAppError: boolean
  errorData?: ErrorData | null
}

const ErrorPage: React.FC<ErrorPageProps> = ({ isAppError, errorData }) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAppError && errorData) {
      // sendErrorReport(errorData)
      //   .then(() => {})
      //   .catch(() => {});
    }
  }, [isAppError, errorData])

  return (
    <div className="w-full flex flex-col h-screen justify-center">
      <div className="w-fit self-center flex flex-col items-center space-y-8 bg-white-100 bg-opacity-60 border-white-100 p-6 rounded-xl">
        <h1 className="text-3xl text-secondary font-semibold">
          {isAppError ? 'Something went wrong!' : "The page you are looking for doesn't exist!"}
        </h1>
        <PrimaryActionButton onClick={() => navigate('/all-products')} label="Go to Home Page"></PrimaryActionButton>
      </div>
    </div>
  )
}

export default ErrorPage
