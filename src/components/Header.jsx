import React from 'react'

const Header = () => {
    return (
        <div className='w-full h-[80px] border-b-2 flex flex-col xs:flex-row justify-between items-center py-2 border-b-gray-300 bg-(--header-bg) gap-2 xs:px-[5%] xs:py-4'>
            <img src="./src/assets/logo_with_title_light.png" alt="logo" className='h-[30px] xs:h-[50px]' />
            <h1 className='capitalize font-medium text-lg xs:text-2xl pl-4 xs:text-center xs:pl-0'>Welcome, Chandiraguru</h1>
        </div>
    )
}

export default Header