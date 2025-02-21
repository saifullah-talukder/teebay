import { ReactNode } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { publicRoutes } from '../config'
import Dashboard from '../pages/Dashboard'
import ErrorPage from '../pages/ErrorPage'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'

type ProtectedRouteProps = {
  children?: ReactNode
  redirectPath?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectPath = '/signin' }) => {
  const isSignedIn = true
  const { pathname } = useLocation()
  const isPublicRoute = publicRoutes.some(route => route === pathname)

  const DefaultResponse = children ?? <Outlet />

  if (isPublicRoute) {
    return DefaultResponse
  } else if (!isSignedIn && pathname !== redirectPath) {
    return <Navigate to={redirectPath} replace />
  }

  return DefaultResponse
}

const Pages: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<ErrorPage isAppError={false} />} />
    </Routes>
  )
}

export default Pages
