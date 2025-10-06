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
import { useToast } from '../../contexts/ToastContext';
import { Avatar } from 'primereact/avatar';

const Register = () => {
    let { showToast } = useToast();
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

    const handleBlur = () => {
        if (!typedSkill.trim()) return;

        if (!registerData.skills.find(s => s.skillName === typedSkill)) {
            setRegisterData({ ...registerData, skills: [...registerData.skills, { skillName: typedSkill }] });
        }
        setTypedSkill('');
        setFilteredSkills([]);
    }


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
                setErrors({ ...errors, [fieldName]: validateSkills(value) })
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
                    showToast('warn', response?.data?.message)
                }
            } catch (error) {
                setIsBtnClicked(false);
                showToast('error', error.response.data.message);
            }
        }
    }

    const dialogHeaderContent = (
        <div className="flex flex-col items-center justify-center gap-2">
            <Avatar 
                icon="pi pi-exclamation-circle text-2xl text-green-500" 
                size="normal" 
                shape="circle" 
                className='!w-15 !h-15 bg-green-200'
            />
        </div>
    );

    const dialogFooterContent = (
        <div className='w-full flex justify-center items-center px-4'>
            <Button 
                label="EXIT"  
                onClick={() => window.open('https://www.technorucs.com/', '_self')} 
                autoFocus 
                className='w-full max-w-[300px] rounded-lg bg-[#4CAF50] text-white font-semibold py-3 duration-300 hover:bg-(--primary-color-light) shadow-none border-none' 
            />
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
            <div className="w-screen h-screen flex justify-center items-center bg-gray-400">
                {/* <img src={logo} alt="logo" className='w-[200px] h-[30px] xs:h-[50px] bg-white' /> */}
                <Card header={dialogHeaderContent} footer={dialogFooterContent} visible={true} className='w-[30%] lg:h-[30%] h-[40%] p-4' pt={{ root: 'min-w-[300px] min-h-[200px] text-base xs:text-xl md:text-2xl', content: 'pt-[2px] pb-[8px]', closeButton: 'hidden', }}>
                    <div className='flex flex-col items-center justify-center gap-2 h-full'>
                        <p className="m-0 text-lg font-semibold">No Test Available</p>
                        <p className="m-0 text-sm text-gray-500 text-center">There is no test scheduled for today. Please check back later or contact support for more information.</p>
                    </div>
                </Card>
            </div>
        )
    } else {
        return (
            <div className='w-full h-full flex flex-col justify-center items-center bg-[#E6ECF1] p-6 gap-8'>
                <div className='w-full h-[15%] flex flex-col justify-center items-center'>
                    <h2 className='text-xl xs:text-2xl font-medium capitalize text-center text-gray-600'>Online Assessment Platform</h2>
                </div>
                <Card className='w-full gap-2 rounded-2xl sm:w-1/3 lg:w-2/5 sm:self-center' pt={{ title: 'text-(--secondary-text-color) text-[22px] xs:text-2xl mb-0' }}>
                    <div className='flex flex-col justify-center mb-4'>
                        <div className='flex flex-col justify-center items-center gap-2 mb-3'>
                            <img src={logo} alt="logo" className='h-[40px] xs:h-[40px]' />
                        </div>
                        <h3 className='text-gray-700 text-sm xs:text-base text-center mb-6'>Please fill the details below to register and start your test.</h3>
                        <p className='text-gray-500 text-xs'>Fields marked with <span className='inline text-red-500'>*</span> are required</p>
                    </div>
                    <form action="" className='flex flex-col gap-4'>
                        <div className='flex gap-4 w-full'>
                            <div className='flex flex-col gap-1 w-1/2'>
                                <div className='flex gap-1'>
                                    <label htmlFor="firstName" className={`${(errors.firstName && isErrorView) ? 'text-red-500' : ''}`}>First Name</label>
                                    <i className={`pi pi-asterisk text-[8px] mt-1 text-red-500`}></i>
                                </div>
                                <span className="p-input-icon-left w-full flex items-center">
                                    <i className="pi pi-user mx-2 text-gray-400" />
                                    <InputText type='text' placeholder='Enter your first name' value={registerData.firstName} onChange={(e) => { handleChange('firstName', e.target.value) }} className='w-full py-2 bg-gray-100 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none pl-8' invalid={(errors.firstName && isErrorView)} />
                                </span>
                                {(errors.firstName && isErrorView) && <small className='text-xs text-red-500'>{errors.firstName}</small>}
                            </div>
                            <div className='flex flex-col gap-1 w-1/2'>
                                <div className='flex gap-1'>
                                    <label htmlFor="lastName" className={`${(errors.lastName && isErrorView) ? 'text-red-500' : ''}`}>Last Name</label>
                                    <i className={`pi pi-asterisk text-[8px] mt-1 text-red-500`}></i>
                                </div>
                                <span className="p-input-icon-left w-full flex items-center">
                                    <i className="pi pi-user mx-2 text-gray-400" />
                                    <InputText type='text' placeholder='Enter your last name' value={registerData.lastName} onChange={(e) => { handleChange('lastName', e.target.value) }} className='w-full py-2 bg-gray-100 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none pl-8' invalid={(errors.lastName && isErrorView)} />
                                </span>
                                {(errors.lastName && isErrorView) && <small className='text-xs text-red-500'>{errors.lastName}</small>}
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='flex gap-1'>
                                <label htmlFor="email" className={`${(errors.email && isErrorView) ? 'text-red-500' : ''}`}>Email</label>
                                <i className={`pi pi-asterisk text-[8px] mt-1 text-red-500`}></i>
                            </div>
                            <span className="p-input-icon-left w-full flex items-center">
                                <i className="pi pi-envelope mx-2 text-gray-400" />
                                <InputText id='email' type='email' placeholder='Enter your email' value={registerData.email} onChange={(e) => { handleChange('email', e.target.value) }} className='w-full py-2 bg-gray-100 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none pl-8' invalid={(errors.email && isErrorView)} />
                            </span>
                            {(errors.email && isErrorView) && <small className='text-xs text-red-500'>{errors.email}</small>}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='flex gap-1'>
                                <label htmlFor="phNumber" className={`${(errors.phNumber && isErrorView) ? 'text-red-500' : ''}`}>Phone Number</label>
                                <i className={`pi pi-asterisk text-[8px] mt-1 text-red-500`}></i>
                            </div>
                            <span className="p-input-icon-left w-full flex items-center">
                                <i className="pi pi-phone mx-2 text-gray-400" />
                                <InputText id='phNumber' placeholder='Enter your phone number' keyfilter={'pint'} maxLength={10} value={registerData.phoneNumber} onChange={(e) => { handleChange('phoneNumber', e.target.value) }} className='w-full py-2 bg-gray-100 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none pl-8' invalid={(errors.phNumber && isErrorView)} />
                            </span>
                            {(errors.phNumber && isErrorView) && <small className='text-xs text-red-500'>{errors.phNumber}</small>}
                        </div>
                        <div className='flex lg:flex-row xs:flex-col gap-4 w-full'>
                            <div className='flex flex-col gap-1 lg:w-1/2 xs:w-full'>
                                <label htmlFor="phNumber">City</label>
                                <div className='flex items-center gap-1 bg-gray-100 border-gray-400  border-1 rounded-sm hover:border-black focus-within:border-2 focus-within:hover:border-(--primary-color) focus-within:border-(--primary-color)'>
                                    <i className="pi pi-map-marker mx-2 text-gray-400 bg-gray-100" />
                                    <CascadeSelect value={registerData.city} onChange={(e) => handleChange('city', e.value.cname)} options={structuredCities} appendTo={'self'}
                                        optionLabel="cname" optionGroupLabel="name" optionGroupChildren={['cities']}
                                        className="text-black bg-gray-100 register-select border-none focus-within:border-0 focus-within:shadow-none" placeholder="Select your city"
                                        pt={{ root: 'w-[100%]', label: 'px-0.5 py-2', sublist: 'max-h-60 overflow-auto', text: 'text-black', list: 'w-30 h-60 overflow-auto mr-2', panel: 'mt-1' }}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-1 lg:w-1/2 xs:w-full'>
                                <div className='flex items-center gap-0.5'>
                                    <label htmlFor="email">Referred By</label>
                                    <i title='Fill the name of the person who referred you' className='pi pi-question-circle mx-2 text-gray-400 cursor-pointer'></i>
                                </div>
                                <span className="p-input-icon-left w-full flex items-center">
                                    <i className="pi pi-user mx-2 text-gray-400" />
                                    <InputText id='referredBy' type='text' placeholder='Enter referrer name (if any)' value={registerData.referredBy} onChange={(e) => { handleChange('referredBy', e.target.value) }} className='w-full py-2 bg-gray-100 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none pl-8' invalid={(errors.referredBy && isErrorView)} />
                                </span>
                                {(errors.referredBy && isErrorView) && <small className='text-xs text-red-500'>{errors.referredBy}</small>}
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='flex items-center gap-0.5'>
                                <div className='flex gap-1'>
                                    <label htmlFor="skills" className={`${(errors.skills && isErrorView) ? 'text-red-500' : ''}`}>Skills</label>
                                    <i className={`pi pi-asterisk text-[8px] mt-1 text-red-500`}></i>
                                </div>
                                <i title='Select or Fill in your skills' className='pi pi-question-circle mx-2 text-gray-400 cursor-pointer'></i>
                            </div>
                            <AutoComplete placeholder={"Enter your skills"} label='skillName' id='skillId' value={typedSkill} onChange={handleTyping} onKeyDown={handleKeyDown} list={filteredSkills} selectedList={registerData.skills} onSelect={handleSelectSuggestion} onRemove={removeSkill} onBlur={handleBlur} />
                            {(errors.skills && isErrorView) && <small className='text-xs text-red-500'>{errors.skills}</small>}
                        </div>
                        <Button label='Register' loading={isBtnClicked} onClick={handleRegister} className='bg-(--primary-color-light) duration-700 hover:bg-(--primary-color)' pt={{ loadingIcon: "text-white", label: "text-white" }} />
                    </form>
                </Card>
            </div>
        )
    }
}

export default Register
