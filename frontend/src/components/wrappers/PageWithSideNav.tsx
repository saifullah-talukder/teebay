import React, { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { sidenavRoutes } from '../../config'
import { client, updateAuthToken } from '../../graphql/client'
import PrimaryActionButton from '../shared/PrimaryActionButton'

const Sidenav: React.FC = () => {
  const navigate = useNavigate()

  const handleSignOut = () => {
    updateAuthToken(null)
    client.resetStore()
    navigate('/signin')
  }

  return (
    <div className="sticky top-0 w-full">
      <div className="h-screen w-full py-4 bg-gray-100">
        <div className="flex h-full w-full flex-col justify-between transition-all duration-200 items-start px-4">
          <div className="w-full flex flex-col gap-y-3">
            <div className="flex gap-x-4 items-center mb-4">
              <img src="/ecommerce-logo.svg" alt="Teebay Logo" className="w-10 h-auto" />
              <h1 className="text-3xl text-blue-700 font-semibold">TeeBay</h1>
            </div>
            {sidenavRoutes.map(route => (
              <PrimaryActionButton
                key={route.path}
                className="bg-blue-100 hover:bg-blue-200 shadow-sm rounded-md text-blue-700"
                label={route.title}
                onClick={() => navigate(route.path)}
              />
            ))}
          </div>
          <div className="sticky bottom-0 backdrop-blur-sm w-full">
            <PrimaryActionButton
              className="w-full bg-blue-100 hover:bg-blue-200 shadow-sm rounded-md text-blue-700"
              label="Sign Out"
              onClick={handleSignOut}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

type LayoutProps = {
  children: ReactNode
}

const PageWithSideNav: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative flex">
      <div className="w-60 flex-none transition-all duration-300">
        <Sidenav />
      </div>

      <div className="w-full pb-4 bg-slate-50">{children}</div>
    </div>
  )
}

export default PageWithSideNav
