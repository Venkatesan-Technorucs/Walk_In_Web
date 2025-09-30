import { Card } from 'primereact/card'
import React, { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTimeout } from 'primereact/hooks';
import { useNavigate } from 'react-router-dom';

const logout = () => {
  let { dispatch } = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/register');
      dispatch({ type: "LOGOUT" });
    }, 4000);

    return () => clearTimeout(timer);
  }, [])

  return (
    <div className='min-w-screen min-h-screen flex justify-center items-center bg-(--header-bg)'>
      <Card className='w-[80%] h-[50%] xs:w-[70%] xs:h-[40%] sm:w-[60%] md:w-[50%] rounded-2xl p-5' pt={{ body: 'p-0 w-full h-full flex justify-center items-center', }}>
        <div className='flex flex-col items-center justify-center gap-2'>
          <i className='pi pi-check-circle text-[90px] text-(--primary-color)'></i>
          <h1 className='text-4xl font-bold'>Thank You</h1>
          <p className='text-center'>Your response has beed recorded</p>
          <p className='text-center'>We will reach you out shortly</p>
          <p>Connect with us</p>
          <div className='flex gap-2 items-center bg-gray-300 p-2 rounded-2xl'>
            <i className='pi pi-globe hover:text-(--primary-color) hover:text-xl' onClick={() => { window.open('https://www.technorucs.com/', '_self') }}></i>
            <i className='pi pi-linkedin hover:text-(--primary-color) hover:text-xl' onClick={() => { window.open('https://in.linkedin.com/company/technorucs', '_self') }}></i>
            <i className='pi pi-instagram hover:text-(--primary-color) hover:text-xl' onClick={() => { window.open('https://www.instagram.com/techno_rucs', '_self') }}></i>
            <i className='pi pi-youtube text-lg hover:text-(--primary-color) hover:text-xl' onClick={() => { window.open('https://www.youtube.com/@technorucs8286', '_self') }}></i>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default logout