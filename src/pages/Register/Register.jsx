import React, { useEffect, useRef, useState } from 'react'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { CascadeSelect } from 'primereact/cascadeselect';
import { Toast } from 'primereact/toast';
import logo from '../../assets/logo_with_title_light.png'
import { validateEmail, validateName, validateOptionalName, validatePhoneNumber, validateSkills } from '../../utils/Validation'
import { useNavigate } from 'react-router-dom';
import { Axios } from '../../services/Axios';
import { useAuth } from '../../contexts/AuthContext';
import cities from '../../dataset/rawCities.json'
import { transformData } from '../../utils/transformData';
import '../Register/Register.css'
import { ProgressSpinner } from 'primereact/progressspinner';
import AutoComplete from '../../components/AutoComplete';

const Register = () => {
    const toast = useRef(null);
    let { dispatch } = useAuth();
    let navigate = useNavigate();
    let [isErrorView, setIsErrorView] = useState(false);
    let [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        city: '',
        skills: [],
        referredBy: '',
        role: 'Applicant'
    });
    let [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phNumber: '',
        skills: '',
        referredBy: ''
    });
    let [todayTestPresent, setTodayTestPresent] = useState(false);
    let [todayTestId, setTodayTestId] = useState(0);
    let [totalTests, setTotalTests] = useState(0);
    let [isLoading, setIsLoading] = useState(true);
    let [isBtnClicked, setIsBtnClicked] = useState(false);
    let [msg, setMsg] = useState('');
    const structuredCities = transformData(cities);

    const [typedSkill, setTypedSkill] = useState('');
    const [filteredSkills, setFilteredSkills] = useState([]);

    useEffect(() => {
        let fetchTests = async () => {
            try {
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');

                const formattedDate = `${yyyy}-${mm}-${dd}`;

                let payload = {
                    date: formattedDate,
                    tests_page: false
                }
                let response = await Axios.post('/api/tests/testbyDate', payload);
                if (response.data.success) {
                    setTodayTestPresent(response.data.data.tests);
                    if (response.data.data.tests) {
                        setTotalTests(response.data.data.no_of_tests);
                        if (response.data.data.no_of_tests < 2) {
                            setTodayTestId(response.data.data.testId);
                        }
                    } else {
                        setMsg(response.data.message);
                    }
                } else {
                    setMsg(response.data.message);
                }
            } catch (error) {
                setMsg(error.response.data.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTests();

    }, []);


    const show = (severity, msg) => {
        toast.current.show({ severity: severity, summary: 'Error', detail: msg });
    };

    const handleTyping = async (e) => {
        const value = e.target.value;
        setTypedSkill(value);

        if (!value.trim()) {
            setFilteredSkills([]);
            return;
        }

        try {
            const res = await Axios.get(`/api/users/getAllSkills?skillName=${value}`);
            setFilteredSkills(res?.data?.data?.skills || []);
        } catch (err) {
            if (err.status === 404) {
                setFilteredSkills([]);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " " || e.key === ",") {
            e.preventDefault();

            if (!typedSkill.trim()) return;

            if (!registerData.skills.find(s => s.skillName === typedSkill)) {
                setRegisterData({ ...registerData, skills: [...registerData.skills, { skillName: typedSkill }] });
            }
            setTypedSkill('');
            setFilteredSkills([]);
        }
    };


    const handleSelectSuggestion = (skill) => {
        if (!registerData.skills.find(s => s.skillName === skill.skillName)) {
            setRegisterData({ ...registerData, skills: [...registerData.skills, skill] });
        }
        setTypedSkill('');
        setFilteredSkills([]);
    };

    const removeSkill = (skillName) => {
        let updatedSkills = registerData.skills.filter(s => s.skillName !== skillName)
        setRegisterData({ ...registerData, skills: updatedSkills });
    };

    let handleChange = (fieldName, value) => {
        setRegisterData({ ...registerData, [fieldName]: value });
        switch (fieldName) {
            case 'firstName':
                setErrors({ ...errors, [fieldName]: validateName('First Name', value) })
                break;
            case 'lastName':
                setErrors({ ...errors, [fieldName]: validateName('Last Name', value) })
                break;
            case 'email':
                setErrors({ ...errors, [fieldName]: validateEmail(value) })
                break;
            case 'phoneNumber':
                setErrors({ ...errors, [fieldName]: validatePhoneNumber(value) })
                break;
            case 'skills':
                setErrors({ ...errors, [fieldName]: validateSkills(value)})
                break;
        }
    }


    let handleRegister = async (e) => {
        e.preventDefault();
        setIsBtnClicked(true);
        let firstNameError = validateName('First Name', registerData.firstName);
        let lastNameError = validateName('Last Name', registerData.lastName);
        let emailError = validateEmail(registerData.email);
        let phNumberError = validatePhoneNumber(registerData.phoneNumber);
        let skillsError = validateSkills(registerData.skills);
        let referredByError = validateOptionalName('Referred By', registerData.referredBy);
        let newErrors = { firstName: firstNameError, lastName: lastNameError, email: emailError, phNumber: phNumberError, skills: skillsError, referredBy: referredByError };
        setErrors(newErrors);
        if (firstNameError || lastNameError || emailError || phNumberError || skillsError || referredByError) {
            setIsErrorView(true);
            setIsBtnClicked(false);
            return;
        } else {
            try {
                let response = await Axios.post('/api/auth/register', registerData);
                if (response?.data.success) {
                    localStorage.setItem('token', response?.data?.data?.token);
                    if (totalTests < 2) {
                        let startTestResponse = await Axios.post('/api/tests/startAttempt', { testId: todayTestId }, { headers: { Authorization: `Bearer ${response?.data?.data?.token}` } });
                        let registeredUser = { ...response?.data?.data, test: { ...startTestResponse?.data?.data } }
                        dispatch({ type: "TEST_STARTED", payload: registeredUser });
                        setIsBtnClicked(false);
                        navigate(`/take-test/${todayTestId}`)
                    } else {
                        dispatch({ type: "REGISTER_SUCCESSFULL", payload: response.data.data });
                        setIsBtnClicked(false);
                        navigate('/home');
                    }
                } else {
                    setIsBtnClicked(false);
                    show('warn', response?.data?.message)
                }
            } catch (error) {
                setIsBtnClicked(false);
                show('error', error.response.data.message);
            }
        }
    }

    const dialogHeaderContent = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <img src={logo} alt="logo" className='w-[200px] h-[30px] xs:h-[50px]' />
        </div>
    );

    const dialogFooterContent = (
        <div>
            <Button label="Ok" icon="pi pi-check" onClick={() => window.open('https://www.technorucs.com/', '_self')} autoFocus className='bg-(--primary-color-light) duration-700 hover:bg-(--primary-color)' />
        </div>
    );


    if (isLoading) {
        return (
            <div className='bg-(--header-bg) w-screen h-screen flex justify-center items-center'>
                <ProgressSpinner className='h-16' />
            </div>
        )
    }
    if (!todayTestPresent) {
        return (
            <div className="w-screen h-screen flex justify-center items-center">
                <Dialog header={dialogHeaderContent} footer={dialogFooterContent} visible={true} className='w-[50%] h[50%]' pt={{ root: 'text-base xs:text-xl md:text-2xl', content: 'pt-[2px] pb-[8px]', header: 'p-4', closeButton: 'hidden', footer: 'p-2' }}>
                    <p className="m-0">{msg}</p>
                </Dialog>
            </div>
        )
    } else {
        return (
            <div className='w-full h-full flex flex-col justify-center items-center bg-[#E6ECF1] p-6 gap-3'>
                <div className='w-full h-[15%] flex flex-col justify-center items-center gap-2'>
                    <img src={logo} alt="logo" className='h-[40px] xs:h-[50px]' />
                    <h2 className='text-xl xs:text-2xl font-medium capitalize text-center text-(--primary-color)'>Online Assessment Platform</h2>
                </div>
                <Card title='Create your account' className='w-full h-full rounded-2xl sm:w-2/3 lg:w-2/4 sm:self-center' pt={{ title: 'text-(--secondary-text-color) text-[22px] xs:text-2xl mb-0' }}>
                    <form action="" className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <div className='flex'>
                                <label htmlFor="firstName" className={`${(errors.firstName && isErrorView) ? 'text-red-500' : ''}`}>First Name</label>
                                <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.firstName && isErrorView) ? 'text-red-500' : ''}`}></i>
                            </div>
                            <InputText type='text' placeholder='Enter your first name' value={registerData.firstName} onChange={(e) => { handleChange('firstName', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.firstName && isErrorView)} />
                            {(errors.firstName && isErrorView) && <small className='text-xs text-red-500'>{errors.firstName}</small>}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='flex'>
                                <label htmlFor="lastName" className={`${(errors.lastName && isErrorView) ? 'text-red-500' : ''}`}>Last Name</label>
                                <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.lastName && isErrorView) ? 'text-red-500' : ''}`}></i>
                            </div>
                            <InputText type='text' placeholder='Enter your last name' value={registerData.lastName} onChange={(e) => { handleChange('lastName', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.lastName && isErrorView)} />
                            {(errors.lastName && isErrorView) && <small className='text-xs text-red-500'>{errors.lastName}</small>}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='flex'>
                                <label htmlFor="email" className={`${(errors.email && isErrorView) ? 'text-red-500' : ''}`}>Email</label>
                                <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.email && isErrorView) ? 'text-red-500' : ''}`}></i>
                            </div>
                            <InputText id='email' type='email' placeholder='Enter your email' value={registerData.email} onChange={(e) => { handleChange('email', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.email && isErrorView)} />
                            {(errors.email && isErrorView) && <small className='text-xs text-red-500'>{errors.email}</small>}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='flex' >
                                <label htmlFor="phNumber" className={`${(errors.phNumber && isErrorView) ? 'text-red-500' : ''}`}>Phone Number</label>
                                <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.phNumber && isErrorView) ? 'text-red-500' : ''}`}></i>
                            </div>
                            <InputText id='phNumber' placeholder='Enter your phone number' keyfilter={'pint'} maxLength={10} value={registerData.phoneNumber} onChange={(e) => { handleChange('phoneNumber', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.phNumber && isErrorView)} />
                            {(errors.phNumber && isErrorView) && <small className='text-xs text-red-500'>{errors.phNumber}</small>}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="phNumber">City</label>
                            <div className='border-gray-400  border-1 rounded-sm hover:border-black focus-within:border-2 focus-within:hover:border-(--primary-color) focus-within:border-(--primary-color)'>
                                <CascadeSelect value={registerData.city} onChange={(e) => handleChange('city', e.value.cname)} options={structuredCities} appendTo={'self'}
                                    optionLabel="cname" optionGroupLabel="name" optionGroupChildren={['cities']}
                                    className="text-black register-select border-none focus-within:border-0 focus-within:shadow-none " placeholder="Select your city"
                                    pt={{ root: 'w-[100%]', label: 'py-2', sublist: 'max-h-60 overflow-auto', text: 'text-black', list: 'w-30 h-60 overflow-auto', panel: 'mt-1' }}
                                />
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="email">Referred By</label>
                            <InputText id='referredBy' type='text' placeholder='Enter referrer name' value={registerData.referredBy} onChange={(e) => { handleChange('referredBy', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.referredBy && isErrorView)} />
                            {(errors.referredBy && isErrorView) && <small className='text-xs text-red-500'>{errors.referredBy}</small>}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='flex'>
                                <label htmlFor="skills" className={`${(errors.skills && isErrorView) ? 'text-red-500' : ''}`}>Skills</label>
                                <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.skills && isErrorView) ? 'text-red-500' : ''}`}></i>
                            </div>
                            <AutoComplete placeholder={"Enter your skills"} label='skillName' id='skillId' value={typedSkill} onChange={handleTyping} onKeyDown={handleKeyDown} list={filteredSkills} selectedList={registerData.skills} onSelect={handleSelectSuggestion} onRemove={removeSkill} />
                            {(errors.skills && isErrorView) && <small className='text-xs text-red-500'>{errors.skills}</small>}
                        </div>
                        <Toast ref={toast} position="top-right" className='h-5' pt={{ root: 'w-[60%]', content: 'p-2', icon: 'w-4 h-4 mt-1', text: 'text-sm xs:text-base', closeButton: 'w-4 h-3 mt-1' }} />
                        <Button label='Register' loading={isBtnClicked} onClick={handleRegister} className='bg-(--primary-color-light) duration-700 hover:bg-(--primary-color)' pt={{ loadingIcon: "text-white", label: "text-white" }} />
                    </form>
                </Card>
            </div>
        )
    }
}

export default Register
