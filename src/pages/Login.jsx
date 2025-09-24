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
            if (response.data.data.token) {
                setIsLoading(false)
                dispatch({ type: "LOGIN_SUCCESS", payload: response.data.data });
                navigate('/');
            }
            else{
                setIsLoading(false);
                show('error', response.data.message);
            }
        } catch (error) {
            setIsLoading(false);
            if (error.response.status === 404 || error.response.status === 401) {
                show('error', error.response.data.message);
            } else {
                show('error', error.message);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='w-screen h-screen flex flex-col bg-[#E6ECF1] p-6 gap-3 justify-center items-center'>
            <div className='w-full h-[15%] flex flex-col justify-center items-center gap-2'>
                <img src={logo} alt="logo" className='h-[40px] xs:h-[50px]' />
                <h2 className='text-xl xs:text-2xl font-medium capitalize text-center text-(--primary-color)'>Online Assessment Platform</h2>
            </div>
            <Card title='Login to your account' className='w-full rounded-2xl sm:w-2/3 lg:w-2/4 sm:self-center' pt={{ title: 'text-(--secondary-text-color) text-[22px] xs:text-2xl mb-0' }}>
                <form action="" className='flex flex-col gap-4' onSubmit={handleLogin}>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="email" className='font-medium text-base xs:text-xl'>Email</label>
                        <InputText id='email' type='email' placeholder='Enter email' value={email} onChange={handleEmailChange} className='rounded-lg w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(emailError && isErrorView)} />
                        {(emailError && isErrorView) && <small className='text-xs text-red-500'>{emailError}</small>}
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="password" className='font-medium text-base xs:text-xl'>Password</label>
                        <Password id='password' placeholder='Enter password' feedback={false} value={password} onChange={handlePasswordChange} toggleMask className='register_password' pt={{ root: 'w-full', panel: '', input: 'w-full rounded-lg py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none', iconField: 'w-full', info: '', showIcon: 'w-full -mt-2', hideIcon: 'w-full -mt-2' }} invalid={(passwordError && isErrorView)} />
                        {(passwordError && isErrorView) && <small className='text-xs text-red-500'>{passwordError}</small>}
                    </div>
                    <Toast ref={toast} position="top-right" className='h-5' pt={{ root: 'w-[60%]', content: 'p-2', icon: 'w-4 h-4 mt-1', text: 'text-sm xs:text-base', closeButton: 'w-4 h-3 mt-1' }} />
                    <Button type='submit' label='Login' loading={isLoading} className='h-11 text-xl font-bold rounded-lg bg-linear-135 from-(--primary-color-light) from-0% to-(--primary-color) to-100%' pt={{ loadingIcon: 'text-white', label: 'text-white' }} />
                </form>
            </Card>
        </div>
    )
}

export default Login