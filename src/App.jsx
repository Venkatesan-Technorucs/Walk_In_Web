import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/User/Home'
import Logout from './pages/User/Logout'
import Dashboard from './pages/Admin/Dashboard'
import TakeTest from './pages/User/TakeTest'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/take-test/:id' element={<TakeTest />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/logout' element={<Logout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App