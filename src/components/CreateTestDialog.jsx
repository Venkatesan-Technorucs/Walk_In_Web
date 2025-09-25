import React, { useRef, useState } from 'react'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card'
import { Checkbox } from 'primereact/checkbox';
import { Panel } from 'primereact/panel';
import { Calendar } from 'primereact/calendar';
import { validateField, validateOptions, validateTestQuestion } from '../utils/Validation';
import { Axios } from '../services/Axios';
import { classNames } from 'primereact/utils';

const CreateTestDialog = ({ testVisible, setTestVisible, showTest, tests }) => {
    const [collapsed, setCollapsed] = useState(true);
    const [hasPanelOpened, setHasPanelOpened] = useState(false);
    const toast = useRef(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
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
    let month = today.getMonth();
    let year = today.getFullYear();
    let nextMonth = month === 11 ? 0 : month + 1;
    let secondMonth = month === 11 ? 0 : month + 2;
    let nextYear = nextMonth === 0 ? year + 1 : year;
    let startMaxDate = new Date();
    startMaxDate.setMonth(nextMonth);
    startMaxDate.setFullYear(nextYear);
    let endMaxDate = new Date();
    endMaxDate.setMonth(secondMonth);
    endMaxDate.setFullYear(nextYear);

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

    let handleQuestionChange = (fieldName, value) => {
        setQuestionData({ ...questionData, [fieldName]: value });
        switch (fieldName) {
            case 'qtitle':
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


    const pt = {
        checkbox: {
            box: ({ context }) => ({
                className: classNames(
                    'flex items-center justify-center border-2 rounded-sm transition-colors duration-200',
                    {
                        'bg-(--header-bg) border-(--primary-color)': !context.checked,

                        'bg-(--primary-color-light) duration-700 hover:bg-(--primary-color) border-(--primary-color)': context.checked
                    }
                )
            }),
            icon: 'w-4 h-4 text-white transition-all duration-200'
        }
    }

    return (
        <Dialog header="Create Test" visible={testVisible} style={{ width: '50vw', height: '80vh' }} pt={{ closeButton: 'hidden', root: '', content: 'bg-(--header-bg)', header: "bg-(--header-bg)", headerTitle: "text-2xl font-bold", }} >
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
                <div className='flex gap-3'>
                    <div className='w-1/2 flex flex-col gap-1'>
                        <div className='flex'>
                            <label htmlFor="department" className={`${(errors.startDate && isErrorView) ? 'text-red-500' : ''}`}>Start Date</label>
                            <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.startDate && isErrorView) ? 'text-red-500' : ''}`}></i>
                        </div>
                        <Calendar id="startDate" placeholder='Select start date' value={startDate} minDate={today}  onChange={(e) => setStartDate(e.value)} showIcon className='h-10' icon={() => <i className='pi pi-calendar text-(--primary-color)'></i>} />
                        {(errors.startDate && isErrorView) && <small className='text-xs text-red-500'>{errors.startDate}</small>}
                    </div>
                    <div className='w-1/2 flex flex-col gap-1'>
                        <div className='flex'>
                            <label htmlFor="duration" className={`${(errors.endDate && isErrorView) ? 'text-red-500' : ''}`}>End Date</label>
                            <i className={`pi pi-asterisk text-[8px] mt-1 ${(errors.endDate && isErrorView) ? 'text-red-500' : ''}`}></i>
                        </div>
                        <Calendar id="endDate" placeholder='Select end date' value={endDate} minDate={today} onChange={(e) => setEndDate(e.value)} showIcon className='h-10' icon={() => <i className='pi pi-calendar text-(--primary-color)'></i>} pt={{ root: '', container: "", select: "", input: "", buttonbar: "" }} />
                        {(errors.endDate && isErrorView) && <small className='text-xs text-red-500'>{errors.endDate}</small>}
                    </div>
                </div>
                <Card title='Recent Tests' className='overflow-auto rounded-2xl' pt={{ title: 'text-lg', body: "p-4", content: "p-0" }}>
                    <ul>
                        {tests.map((test, index) => {
                            const isChecked = Array.isArray(testData.assignedQuestionIds) && test.assignedQuestionIds?.every(id =>
                                testData.assignedQuestionIds?.includes(id)
                            );
                            return (
                                <div className='flex items-center gap-2 mb-3' key={test.id}>
                                    <Checkbox inputId={index} name={test.title} pt={pt.checkbox} checked={isChecked} onChange={(e) => {
                                        let updatedIds;
                                        if (e.checked) {
                                            updatedIds = [...testData.assignedQuestionIds, ...test.assignedQuestionIds.filter(id => !testData.assignedQuestionIds.includes(id))];
                                        }
                                        else {
                                            updatedIds = testData.assignedQuestionIds.filter(
                                                id => !test.assignedQuestionIds.includes(id)
                                            );
                                        }
                                        setTestData({
                                            ...testData,
                                            assignedQuestionIds: updatedIds
                                        });
                                    }} />
                                    <label htmlFor={test.id} className='capitalize'>{test.title}</label>
                                </div>
                            )
                        })}
                    </ul>
                </Card>
                <Card title='Questions' className='rounded-2xl' pt={{ title: 'text-lg' }}>
                    <Panel header='Add Question' toggleable onToggle={handleToggle} collapseIcon collapsed={collapsed} pt={{ title: "text-base font-bold", header: "bg-(--header-bg)", root: 'mb-2' }} >
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <div className='flex'>
                                    <label htmlFor="qtitle" className={`${(questionErrors.qTitle && isQuestionErrorView) ? 'text-red-500' : ''}`}>Question</label>
                                    <i className={`pi pi-asterisk text-[8px] mt-1 ${(questionErrors.qTitle && isQuestionErrorView) ? 'text-red-500' : ''}`}></i>
                                </div>
                                <InputText id='qtitle' type='text' placeholder='Enter question' value={questionData.qtitle} onChange={(e) => { handleQuestionChange('qtitle', e.target.value) }} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' invalid={(questionErrors.qtitle && isQuestionErrorView)} />
                                {(questionErrors.qtitle && isQuestionErrorView) && <small className='text-xs text-red-500'>{questionErrors.qtitle}</small>}
                            </div>
                            <div className='flex gap-2 items-center'>
                                <Checkbox inputId='isMultiSelect' name='isMultiSelect' pt={pt.checkbox} checked={questionData.isMultiSelect} onChange={(e) => { if (e.checked) { setQuestionData({ ...questionData, isMultiSelect: true }) } else { setQuestionData({ ...questionData, isMultiSelect: false }) } }} />
                                <label htmlFor="isMultiSelect">Multiple Choice</label>
                            </div>
                            <div className='flex justify-between items-start'>
                                <h1 className='font-bold text-base'>Options</h1>
                                <Button type='button' label='Add' outlined onClick={handleAddOption} className='p-1 text-(--primary-color)' />
                            </div>
                            <div className='flex flex-col gap-2'>
                                {questionData.options.map((option, index) => {
                                    const isSingleMode = !questionData.isMultiSelect;
                                    const anyCorrectSelected = questionData.options.some(opt => opt.isCorrect);
                                    return (
                                        <div>
                                            <div className='flex items-center justify-between'>
                                                <Checkbox className='' pt={pt.checkbox} inputId={index} checked={option.isCorrect} disabled={isSingleMode && anyCorrectSelected && !option.isCorrect} onChange={(e) => {
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
                                                <InputText id={`option-${index}`} className='h-6 w-[80%] bg-gray-100 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' placeholder={`Enter option ${index + 1}`} value={option.title} pt={{ root: 'py-1' }} onChange={(e) => {
                                                    let newOptions = [...questionData.options];
                                                    newOptions[index].title = e.target.value;
                                                    setQuestionData({ ...questionData, options: newOptions });
                                                }} />
                                                <Button type='button' outlined icon='pi pi-trash text-xs' className='p-0 w-6 text-(--primary-color)' onClick={() => { handleRemoveOption(index) }} />
                                                <div className='flex items-center gap-2'>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                <p>Select the correct answers</p>
                            </div>
                            <div className='flex items-center justify-end gap-2 '>
                                <Button type='button' outlined label="Clear" icon="pi pi-times" onClick={handleClear} className="text-(--primary-color) p-1 w-18 h-8" pt={{ icon: "text-sm" }} />
                                <Button type='button' label="Add" onClick={handleAddQuestion} icon="pi pi-check" autoFocus className='bg-(--primary-color-light) duration-700 hover:bg-(--primary-color) p-2 h-8 w-18' pt={{ icon: "text-sm" }} />
                            </div>
                        </div>
                    </Panel>
                    <ol type='1'>
                        {testData.questions.map((question, index) => {
                            return <li key={index}>{question.qtitle}</li>
                        })}
                    </ol>
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