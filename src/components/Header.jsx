import React from 'react'
import logo from "../assets/logo_with_title_light.png"
import { Button } from 'primereact/button'
import { useAuth } from '../contexts/AuthContext';

const Header = ({name, role}) => {
    const { dispatch } = useAuth();
    
    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    }
    return (
        <div className='w-full h-[100px] border-b-2 flex flex-col sm:flex-row justify-center xs:justify-between items-center py-2 border-b-gray-300 bg-(--header-bg) gap-2 xs:px-[5%] xs:py-4'>
            <img src={logo} alt="logo" className='h-[30px] xs:h-[40px] sm:h-[50px]' />
            <div className='w-full flex justify-between sm:gap-3 sm:items-center sm:justify-end'>
            <h1 className='capitalize font-medium text-base xs:text-xl sm:text-2xl pl-4 xs:text-center xs:pl-0'>Welcome, {name}</h1>
            {(role==='Admin' || role=== 'SuperAdmin') && <Button label='Logout' className='w-16 h-8 xs:w-18 xs:h-10 text-sm xs:text-lg font-medium rounded-lg flex items-center justify-center bg-linear-135 from-(--primary-color-light) from-0% to-(--primary-color) to-100%' onClick={handleLogout}/>}
            </div>
        </div>
    )
}

export default Header