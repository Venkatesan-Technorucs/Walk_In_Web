import React, { useRef, useState } from 'react'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { validateEmail, validatePassword } from '../utils/Validation';
import logo from '../assets/logo_with_title_light.png';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Axios } from '../services/Axios';

const Login = () => {
    let navigate = useNavigate();
    let { dispatch } = useAuth();
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [emailError, setEmailError] = useState(null);
    let [passwordError, setPasswordError] = useState(null);
    const toast = useRef(null);
    let [isLoading, setIsLoading] = useState(false);
    let [isErrorView, setIsErrorView] = useState(false);


    let handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError(validateEmail(e.target.value));
    }

    let handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError(validatePassword(e.target.value));
    }


    const show = (severity, msg) => {
        toast.current.show({ severity: severity, summary: 'Error', detail: msg });
    };

    let handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        let newEmailError = validateEmail(email);
        let newPasswordError = validatePassword(password);
        setEmailError(newEmailError);
        setPasswordError(newPasswordError);
        if (newEmailError || newPasswordError) {
            setIsErrorView(true);
            setIsLoading(false);
            return;
        }
        try {
            let payload = {
                email: email,
                password: password
            }
            let response = await Axios.post('/api/auth/login', payload);
            if (response.data.success) {
                setIsLoading(false)
                dispatch({ type: "LOGIN_SUCCESS", payload: response.data.data });
                navigate('/');
            }
            else {
                setIsLoading(false);
                show('error', response.data.message);
            }
        } catch (error) {
            setIsLoading(false);
            show('error', error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='w-screen h-screen flex flex-col bg-gray-200 justify-center items-center gap-8'>
            <div className='flex justify-center items-center'>
                <p className='text-gray-600 font-medium text-xl xs:text-2xl'>Online Assessment Platform</p>
            </div>

            <Card className='w-full max-w-[400px] rounded-lg shadow-sm'>
                <div className='flex flex-col justify-center items-center gap-4 mb-2'>
                    <div className='flex items-center justify-center'>
                        <img src={logo} alt="logo" className='h-[40px] xs:h-[40px]' />
                    </div>
                    <h2 className='text-2xl font-medium text-[#4CAF50]'>Login to your account</h2>
                </div>

                <form className='flex flex-col gap-4' onSubmit={handleLogin}>
                    <div className='flex flex-col gap-2 w-full'>
                        <label htmlFor="email" className='text-gray-500 text-md'>Email</label>
                        <InputText
                            id='email'
                            type='email'
                            value={email}
                            onChange={handleEmailChange}
                            className='rounded-md w-full py-2 bg-gray-100 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none'
                            pt={{ input: 'p-3 w-full ' }}
                            placeholder='Enter your email'
                        />
                        {(emailError && isErrorView) && <small className='text-red-500'>{emailError}</small>}
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <label htmlFor="password" className='text-gray-500 text-md'>Password</label>
                        <Password
                            id='password'
                            value={password}
                            onChange={handlePasswordChange}
                            className='w-full rounded-md'
                            feedback={false}
                            placeholder='Enter your password'
                            pt={{ input: 'w-full bg-gray-100 rounded-md py-2 bg-gray-100 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' }}
                        />
                        {(passwordError && isErrorView) && <small className='text-red-500'>{passwordError}</small>}
                    </div>

                    <Button
                        type='submit'
                        label='Login'
                        loading={isLoading}
                        className='w-full p-3 mt-2 bg-[#4CAF50] hover:bg-[#45a049] border-none'
                    />
                </form>
            </Card>
            <Toast ref={toast} position="top-right" />
        </div>
    )
}

export default Login