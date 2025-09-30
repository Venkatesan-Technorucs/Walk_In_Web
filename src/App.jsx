import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/User/Home'
import Logout from './pages/User/Logout'
import Dashboard from './pages/Admin/Dashboard'
import TakeTest from './pages/User/TakeTest'
import Register from './pages/Register/Register'
import Login from './pages/Login'
import AuthProvider from './contexts/AuthContext'
import PrivateRoute from './services/PrivateRoute'
import TestDetails from './pages/Admin/TestDetails'
import UserDetails from './pages/Admin/UserDetails'
import UserTestDetails from './pages/Admin/UserTestDetails'
import CreateTest from './pages/Admin/CreateTest'
import Layout from './utils/Layout'
import ToastProvider from './contexts/ToastContext'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/' element={<Layout />} >
              <Route element={<PrivateRoute requiredRole={['Admin', 'SuperAdmin']} />}>
                <Route path='/' element={<Dashboard />} />
                <Route path='/create/test' element={<CreateTest />} />
                <Route path='/test/details/:id' element={<TestDetails />} />
                <Route path='/user/details/:id' element={<UserDetails />} />
                <Route path='/user/test/details/:userId/:testId' element={<UserTestDetails />} />
              </Route>
              <Route element={<PrivateRoute requiredRole={['Applicant']} />}>
                <Route path='/home' element={<Home />} />
                <Route path='/take-test/:id' element={<TakeTest />} />
              </Route>
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App