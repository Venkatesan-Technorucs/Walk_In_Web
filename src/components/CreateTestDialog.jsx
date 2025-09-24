import React, { useRef, useState } from 'react'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card'
import { Checkbox } from 'primereact/checkbox';
import { Panel } from 'primereact/panel';
import { validateField, validateOptions, validateTestQuestion } from '../utils/Validation';
import { Axios } from '../services/Axios';

const CreateTestDialog = ({ testVisible, setTestVisible, showTest, tests }) => {
    const [collapsed, setCollapsed] = useState(true);
    const [hasPanelOpened, setHasPanelOpened] = useState(false);
    const toast = useRef(null);
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
        qTitle: '',
        isMultiSelect: false,
        options: [{ title: '', isCorrect: false }, { title: '', isCorrect: false }, { title: '', isCorrect: false }, { title: '', isCorrect: false }],
    });
    let [optionsCount, setOptionsCount] = useState(4);
    let [questionErrors, setQuestionErrors] = useState({
        qTitle: '',
        options: '',
    })
    let [isQuestionErrorView, setIsQuestionErrorView] = useState(false);

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
            // startDate: validateName('Last Name', newAdminData.lastName),
            // endDate: validateEmail(newAdminData.email),
            questionsFound: validateTestQuestion(testData.assignedQuestionIds, testData.questions),
        };
        setErrors(newErrors);
        if (newErrors.title || newErrors.department || newErrors.duration || newErrors.questionsFound) {
            setIsErrorView(true);
            return;
        }
        else {
            try {
                console.log(testData);
                // let response = await Axios.post('/api/users/createAdmin', { ...newAdminData, role: 'Admin' });
                // if (response.success) {
                //     show('success', 'Success', 'Admin created successfully');
                //     setVisible(false)
                //     setIsErrorView(false);
                //     let adminData = { firstName: '', lastName: '', email: '', password: '' };
                //     let errors = { firstName: null, lastName: null, email: null, password: null };
                //     setNewAdminData(adminData);
                //     setErrors(errors);
                // }
                // else {
                //     show('error', 'Error', response.data.message);
                //     setVisible(false)
                //     setIsErrorView(false);
                //     let adminData = { firstName: '', lastName: '', email: '', password: '' };
                //     let errors = { firstName: null, lastName: null, email: null, password: null };
                //     setNewAdminData(adminData);
                //     setErrors(errors);
                // }
            } catch (error) {
                console.log(error);
                // show('error', 'Error', error?.response?.data.message);
                // setVisible(false)
                // setIsErrorView(false);
                // let adminData = { firstName: '', lastName: '', email: '', password: '' };
                // let errors = { firstName: null, lastName: null, email: null, password: null };
                // setNewAdminData(adminData);
                // setErrors(errors);
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
        let questionData = { qTitle: '', isMultiSelect: false, options: [] };
        let newErrors = { qTitle: null, options: null };
        setQuestionData(questionData);
        setQuestionErrors(newErrors);
        setCollapsed(true);
        setHasPanelOpened(false);
    }

    let handleAddQuestion =  (e) => {
        e.preventDefault();
        let newQuestionErrors = {
            qTitle: validateField('Question', questionData.qTitle),
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
                setTestData(prev=>({...prev,questions:questionData}));
                handleClear();
                setCollapsed(true);
                setHasPanelOpened(false)
            } catch (error) {
                console.log(error);
            }

        }
    }

    let handleQuestionChange = (fieldName, value) => {
        setQuestionData({ ...questionData, [fieldName]: value });
        switch (fieldName) {
            case 'qTitle':
                setQuestionErrors({ ...questionErrors, [fieldName]: validateField(fieldName, value) })
                break;
        }
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

    const handleClose = () => {
        if (hasOpened) {
            setCollapsed(true);
        }
    };


    return (
        <Dialog header="Create Test" visible={testVisible} style={{ width: '50vw', height: '80vh' }} pt={{ closeButton: 'hidden' }} >
            <form className='flex flex-col gap-4'>
                <div className='flex flex-col gap-1'>
                    <div className='flex'>
                        <label htmlFor="title" className={`${(errors.title && isErrorView) ? 'text-red-500' : ''}`}>Test Title</label>
                        <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.title && isErrorView) ? 'text-red-500' : ''}`}></i>
                    </div>
                    <InputText id='title' type='text' placeholder='Enter test name' value={testData.title} onChange={(e) => { handleChange('title', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.title && isErrorView)}
                    />
                    {(errors.title && isErrorView) && <small className='text-xs text-red-500'>{errors.title}</small>}
                </div>
                <div className='flex gap-3'>
                    <div className='w-1/2 flex flex-col gap-1'>
                        <div className='flex'>
                            <label htmlFor="department" className={`${(errors.department && isErrorView) ? 'text-red-500' : ''}`}>Department</label>
                            <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.department && isErrorView) ? 'text-red-500' : ''}`}></i>
                        </div>
                        <InputText id='department' type='text' placeholder='Enter department' value={testData.department} onChange={(e) => { handleChange('department', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.lastName && isErrorView)} />
                        {(errors.department && isErrorView) && <small className='text-xs text-red-500'>{errors.department}</small>}
                    </div>
                    <div className='w-1/2 flex flex-col gap-1'>
                        <div className='flex'>
                            <label htmlFor="duration" className={`${(errors.duration && isErrorView) ? 'text-red-500' : ''}`}>Duration (minutes)</label>
                            <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.duration && isErrorView) ? 'text-red-500' : ''}`}></i>
                        </div>
                        <InputText id='duration' type='text' placeholder='Enter duration' value={testData.duration} onChange={(e) => { handleChange('duration', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(errors.email && isErrorView)} />
                        {(errors.duration && isErrorView) && <small className='text-xs text-red-500'>{errors.duration}</small>}
                    </div>
                </div>
                <Card title='Recent Tests'>
                    <ul>
                        {tests.map((test) => {
                            return (
                                <div className='flex gap-2' key={test.id}>
                                    <Checkbox inputId={test.id} name={test.title}
                                    // pt={pt.checkbox}
                                    />
                                    <label htmlFor={test.id}>{test.title}</label>
                                </div>
                            )
                        })}
                    </ul>
                </Card>
                <Card title='Questions'>
                    <Panel header='Add Question' toggleable onToggle={handleToggle} collapseIcon collapsed={collapsed} >
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <div className='flex'>
                                    <label htmlFor="qTitle" className={`${(questionErrors.qTitle && isQuestionErrorView) ? 'text-red-500' : ''}`}>Question</label>
                                    <i className={`pi pi-asterisk text-[8px] mt-1 ${(questionErrors.qTitle && isQuestionErrorView) ? 'text-red-500' : ''}`}></i>
                                </div>
                                <InputText id='qTitle' type='text' placeholder='Enter question' value={questionData.qTitle} onChange={(e) => { handleQuestionChange('qTitle', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(questionErrors.qTitle && isQuestionErrorView)} />
                                {(questionErrors.qTitle && isQuestionErrorView) && <small className='text-xs text-red-500'>{questionErrors.qTitle}</small>}
                            </div>
                            <div className='flex gap-2 items-center'>
                                <Checkbox inputId='isMultiSelect' name='isMultiSelect' checked={questionData.isMultiSelect} onChange={(e)=>{setQuestionData({...questionData,isMultiSelect:e.value})}} />
                                <label htmlFor="isMultiSelect">Multiple Choice</label>
                            </div>
                            <Card>
                                <div className='flex justify-between'>
                                    <h1>Options</h1>
                                    <Button type='button' label='Add' onClick={handleAddOption} />
                                </div>
                                {questionData.options.map((option, index) => {
                                    const isSingleMode = !questionData.isMultiSelect;
                                    const anyCorrectSelected = questionData.options.some(opt => opt.isCorrect);
                                    return (
                                        <div className='flex justify-around items-center mb-2'>
                                            <InputText id={`option-${index}`} placeholder={`Enter option ${index + 1}`} value={option.title} pt={{ root: 'py-1' }} onChange={(e) => {
                                                let newOptions = [...questionData.options];
                                                newOptions[index].title = e.target.value;
                                                setQuestionData({ ...questionData, options: newOptions });
                                            }} />
                                            <div className='flex items-center gap-2'>
                                                <Checkbox inputId={index} checked={option.isCorrect} disabled={isSingleMode && anyCorrectSelected && !option.isCorrect} onChange={(e) => {
                                                    let newOptions = [...questionData.options];
                                                    if (isSingleMode) {
                                                        newOptions = newOptions.map((opt, i) => ({
                                                            ...opt,
                                                            isCorrect: i === index ? e.checked : false,
                                                        }));
                                                    } else {
                                                        newOptions[index].isCorrect = e.checked;
                                                    }
                                                    setQuestionData({ ...questionData, options: newOptions });
                                                }
                                                } />
                                                <label htmlFor="">Is Correct</label>
                                            </div>
                                            {questionData.options.length > 4 && <Button type='button' outlined icon='pi pi-trash' onClick={() => { handleRemoveOption(index) }} />}
                                        </div>
                                    )
                                })}
                            </Card>
                            <div className='flex items-center justify-end gap-2 '>
                                <Button type='button' outlined label="Clear" icon="pi pi-times" onClick={handleClear} className="text-(--primary-color)" />
                                <Button type='button' label="Add" onClick={handleAddQuestion} icon="pi pi-check" autoFocus className='bg-linear-135 from-(--primary-color-light) from-0% to-(--primary-color) to-100%' />
                            </div>
                        </div>
                    </Panel>
                </Card>
                {(errors.questionsFound && isErrorView) && <small className='text-xs text-red-500'>{errors.questionsFound}</small>}
                <div className='flex items-center justify-end gap-2 '>
                    <Button type='button' outlined label="Cancel" icon="pi pi-times" onClick={handleCancel} className="text-(--primary-color)" />
                    <Button label="Create" onClick={handleCreate} icon="pi pi-check" autoFocus className='bg-linear-135 from-(--primary-color-light) from-0% to-(--primary-color) to-100%' />
                </div>
            </form>
        </Dialog>
    )
}

export default CreateTestDialog