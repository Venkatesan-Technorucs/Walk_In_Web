import React, { useEffect, useRef, useState } from 'react'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card'
import { Checkbox } from 'primereact/checkbox';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Calendar } from 'primereact/calendar';
import { validateDate, validateField, validateOptions, validateTestQuestion } from '../../utils/Validation';
import { Axios } from '../../services/Axios';
import { classNames } from 'primereact/utils';
import QuestionCard from '../../components/QuestionCard';
import { pt } from '../../utils/pt';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateTest = () => {
    let navigate = useNavigate();
    const toast = useRef(null);
    let { state } = useAuth();
    let [visible, setVisible] = useState(false);
    let [tests, setTests] = useState([]);
    let [questionData, setQuestionData] = useState({
        qtitle: '',
        isMultiSelect: '',
        options: [{ title: '', isCorrect: false }, { title: '', isCorrect: false }, { title: '', isCorrect: false }, { title: '', isCorrect: false }],
    });
    let [testData, setTestData] = useState({
        title: '',
        duration: '',
        department: '',
        startDate: '',
        endDate: '',
        assignedQuestionIds: [],
        questions: [questionData],
        numberOfQuestions: ''
    });
    let [errors, setErrors] = useState({
        title: '',
        duration: '',
        department: '',
        startDate: '',
        endDate: '',
        questionsFound: '',
    })
    let [isErrorView, setIsErrorView] = useState(false);

    let [optionsCount, setOptionsCount] = useState(4);
    let [questionErrors, setQuestionErrors] = useState({
        qtitle: '',
        options: '',
    })
    let [isQuestionErrorView, setIsQuestionErrorView] = useState(false);

    let today = new Date();
    const showTest = (severity, summary, msg) => {
        toast.current.show({ severity: severity, summary: summary, detail: msg });
    };

    useEffect(() => {
        let fetchTests = async () => {
            let response = await Axios.get('/api/tests/getAllTests');
            if (response?.data?.success) {
                setTests(response.data.data.tests);
            } else {
                console.log(response.data.message);
            }
        }
        fetchTests();
    }, [])

    const formatDate = (label, date) => {
        if (label === 'startDate' || label === 'endDate') {
            const d = new Date(date);
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const year = d.getFullYear();
            return `${month}/${day}/${year}`;
        }
        else {
            const d = new Date(date);
            return minutes = `${(d.getHours() * 60) + d.getMinutes()}`;
        }
    };

    let handleAddOption = () => {
        setOptionsCount((prev) => prev + 1);
        setQuestionData({ ...questionData, options: [...questionData.options, { title: '', isCorrect: false }] });
    }


    let handleCreate = async (e) => {
        e.preventDefault();
        let newErrors = {
            title: validateField('Test Title', testData.title),
            department: validateField('Department', testData.department),
            duration: validateDate('Duration', testData.duration),
            startDate: validateDate('Start Date', testData.startDate),
            endDate: validateDate('End Date', testData.endDate),
            questionsFound: validateTestQuestion(testData.assignedQuestionIds, testData.questions),
        };
        setErrors(newErrors);
        if (newErrors.title || newErrors.department || newErrors.duration || newErrors.questionsFound || newErrors.startDate || newErrors.endDate) {
            setIsErrorView(true);
            return;
        }
        else {
            try {
                console.log(testData);
                let newStartDate = formatDate(startDate);
                let newEndDate = formatDate(endDate);
                let newNumberOfQuestions = testData.questions.length + testData.assignedQuestionIds.length;
                let payload = {
                    ...testData, startDate: newStartDate, endDate: newEndDate, numberOfQuestions: newNumberOfQuestions
                }
                console.log(payload);
                let response = await Axios.post('/api/tests/createtest', payload);
                if (response.data.success) {
                    showTest('success', 'Success', response.data.message);
                    setVisible(false)
                    setIsErrorView(false);
                    let testData = { title: '', duration: '', department: '', startDate: '', endDate: '', assignedQuestionIds: [], questions: [], numberOfQuestions: '' };
                    let newErrors = { title: null, duration: null, department: null, startDate: null, endDate: null, assignedQuestionIds: null, questions: null };
                    setTestData(testData);
                    setErrors(newErrors);
                }
                else {
                    showTest('error', 'Error', response.data.message);
                    setVisible(false)
                    setIsErrorView(false);
                    let testData = { title: '', duration: '', department: '', startDate: '', endDate: '', assignedQuestionIds: [], questions: [], numberOfQuestions: '' };
                    let newErrors = { title: null, duration: null, department: null, startDate: null, endDate: null, assignedQuestionIds: null, questions: null };
                    setTestData(testData);
                    setErrors(newErrors);
                }
            } catch (error) {
                console.log(error);
                showTest('error', 'Error', error?.response?.data.message);
                setVisible(false)
                setIsErrorView(false);
                let testData = { title: '', duration: '', department: '', startDate: '', endDate: '', assignedQuestionIds: [], questions: [], numberOfQuestions: '' };
                let newErrors = { title: null, duration: null, department: null, startDate: null, endDate: null, assignedQuestionIds: null, questions: null };
                setTestData(testData);
                setErrors(newErrors);
            }

        }
    }


    let handleChange = (fieldName, value) => {
        switch (fieldName) {
            case 'title':
                setTestData({ ...testData, [fieldName]: value });
                setErrors({ ...errors, [fieldName]: validateField(fieldName, value) })
                break;
            case 'department':
                setTestData({ ...testData, [fieldName]: value });
                setErrors({ ...errors, [fieldName]: validateField(fieldName, value) })
                break;
            case 'duration':
                setTestData({ ...testData, [fieldName]: value });
                setErrors({ ...errors, [fieldName]: validateDate(fieldName, value) })
                break;
            case 'startDate':
                setTestData({ ...testData, [fieldName]: value });
                setErrors({ ...errors, [fieldName]: validateDate(fieldName, value) })
                break;
            case 'endDate':
                setTestData({ ...testData, [fieldName]: value });
                setErrors({ ...errors, [fieldName]: validateDate(fieldName, value) })
                break;
        }
    }


    // let handleAddQuestion = (e) => {
    //     e.preventDefault();
    //     let newQuestionErrors = {
    //         qtitle: validateField('Question', questionData.qTitle),
    //         options: validateOptions(questionData.options),
    //     };
    //     const correctOptions = questionData.options.filter(opt => opt.isCorrect);
    //     if (correctOptions.length === 0) {
    //         newQuestionErrors.options = 'At least one correct option must be selected.';
    //     }

    //     if (!questionData.isMultiSelect && correctOptions.length > 1) {
    //         newQuestionErrors.options = 'Only one correct option can be selected for a single-select question.';
    //     }

    //     setQuestionErrors(newQuestionErrors);
    //     if (newQuestionErrors.qTitle || newQuestionErrors.options) {
    //         setIsQuestionErrorView(true);
    //         return;
    //     }
    //     else {
    //         try {
    //             console.log(questionData);
    //             setTestData(prev => ({ ...prev, questions: [...testData.questions, questionData] }));
    //             handleClear();
    //             setCollapsed(true);
    //             setHasPanelOpened(false)
    //         } catch (error) {
    //             console.log(error);
    //         }

    //     }
    // }

    let handleOptionChange = (fieldName, qIndex, oIndex, value) => {
        let updatedQuestions = [...testData.questions];
        let updatedOptions = [...testData.questions[qIndex].options]
        updatedOptions[oIndex] = {
            ...updatedOptions[oIndex],
            [fieldName]:value
        };
        updatedQuestions[qIndex]={
            ...updatedQuestions[qIndex],
            options:updatedOptions,
        }
        setTestData({ ...testData, questions:updatedQuestions});
    }
    let handleQuestionChange = (fieldName, value, qIndex) => {
        let updatedQuestions = [...testData.questions]
        updatedQuestions[qIndex][fieldName] = value;
        setTestData({ ...testData, questions: updatedQuestions })
        // setQuestionData({ ...questionData, [fieldName]: value });
        // switch (fieldName) {
        //     case 'qtitle':
        //         setQuestionErrors({ ...questionErrors, [fieldName]: validateField(fieldName, value) })
        //         break;
        // }
    }

    // let handleRemoveOption = (indexToRemove) => {
    //     setQuestionData(prevData => {
    //         const newOptions = prevData.options.filter((_, index) => index !== indexToRemove);
    //         return { ...prevData, options: newOptions };
    //     });
    // };


    let AddQuestionCard = () => {
        let question = {
            qtitle: "",
            isMultiSelect: false,
            options: [{ title: "", isCorrect: "" }, { title: "", isCorrect: "" }, { title: "", isCorrect: "" }, { title: "", isCorrect: "" }]
        }
        setTestData({ ...testData, questions: [...testData.questions, question] })
    }

    return (
        <div className='w-full h-full flex flex-col'>
            <Header name={state.user.name} role={state.user.role} />
            <div className='flex flex-col bg-(--header-bg) p-4 gap-2 h-full'>
                <Button
                    className="w-8 h-8 p-0 pl-3 flex items-center justify-center bg-transparent border-none hover:bg-transparent"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    <i className="pi pi-arrow-left text-[var(--primary-color)] text-xl" />
                </Button>
                <Card title="Create Test" pt={{ root: 'w-full rounded-2xl', title: "text-xl font-fold", content: "pt-0", body: "px-4 pb-0" }} >
                    <form className='flex flex-col gap-3'>
                        <div className='flex gap-2'>
                            <div className='w-[60%] flex flex-col gap-1'>
                                <div className='flex'>
                                    <label htmlFor="title">Test Title</label>
                                    <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.title && isErrorView) ? 'text-red-500' : ''}`}></i>
                                </div>
                                <InputText id='title' type='text' placeholder='Enter test name' value={testData.title} onChange={(e) => { handleChange('title', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.title && isErrorView)}
                                />
                                {(errors.title && isErrorView) && <small className='text-xs text-red-500'>{errors.title}</small>}
                            </div>
                            <div className='w-[40%] flex flex-col gap-1'>
                                <div className='flex'>
                                    <label htmlFor="department" >Department</label>
                                    <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.department && isErrorView) ? 'text-red-500' : ''}`}></i>
                                </div>
                                <InputText id='department' type='text' placeholder='Enter department' value={testData.department} onChange={(e) => { handleChange('department', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.lastName && isErrorView)} />
                                {(errors.department && isErrorView) && <small className='text-xs text-red-500'>{errors.department}</small>}
                            </div>
                        </div>
                        <div className='flex gap-3'>
                            <div className='w-1/3 flex flex-col gap-1'>
                                <div className='flex'>
                                    <label htmlFor="duration" >Duration</label>
                                    <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.duration && isErrorView) ? 'text-red-500' : ''}`}></i>
                                </div>
                                <Calendar id='duration' placeholder='Enter duration' value={testData.duration} onChange={(e) => { handleChange('duration', e.value) }} className='w-full h-10 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.email && isErrorView)} timeOnly hourFormat='24' showIcon icon={() => <i className='pi pi-clock text-(--primary-color)'></i>} />
                                {(errors.duration && isErrorView) && <small className='text-xs text-red-500'>{errors.duration}</small>}
                            </div>
                            <div className='w-1/3 flex flex-col gap-1'>
                                <div className='flex'>
                                    <label htmlFor="department" >Start Date</label>
                                    <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.startDate && isErrorView) ? 'text-red-500' : ''}`}></i>
                                </div>
                                <Calendar id="startDate" placeholder='Select start date' value={testData.startDate} minDate={today} onChange={(e) => handleChange('startDate', e.value)} showIcon className='h-10' icon={() => <i className='pi pi-calendar text-(--primary-color)'></i>} />
                                {(errors.startDate && isErrorView) && <small className='text-xs text-red-500'>{errors.startDate}</small>}
                            </div>
                            <div className='w-1/3 flex flex-col gap-1'>
                                <div className='flex'>
                                    <label htmlFor="duration" >End Date</label>
                                    <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.endDate && isErrorView) ? 'text-red-500' : ''}`}></i>
                                </div>
                                <Calendar id="endDate" placeholder='Select end date' value={testData.endDate} minDate={today} onChange={(e) => handleChange('endDate', e.value)} showIcon className='h-10' icon={() => <i className='pi pi-calendar text-(--primary-color)'></i>} pt={{ root: '', title: "hover:text-green-400", }} />
                                {(errors.endDate && isErrorView) && <small className='text-xs text-red-500'>{errors.endDate}</small>}
                            </div>
                        </div>
                        <Dialog header='Recent Tests' visible={visible} className='h-[50%] w-[50%] flex flex-col' pt={{headerTitle:"text-2xl", closeButton: "hidden" }} footer={() => {
                            return <Button label='Ok' className='self-end bg-(--primary-color-light) duration-700 hover:bg-(--primary-color)' onClick={() => { setVisible(false) }} />
                        }}>
                            <ul className='overflow-auto'>
                                {tests.map((test, index) => {
                                    const isChecked = Array.isArray(testData.questions) && test.questions?.every(id =>
                                        testData.questions?.includes(id)
                                    );
                                    return (
                                        <div className='flex items-center gap-2 mb-3' key={test.id}>
                                            <Checkbox inputId={index} name={test.title} pt={pt.checkbox} checked={isChecked} onChange={(e) => {
                                                let updatedQuestions;
                                                if (e.checked) {
                                                    updatedQuestions = [...testData.questions, ...test.questions];
                                                }
                                                else {
                                                    const testQuestionIds = test.questions.map(q => q.id);
                                                    updatedQuestions = testData.questions.filter(q => !testQuestionIds.includes(q.id));
                                                }
                                                setTestData({
                                                    ...testData,
                                                    questions: updatedQuestions
                                                });
                                            }} />
                                            <label htmlFor={test.id} className='capitalize'>{test.title}</label>
                                        </div>
                                    )
                                })}
                            </ul>
                        </Dialog>
                        {/* {(errors.questionsFound && isErrorView) && <small className='text-xs text-red-500'>{errors.questionsFound}</small>} */}
                    </form>
                </Card>
                <Card className='w-full rounded-2xl overflow-auto' pt={{ header: "p-3 pb-0", body: "py-0", content: "pt-0 pl-4" }} header={() => {
                    return <div className='flex justify-between items-center'>
                        <h1 className='text-xl font-bold'>Questions</h1>
                        <div className='flex items-center gap-2'>
                            <Button outlined label='Copy' className='text-(--primary-color) h-8' onClick={() => { setVisible(true) }} />
                            <i className='pi pi-plus hover:cursor-pointer mr-3' onClick={AddQuestionCard}></i>
                        </div>
                    </div>
                }}>
                    <div className='flex flex-col gap-3'>
                        <ol className='list-decimal'>
                            {testData.questions?.map((question, index) => {
                                return <li key={question.id}>
                                    <div>
                                        <QuestionCard question={question} testData={testData} setTestData={setTestData} index={index} questionData={questionData} setQuestionData={setQuestionData} handleQuestionChange={handleQuestionChange} handleOptionChange={handleOptionChange} />
                                        <Divider className='m-0' />
                                    </div>
                                </li>
                            })}
                        </ol>
                        <div className='flex items-center justify-end gap-2 '>
                            <Button type='button' outlined label="Cancel" icon="pi pi-times" onClick={()=>{navigate(-1)}} className="text-(--primary-color)" />
                            <Button label="Create" onClick={handleCreate} icon="pi pi-check" autoFocus className='bg-(--primary-color-light) duration-700 hover:bg-(--primary-color)' />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default CreateTest