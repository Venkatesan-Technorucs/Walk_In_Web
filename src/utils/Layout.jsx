import React, { use } from 'react'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Layout = () => {
  const { state } = useAuth();
  return (
    <div className='min-h-screen h-full flex flex-col'>
        <Header name={state?.user?.name} role={state?.user?.role} />
        <main className='w-full h-full flex-1 bg-[#E6ECF1] p-4'>
            <Outlet />
        </main>
    </div>
  )
}

export default Layout