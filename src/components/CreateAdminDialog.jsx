import React, { useState } from 'react'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { validateEmail, validateName, validatePassword } from '../utils/Validation';
import { Axios } from '../services/Axios';

const CreateAdminDialog = ({ visible, setVisible, show, fetchUsers }) => {
    let [newAdminData, setNewAdminData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    let [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })
    let [isErrorView, setIsErrorView] = useState(false);

    let handleCancel = () => {
        setVisible(false)
        setIsErrorView(false);
        let newAdminData = { firstName: '', lastName: '', email: '', password: '' };
        let newErrors = { firstName: null, lastName: null, email: null, password: null };
        setNewAdminData(newAdminData);
        setErrors(newErrors);
    }

    let handleCreate = async (e) => {
        e.preventDefault();
        let newErrors = {
            firstName: validateName('First Name', newAdminData.firstName),
            lastName: validateName('Last Name', newAdminData.lastName),
            email: validateEmail(newAdminData.email),
            password: validatePassword(newAdminData.password),
        };
        setErrors(newErrors);
        if (newErrors.firstName || newErrors.lastName || newErrors.email || newErrors.password) {
            setIsErrorView(true);
            return;
        }
        else {
            try {
                let response = await Axios.post('/api/users/createAdmin', { ...newAdminData, role: 'Admin' });
                if (response?.data?.success) {
                    show('success', 'Success', 'Admin created successfully');
                    fetchUsers(0,5,'','');
                    setVisible(false)
                    setIsErrorView(false);
                    let adminData = { firstName: '', lastName: '', email: '', password: '' };
                    let errors = { firstName: null, lastName: null, email: null, password: null };
                    setNewAdminData(adminData);
                    setErrors(errors);
                }
                else {
                    show('error', 'Error', response?.data?.message);
                    setVisible(false)
                    setIsErrorView(false);
                    let adminData = { firstName: '', lastName: '', email: '', password: '' };
                    let errors = { firstName: null, lastName: null, email: null, password: null };
                    setNewAdminData(adminData);
                    setErrors(errors);
                }
            } catch (error) {
                console.log(error);
                show('error', 'Error', error?.response?.data.message);
                setVisible(false)
                setIsErrorView(false);
                let adminData = { firstName: '', lastName: '', email: '', password: '' };
                let errors = { firstName: null, lastName: null, email: null, password: null };
                setNewAdminData(adminData);
                setErrors(errors);
            }

        }
    }

    let handleChange = (fieldName, value) => {
        setNewAdminData({ ...newAdminData, [fieldName]: value });
        switch (fieldName) {
            case 'firstName':
                setErrors({ ...errors, [fieldName]: validateName(fieldName, value) })
                break;
            case 'lastName':
                setErrors({ ...errors, [fieldName]: validateName(fieldName, value) })
                break;
            case 'email':
                setErrors({ ...errors, [fieldName]: validateEmail(value) })
                break;
            case 'password':
                setErrors({ ...errors, [fieldName]: validatePassword(value) })
                break;
        }
    }


    return (
        <Dialog header="Create Admin" visible={visible} style={{ width: '50vw' }} pt={{ closeButton: 'hidden',content:'bg-(--header-bg)',header:"bg-(--header-bg)",headerTitle:"text-2xl font-bold", }} >
            <form className='flex flex-col gap-4'>
                <div className='flex flex-col gap-1'>
                    <div className='flex'>
                        <label htmlFor="firstName" className={`${(errors.firstName && isErrorView) ? 'text-red-500' : ''}`}>First Name</label>
                        <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.firstName && isErrorView) ? 'text-red-500' : ''}`}></i>
                    </div>
                    <InputText id='firstName' type='text' placeholder='Enter first name' value={newAdminData.firstName} onChange={(e) => { handleChange('firstName', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.firstName && isErrorView)} />
                    {(errors.firstName && isErrorView) && <small className='text-xs text-red-500'>{errors.firstName}</small>}
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='flex'>
                        <label htmlFor="lastName" className={`${(errors.lastName && isErrorView) ? 'text-red-500' : ''}`}>Last Name</label>
                        <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.lastName && isErrorView) ? 'text-red-500' : ''}`}></i>
                    </div>
                    <InputText id='lastName' type='text' placeholder='Enter last name' value={newAdminData.lastName} onChange={(e) => { handleChange('lastName', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.lastName && isErrorView)} />
                    {(errors.lastName && isErrorView) && <small className='text-xs text-red-500'>{errors.lastName}</small>}
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='flex'>
                        <label htmlFor="email" className={`${(errors.email && isErrorView) ? 'text-red-500' : ''}`}>Email</label>
                        <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.email && isErrorView) ? 'text-red-500' : ''}`}></i>
                    </div>
                    <InputText id='email' type='email' placeholder='Enter email' value={newAdminData.email} onChange={(e) => { handleChange('email', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.email && isErrorView)} />
                    {(errors.email && isErrorView) && <small className='text-xs text-red-500'>{errors.email}</small>}
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='flex'>
                        <label htmlFor="password" className={`${(errors.password && isErrorView) ? 'text-red-500' : ''}`}>Password</label>
                        <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.password && isErrorView) ? 'text-red-500' : ''}`}></i>
                    </div>
                    <Password id='password' placeholder='Enter password' feedback={false} value={newAdminData.password} onChange={(e) => { handleChange('password', e.target.value) }} toggleMask className='register_password' pt={{ root: 'w-full', panel: '', input: 'w-full rounded-lg py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none', iconField: 'w-full', info: '', showIcon: 'w-full -mt-2', hideIcon: 'w-full -mt-2' }} invalid={(errors.password && isErrorView)} />
                    {(errors.password && isErrorView) && <small className='text-xs text-red-500'>{errors.password}</small>}
                </div>
                <div className='flex items-center justify-end gap-2 '>
                    <Button type='button' outlined label="Cancel" icon="pi pi-times" onClick={handleCancel} className="text-(--primary-color)" />
                    <Button label="Create" onClick={handleCreate} icon="pi pi-check" autoFocus className='bg-(--primary-color-light) duration-700 hover:bg-(--primary-color)' />
                </div>
            </form>
        </Dialog>
    )
}

export default CreateAdminDialog