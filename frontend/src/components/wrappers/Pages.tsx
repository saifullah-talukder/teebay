import { ReactNode } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { publicRoutes } from '../../config'
import AllProducts from '../../pages/AllProducts'
import BorrowedProducts from '../../pages/BorrowedProducts'
import BoughtProducts from '../../pages/BoughtProducts'
import CreateProduct from '../../pages/CreateProduct'
import EditProduct from '../../pages/EditProduct'
import ErrorPage from '../../pages/ErrorPage'
import LentProducts from '../../pages/LentProducts'
import MyProducts from '../../pages/MyProducts'
import ProductDetails from '../../pages/ProductDetails'
import SignIn from '../../pages/SignIn'
import SignUp from '../../pages/SignUp'
import SoldProducts from '../../pages/SoldProducts'
import PageWithSideNav from './PageWithSideNav'

type ProtectedRouteProps = {
  children?: ReactNode
  redirectPath?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectPath = '/signin' }) => {
  const isSignedIn = true
  const { pathname } = useLocation()
  const isPublicRoute = publicRoutes.some(route => route === pathname)

  const defaultResponse = children ?? <Outlet />

  if (isPublicRoute) {
    return <>{defaultResponse}</>
  } else if (!isSignedIn && pathname !== redirectPath) {
    return <Navigate to={redirectPath} replace />
  }

  return <PageWithSideNav>{defaultResponse}</PageWithSideNav>
}

const Pages: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="/" element={<AllProducts />} />
        <Route path="/product">
          <Route path=":id">
            <Route index={true} element={<ProductDetails />} />
            <Route path="edit" element={<EditProduct />} />
          </Route>
          <Route path="all" element={<AllProducts />} />
          <Route path="create" element={<CreateProduct />} />
          <Route path="my" element={<MyProducts />} />
          <Route path="bought" element={<BoughtProducts />} />
          <Route path="sold" element={<SoldProducts />} />
          <Route path="borrowed" element={<BorrowedProducts />} />
          <Route path="lent" element={<LentProducts />} />
        </Route>
      </Route>
      <Route path="*" element={<ErrorPage isAppError={false} />} />
    </Routes>
  )
}

export default Pages
