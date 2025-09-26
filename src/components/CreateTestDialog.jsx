import React, { useEffect, useRef, useState } from 'react'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card'
import { Checkbox } from 'primereact/checkbox';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Calendar } from 'primereact/calendar';
import { validateDate, validateField, validateOptions, validateTestQuestion } from '../utils/Validation';
import { Axios } from '../services/Axios';
import { classNames } from 'primereact/utils';
import QuestionCard from './QuestionCard';
import { pt } from '../utils/pt';

const CreateTestDialog = ({ testVisible, setTestVisible, showTest, fetchTests }) => {
    const [collapsed, setCollapsed] = useState(true);
    const [hasPanelOpened, setHasPanelOpened] = useState(false);
    const toast = useRef(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    let [tests, setTests] = useState([]);
    let [testData, setTestData] = useState({
        title: '',
        duration: '',
        department: '',
        startDate: '',
        endDate: '',
        assignedQuestionIds: [],
        questions: [],
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

    let [questionData, setQuestionData] = useState({
        qtitle: '',
        isMultiSelect: '',
        options: [{ title: '', isCorrect: false }, { title: '', isCorrect: false }, { title: '', isCorrect: false }, { title: '', isCorrect: false }],
    });
    let [optionsCount, setOptionsCount] = useState(4);
    let [questionErrors, setQuestionErrors] = useState({
        qtitle: '',
        options: '',
    })
    let [isQuestionErrorView, setIsQuestionErrorView] = useState(false);

    let today = new Date();

    useEffect(() => {
        let fetchTests = async () => {
            let response = await Axios.get('/api/tests/getAllTests');
            if (response?.data?.success) {
                setTests(response.data.data.tests);
                console.log(response.data)
            } else {
                console.log(response.data.message);
            }
        }
        fetchTests();
    }, [])

    const formatDate = (date) => {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();
        return `${month}/${day}/${year}`;
    };

    let handleAddOption = () => {
        setOptionsCount((prev) => prev + 1);
        setQuestionData({ ...questionData, options: [...questionData.options, { title: '', isCorrect: false }] });
    }

    let handleCancel = () => {
        setTestVisible(false)
        setIsErrorView(false);
        let testData = { title: '', duration: '', department: '', startDate: '', endDate: '', assignedQuestionIds: [], questions: [], numberOfQuestions: '' };
        let newErrors = { title: null, duration: null, department: null, startDate: null, endDate: null, assignedQuestionIds: null, questions: null };
        setTestData(testData);
        setErrors(newErrors);
    }

    let handleCreate = async (e) => {
        e.preventDefault();
        let newErrors = {
            title: validateField('Test Title', testData.title),
            department: validateField('Department', testData.department),
            duration: validateField('Duration', testData.duration),
            startDate: validateDate('Start Date', startDate),
            endDate: validateDate('End Date', endDate),
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
                    fetchTests(0, 5, '');
                    setTestVisible(false)
                    setIsErrorView(false);
                    let testData = { title: '', duration: '', department: '', startDate: '', endDate: '', assignedQuestionIds: [], questions: [], numberOfQuestions: '' };
                    let newErrors = { title: null, duration: null, department: null, startDate: null, endDate: null, assignedQuestionIds: null, questions: null };
                    setTestData(testData);
                    setErrors(newErrors);
                    setEndDate(null);
                    setStartDate(null)
                }
                else {
                    showTest('error', 'Error', response.data.message);
                    setTestVisible(false)
                    setIsErrorView(false);
                    let testData = { title: '', duration: '', department: '', startDate: '', endDate: '', assignedQuestionIds: [], questions: [], numberOfQuestions: '' };
                    let newErrors = { title: null, duration: null, department: null, startDate: null, endDate: null, assignedQuestionIds: null, questions: null };
                    setTestData(testData);
                    setErrors(newErrors);
                    setEndDate(null);
                    setStartDate(null)
                }
            } catch (error) {
                console.log(error);
                showTest('error', 'Error', error?.response?.data.message);
                setTestVisible(false)
                setIsErrorView(false);
                let testData = { title: '', duration: '', department: '', startDate: '', endDate: '', assignedQuestionIds: [], questions: [], numberOfQuestions: '' };
                let newErrors = { title: null, duration: null, department: null, startDate: null, endDate: null, assignedQuestionIds: null, questions: null };
                setTestData(testData);
                setErrors(newErrors);
                setEndDate(null);
                setStartDate(null)
            }

        }
    }


    let handleChange = (fieldName, value) => {
        setTestData({ ...testData, [fieldName]: value });
        switch (fieldName) {
            case 'title':
                setErrors({ ...errors, [fieldName]: validateField(fieldName, value) })
                break;
            case 'department':
                setErrors({ ...errors, [fieldName]: validateField(fieldName, value) })
                break;
            case 'duration':
                setErrors({ ...errors, [fieldName]: validateField(fieldName, value) })
                break;
        }
    }

    let handleClear = () => {
        setIsQuestionErrorView(false);
        let questionData = { qtitle: '', isMultiSelect: false, options: [{ title: "", isCorrect: false }, { title: "", isCorrect: false }, { title: "", isCorrect: false }, { title: "", isCorrect: false }] };
        let newErrors = { qtitle: null, options: null };
        setQuestionData(questionData);
        setQuestionErrors(newErrors);
        setCollapsed(true);
        setHasPanelOpened(false);
    }

    let handleAddQuestion = (e) => {
        e.preventDefault();
        let newQuestionErrors = {
            qtitle: validateField('Question', questionData.qTitle),
            options: validateOptions(questionData.options),
        };
        const correctOptions = questionData.options.filter(opt => opt.isCorrect);
        if (correctOptions.length === 0) {
            newQuestionErrors.options = 'At least one correct option must be selected.';
        }

        if (!questionData.isMultiSelect && correctOptions.length > 1) {
            newQuestionErrors.options = 'Only one correct option can be selected for a single-select question.';
        }

        setQuestionErrors(newQuestionErrors);
        if (newQuestionErrors.qTitle || newQuestionErrors.options) {
            setIsQuestionErrorView(true);
            return;
        }
        else {
            try {
                console.log(questionData);
                setTestData(prev => ({ ...prev, questions: [...testData.questions, questionData] }));
                handleClear();
                setCollapsed(true);
                setHasPanelOpened(false)
            } catch (error) {
                console.log(error);
            }

        }
    }

    let handleOptionChange = (fieldName,qIndex,oIndex,value)=>{
        let updatedOptions = [...testData.questions[qIndex].options]
        console.log(updatedOptions);
        updatedOptions[oIndex][fieldName] = value;
        let question = {...testData.questions[qIndex],options:updatedOptions}
        testData.questions[qIndex] = question
        setTestData({...testData,})
    }
    let handleQuestionChange = (fieldName, value,qIndex) => {
        let updatedQuestions = [...testData.questions]
        updatedQuestions[qIndex][fieldName] = value;
        setTestData({...testData,questions:updatedQuestions})
        // setQuestionData({ ...questionData, [fieldName]: value });
        // switch (fieldName) {
        //     case 'qtitle':
        //         setQuestionErrors({ ...questionErrors, [fieldName]: validateField(fieldName, value) })
        //         break;
        // }
    }

    let handleRemoveOption = (indexToRemove) => {
        setQuestionData(prevData => {
            const newOptions = prevData.options.filter((_, index) => index !== indexToRemove);
            return { ...prevData, options: newOptions };
        });
    };

    const handleToggle = (e) => {
        if (!hasPanelOpened && collapsed) {
            setCollapsed(false);
            setHasPanelOpened(true);
        }
    };

    let AddQuestionCard = ()=>{
        let question = {
            qtitle:"",
            isMultiSelect:false,
            options:[{title:"",isCorrect:""},{title:"",isCorrect:""},{title:"",isCorrect:""},{title:"",isCorrect:""}]
        }
        setTestData({...testData,questions:[...testData.questions,question]})
    }

    let handleQuestionDataChange = (e)=>{}

    return (
        <Dialog header="Create Test" visible={testVisible} style={{ width: '50vw', height: '80vh' }} pt={{ closeButton: 'hidden', root: '', content: 'bg-(--header-bg)', header: "bg-(--header-bg)", headerTitle: "text-2xl font-bold", }} >
            <form className='flex flex-col gap-4'>
                <div className='flex flex-col gap-1'>
                    <div className='flex'>
                        <label htmlFor="title">Test Title</label>
                        <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.title && isErrorView) ? 'text-red-500' : ''}`}></i>
                    </div>
                    <InputText id='title' type='text' placeholder='Enter test name' value={testData.title} onChange={(e) => { handleChange('title', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.title && isErrorView)}
                    />
                    {(errors.title && isErrorView) && <small className='text-xs text-red-500'>{errors.title}</small>}
                </div>
                <div className='flex gap-3'>
                    <div className='w-1/2 flex flex-col gap-1'>
                        <div className='flex'>
                            <label htmlFor="department" >Department</label>
                            <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.department && isErrorView) ? 'text-red-500' : ''}`}></i>
                        </div>
                        <InputText id='department' type='text' placeholder='Enter department' value={testData.department} onChange={(e) => { handleChange('department', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.lastName && isErrorView)} />
                        {(errors.department && isErrorView) && <small className='text-xs text-red-500'>{errors.department}</small>}
                    </div>
                    <div className='w-1/2 flex flex-col gap-1'>
                        <div className='flex'>
                            <label htmlFor="duration" >Duration (minutes)</label>
                            <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.duration && isErrorView) ? 'text-red-500' : ''}`}></i>
                        </div>
                        <InputText id='duration' type='text' placeholder='Enter duration' value={testData.duration} onChange={(e) => { handleChange('duration', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.email && isErrorView)} />
                        {(errors.duration && isErrorView) && <small className='text-xs text-red-500'>{errors.duration}</small>}
                    </div>
                </div>
                <div className='flex gap-3'>
                    <div className='w-1/2 flex flex-col gap-1'>
                        <div className='flex'>
                            <label htmlFor="department" >Start Date</label>
                            <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.startDate && isErrorView) ? 'text-red-500' : ''}`}></i>
                        </div>
                        <Calendar id="startDate" placeholder='Select start date' value={startDate} minDate={today} onChange={(e) => setStartDate(e.value)} showIcon className='h-10' icon={() => <i className='pi pi-calendar text-(--primary-color)'></i>} />
                        {(errors.startDate && isErrorView) && <small className='text-xs text-red-500'>{errors.startDate}</small>}
                    </div>
                    <div className='w-1/2 flex flex-col gap-1'>
                        <div className='flex'>
                            <label htmlFor="duration" >End Date</label>
                            <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.endDate && isErrorView) ? 'text-red-500' : ''}`}></i>
                        </div>
                        <Calendar id="endDate" placeholder='Select end date' value={endDate} minDate={today} onChange={(e) => setEndDate(e.value)} showIcon className='h-10' icon={() => <i className='pi pi-calendar text-(--primary-color)'></i>} pt={{ root: '', title: "hover:text-green-400",  }} />
                        {(errors.endDate && isErrorView) && <small className='text-xs text-red-500'>{errors.endDate}</small>}
                    </div>
                </div>
                <Card title='Recent Tests' className='overflow-auto rounded-2xl' pt={{ title: 'text-lg', body: "p-4", content: "p-0" }}>
                    <ul>
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
                </Card>
                <Card className='rounded-2xl' pt={{header:"p-4",body:"pt-0",content:"pt-0" }} header={() => {
                    return <div className='flex justify-between items-center'>
                        <h1 className='text-lg font-bold'>Questions</h1>
                        <i className='pi pi-plus hover:cursor-pointer' onClick={AddQuestionCard}></i>
                    </div>
                }}>
                    {testData.questions?.map((question,index) => {
                        return <div key={question.id}>
                            <QuestionCard question={question} testData={testData} setTestData={setTestData} index={index} questionData={questionData} setQuestionData={setQuestionData} handleQuestionChange={handleQuestionChange} handleOptionChange={handleOptionChange} />
                            <Divider />
                        </div>
                    })}
                </Card>
                {(errors.questionsFound && isErrorView) && <small className='text-xs text-red-500'>{errors.questionsFound}</small>}
                <div className='flex items-center justify-end gap-2 '>
                    <Button type='button' outlined label="Cancel" icon="pi pi-times" onClick={handleCancel} className="text-(--primary-color)" />
                    <Button label="Create" onClick={handleCreate} icon="pi pi-check" autoFocus className='bg-(--primary-color-light) duration-700 hover:bg-(--primary-color)' />
                </div>
            </form>
        </Dialog>
    )
}

export default CreateTestDialog