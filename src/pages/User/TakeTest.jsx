import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { ProgressBar } from 'primereact/progressbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useState } from 'react'
import CountdownTimer from '../../utils/CountdownTimer'
import { Checkbox } from 'primereact/checkbox';
import Header from '../../components/Header';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { Axios } from '../../services/Axios'
import { useAuth } from '../../contexts/AuthContext';

const TakeTest = () => {
    let { state, dispatch } = useAuth();
    let { id } = useParams();
    let navigate = useNavigate();
    let [title, setTitle] = useState('');
    let [duration, setDuration] = useState(0);
    let [questions, setQuestions] = useState([]);
    let [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    let [totalQuestions, setTotalQuestions] = useState(0);
    let [answers, setAnswers] = useState([]);
    let [answeredCount, setAnsweredCount] = useState(0);
    let [progressCount, setProgressCount] = useState(0);
    let [isLoading, setisLoading] = useState(true);
    let [switchCount, setSwitchCount] = useState(0);
    let [visible, setVisible] = useState(false);
    let [test, setTest] = useState({});

    useEffect(() => {
        const storedTest = JSON.parse(localStorage.getItem('test'));
        setTest(storedTest);
    }, []);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const token = localStorage.getItem('token');
                let response = await Axios.get(`/api/tests/getTest/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                if (response.data?.success) {
                    setTitle(response.data?.data?.title);
                    setDuration(response.data?.data?.duration);
                    setQuestions(response.data?.data?.questions);
                    setTotalQuestions(response.data?.data?.totalQuestions);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setisLoading(false);
            }
        }
        fetchQuestion();
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                setVisible(true);
                setSwitchCount((prev) => {
                    const updatedCount = prev + 1;
                    if (updatedCount > 100) {
                        handleSubmit(answers);
                    }
                    return updatedCount;
                });
            }
        };
        const handleBeforeUnload = (e) => {
            setSwitchCount((prev) => {
                const updatedCount = prev + 1;
                if (updatedCount > 20) {
                    handleSubmit(answers);
                }
                return updatedCount;
            });
            e.preventDefault();
            e.returnValue = "";
        };
        const handlePopState = () => {
            setVisible(true);
            setSwitchCount((prev) => {
                const updatedCount = prev + 1;
                if (updatedCount > 20) {
                    handleSubmit(answers);
                }
                return updatedCount;
            });
            window.history.pushState(null, null, window.location.href);
        };

        window.history.pushState(null, null, window.location.href);
        window.addEventListener("popstate", handlePopState);
        window.addEventListener("beforeunload", handleBeforeUnload);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            removeEventListener("visibilitychange", handleVisibilityChange)
            removeEventListener("beforeunload", handleBeforeUnload)
            removeEventListener("popstate", handlePopState);
        }
    }, [test]);


    let handlePrevious = () => {
        setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
    }
    let handleNext = () => {
        setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
    }

    let handleSubmit = async (answers) => {
        try {
            let response = await Axios.post('/api/tests/submitAnswer', { "attemptId": test.attempt, 'questionAnswers': answers });
            dispatch({ type: "LOGOUT" });
            navigate('/logout');
        } catch (error) {
            console.log(error);
        }
    }

    const isSelected = (questionId, optionId) => {
        const ans = answers.find(a => a.questionId === questionId);
        if (!ans) return false;
        return Array.isArray(ans.options)
            ? ans.options.includes(optionId)
            : ans.options === optionId;
    };

    const handleAnswer = (questionId, optionId, isMulti) => {
        setAnswers(prev => {
            const existing = prev.find(a => a.questionId === questionId);
            let updated;

            if (!existing) {
                updated = [...prev, { questionId, options: isMulti ? [optionId] : [optionId] }];
            } else if (isMulti) {
                let updatedOptions = Array.isArray(existing.options) ? [...existing.options] : [];
                if (updatedOptions.includes(optionId)) {
                    updatedOptions = updatedOptions.filter(id => id !== optionId);
                } else {
                    updatedOptions.push(optionId);
                }
                updated = prev.map(a =>
                    a.questionId === questionId ? { ...a, options: updatedOptions } : a
                );
            } else {
                updated = prev.map(a =>
                    a.questionId === questionId ? { ...a, options: [optionId] } : a
                );
            }

            const answeredQuestions = updated.filter(a => a.options && a.options.length > 0);
            setAnsweredCount(answeredQuestions.length);
            setProgressCount(Math.round((answeredQuestions.length / totalQuestions) * 100));
            return updated;
        });
    };

    const dialogHeaderContent = (
        <div className="flex items-center gap-2 text-red-600 text-base xs:text-2xl">
            <i className='pi pi-exclamation-triangle mb-1 text-base xs:text-2xl'></i>
            Alert
        </div>
    );

    const dialogFooterContent = (
        <div className='text-sm'>
            <Button label="Ok" icon="pi pi-check" onClick={() => { if (!visible) return; setVisible(false); }} autoFocus className='text-base h-9 xs:h-12 xs:text-lg bg-(--primary-color-light) duration-700 hover:bg-(--primary-color)' />
        </div>
    );



    const pt = {
        progressCard: {
            body: 'p-3 ',
            content: 'p-0 flex flex-col gap-3'
        },
        questionsCard: {
            root: 'self-center',
            body: 'p-0',
            content: 'px-5 py-2 flex flex-col gap-2'
        },
        questionsNavigatorCard: {
            root: 'w-full self-center p-3',
            body: 'p-0',
            title: 'text-base xs:text-xl',
            content: 'p-0 flex gap-3 flex-wrap'
        },
        checkbox: {
            box: ({ context }) => ({
                className: classNames(
                    'flex items-center justify-center border-2 rounded-sm transition-colors duration-200',
                    {
                        'bg-(--header-bg) border-(--primary-color)': !context.checked,

                        'bg-(--primary-color-light) duration-700 hover:bg-(--primary-color) border-(--primary-color-light)': context.checked
                    }
                )
            }),
            icon: 'w-4 h-4 text-white transition-all duration-200'
        }
    };

    return (
        <div className='w-full h-full flex flex-col'>
            {/* Header */}
            {/* <Header name={state.user.name} role={state.user.role} /> */}
            {/* Body */}
            {isLoading
                ? <div className='w-full min-h-[calc(100vh-80px)] flex items-center justify-center self-center bg-[#E6ECF1]'>
                    <ProgressSpinner className='h-16' />
                </div>
                : <div className='w-full min-h-[calc(100vh-80px)] flex flex-col px-[10%] py-4 gap-4 bg-[#E6ECF1]'>
                    <Dialog position='top' header={dialogHeaderContent} footer={dialogFooterContent} visible={visible} onHide={() => { if (!visible) return; setVisible(false); }} className='w-[75%] h[50%] xs:w-[60%]' pt={{ root: 'text-xs xs:text-base md:text-xl', content: 'pt-[2px] pb-[8px]', header: 'p-3', closeButton: 'w-[20px] h-[30px] xs:h-[48px] xs:w-[30px]', footer: 'p-2' }}>
                        <p className="m-0">Please remain on this page while taking the test. Navigating away, refreshing, or switching tabs may interrupt your session and result in automatic submission.</p>
                    </Dialog>
                    <Card pt={pt.progressCard}>
                        <div className='flex flex-col xs:flex-row justify-between items-center'>
                            <div>
                                <h1 className='text-center xs:text-left text-base xs:text-xl sm:text-2xl font-medium capitalize'>{title}</h1>
                                <h2 className='text-sm xs:text-base sm:text-lg font-normal text-(--secondary-text-color)'>Question {currentQuestionIndex + 1} of {totalQuestions}</h2>
                            </div>
                            <div className='flex justify-center items-center gap-3'>
                                <CountdownTimer duration={duration * 60} active={true} onComplete={handleSubmit} />
                                <div className='w-28 h-8 rounded-4xl border-2 flex justify-center items-center p-1'>
                                    <p className='text-[10px] sm:text-sm p-1 font-medium'>{answeredCount}/{totalQuestions} answered</p>
                                </div>
                            </div>
                        </div>
                        <ProgressBar value={progressCount} className='h-4 text-xs rounded-4xl font-bold' pt={{ value: 'bg-(--primary-color-light) duration-700 hover:bg-(--primary-color)' }}></ProgressBar>
                    </Card>
                    {questions.slice(currentQuestionIndex, currentQuestionIndex + 1).map((question) => {
                        return <Card className='w-full self-center' key={question.id} pt={pt.questionsCard}>
                            <div className='flex flex-col gap-1'>
                                <h1 className='text-base xs:text-lg'>Question {currentQuestionIndex + 1}.</h1>
                            </div>
                            <h2 className='text-lg xs:text-xl font-medium mb-2'>{question.title}</h2>
                            <ol className='pl-5 list-decimal marker:text-xl' type='1' >
                                {question.options.map((option) => {
                                    return question.isMultiSelect
                                        ? (<li key={option.id} className="w-full p-2">
                                            <div className='flex items-center'>
                                                <Checkbox inputId={option.id} name={question.id} value={option.title} onChange={() => handleAnswer(question.id, option.id, true)} checked={isSelected(question.id, option.id)} pt={pt.checkbox} />
                                                <label htmlFor={option.id} className="ml-2">{option.title}</label>
                                            </div>
                                        </li>)
                                        : (<li key={option.id}>
                                            <div className={`h-8 w-full p-4 flex items-center rounded-2xl mb-2 ${isSelected(question.id, option.id) ? 'bg-(--primary-color-light) duration-700 hover:bg-(--primary-color) text-white' : 'bg-(--header-bg) border-1 border-(--primary-color)'} hover:bg-(--primary-color-light) hover:text-white`} onClick={() => handleAnswer(question.id, option.id, false)} >
                                                {option.title}
                                            </div>
                                        </li>)
                                })}
                            </ol>
                        </Card>
                    })}
                    <div className='w-full h-10 self-center flex p-1 justify-between'>
                        <Button label='Previous' className='h-8 w-16 text-sm xs:h-10 xs:w-20 xs:text-base flex justify-center bg-(--primary-color-light) duration-700 hover:bg-(--primary-color) rounded-sm ' onClick={handlePrevious} />
                        <Button label={currentQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Next'} className='h-8 w-16 text-sm xs:h-10 xs:w-20 xs:text-base flex text-white justify-center bg-(--primary-color-light) duration-700 hover:bg-(--primary-color) rounded-sm ' onClick={() => {
                            if (currentQuestionIndex === totalQuestions - 1) {
                                handleSubmit(answers);
                            } else {
                                handleNext();
                            }
                        }} />
                    </div>
                    <Card title='Question Navigator' pt={pt.questionsNavigatorCard} className=''>
                        {questions.map((question, index) => {
                            const answered = answers.find(a => {
                                if (a.questionId !== question.id) return false;
                                return Array.isArray(a.options) ? a.options.length > 0 : a.options !== null;
                            });
                            return <Button className={`h-8 w-16 text-sm xs:h-10 xs:w-20 xs:text-base flex justify-center ${answered ? 'bg-(--primary-color-light) duration-700 hover:bg-(--primary-color)' : 'bg-white border-2 text-(--primary-color) border-(--primary-color)'}`} key={question.id} onClick={() => { setCurrentQuestionIndex(index) }}>{index + 1}</Button>
                        })}
                    </Card>
                </div>
            }
        </div >
    )
}

export default TakeTest
