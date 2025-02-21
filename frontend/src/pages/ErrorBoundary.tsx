import { Component, ErrorInfo, ReactNode } from 'react'
import ErrorPage from './ErrorPage'

type ErrorBoundaryState = {
  hasError: boolean
  errorData: ErrorData | null
}

export type ErrorData = {
  error: string
  componentStack: string
  dateTime: string
  type: string
}

type ErrorBoundaryProps = {
  children: ReactNode
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, errorData: null }
  }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const eventDate = new Date().setSeconds(0, 0)
    const errorData: ErrorData = {
      error: error.toString(),
      componentStack: errorInfo.componentStack as string,
      dateTime: new Date(eventDate).toLocaleString(),
      type: 'CrashReport',
    }
    this.setState({ errorData })
  }

  render() {
    const { hasError, errorData } = this.state

    if (hasError) {
      return <ErrorPage isAppError={true} errorData={errorData} />
    }

    return this.props.children
  }
}

export default ErrorBoundary
