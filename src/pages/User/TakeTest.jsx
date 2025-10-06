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
    let [loading, setLoading] = useState(false);
    let [msg, setMsg] = useState('');

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
                setMsg(error?.message);
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
                    if (updatedCount > 20) {
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
        setLoading(true);
        try {
            setLoading(true);
            let response = await Axios.post('/api/tests/submitAnswer', { "attemptId": test.attempt, 'questionAnswers': answers });
        } catch (error) {
            setMsg(error?.message);
        }
        finally {
            setLoading(false);
            navigate('/logout');

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
            root: 'rounded-xl',
            body: 'p-5 ',
            content: 'p-0 flex flex-col gap-3'
        },
        questionsCard: {
            root: 'rounded-xl',
            body: 'p-0',
            content: 'p-5 flex flex-col gap-3'
        },
        questionsNavigatorCard: {
            root: 'rounded-xl',
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
            <div className="flex items-center justify-center">
                {isLoading ? (
                    <div className='w-full h-full flex items-center justify-center self-center bg-[#E6ECF1]'>
                        <ProgressSpinner className='h-16' />
                    </div>
                ) : (
                    <div className="flex flex-row gap-6 w-full h-[750px] items-stretch p-4">
                        <div className="flex-1 flex flex-col justify-between bg-white rounded-xl shadow-2xs border border-[#E3E8EF] p-8 min-w-[600px]">
                            <div className="mb-2">
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <h2 className="font-bold text-2xl text-[#1A2E3B] mb-1">{title}</h2>
                                        <div className="text-gray-500 text-base">Question {currentQuestionIndex + 1} of {totalQuestions}</div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#F6FAFF] px-3 py-2 rounded-lg">
                                        <span className="font-semibold text-lg">{duration ? <CountdownTimer duration={duration * 60} active={true} onComplete={handleSubmit} /> : '--:--'}</span>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                                        <span>Progress</span>
                                        <span>{answeredCount}/{totalQuestions} answered</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#E3E8EF] rounded-full">
                                        <div className="h-2 rounded-full bg-[#4CAF50] transition-all duration-300" style={{ width: `${progressCount}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            {questions.length > 0 && (
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="mb-4">
                                        <div className="font-semibold text-lg mb-2">Question {currentQuestionIndex + 1}.</div>
                                        <div className="text-base text-[#1A2E3B] mb-4">{questions[currentQuestionIndex]?.title}</div>
                                        <div className="flex flex-col gap-3">
                                            {questions[currentQuestionIndex]?.options.map((option, idx) => {
                                                const selected = isSelected(questions[currentQuestionIndex].id, option.id);
                                                return !questions[currentQuestionIndex]?.isMultiSelect ? (
                                                    <div
                                                        key={option.id}
                                                        className={`border rounded-lg px-4 py-3 flex items-center cursor-pointer transition-all duration-200 text-base font-medium ${selected ? 'bg-[#E8F5E9] border-[#4CAF50] text-[#388E3C]' : 'bg-white border-[#E3E8EF] hover:bg-[#F6FAFF]'} `}
                                                        onClick={() => handleAnswer(questions[currentQuestionIndex].id, option.id, false)}
                                                    >
                                                        <span className="mr-2 font-bold">{idx + 1}.</span> {option.title}
                                                    </div>
                                                ) : (
                                                    <div
                                                        key={option.id}
                                                        className={`border rounded-lg px-4 py-3 flex items-center cursor-pointer transition-all duration-200 text-base font-medium ${selected ? 'bg-[#E8F5E9] border-[#4CAF50] text-[#388E3C]' : 'bg-white border-[#E3E8EF] hover:bg-[#F6FAFF]'} `}
                                                        onClick={() => handleAnswer(questions[currentQuestionIndex].id, option.id, true)}
                                                    >
                                                        <Checkbox inputId='option.id' checked={selected} readOnly className="mr-2" pt={pt.checkbox}/>
                                                        <span className="mr-2 font-bold">{idx + 1}.</span> {option.title}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end mt-4">
                                <Button
                                    label={currentQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Next'}
                                    className="bg-[#4CAF50] text-white px-8 py-2 rounded-lg text-base font-semibold shadow-none border-none hover:bg-[#388E3C]"
                                    loading={loading}
                                    onClick={() => {
                                        if (currentQuestionIndex === totalQuestions - 1) {
                                            handleSubmit(answers);
                                        } else {
                                            handleNext();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="min-w-[300px] w-full max-w-[600px] h-fit bg-white rounded-xl shadow-2xs border border-[#E3E8EF] p-6 flex flex-col">
                            <div className="font-bold text-lg mb-4 text-[#1A2E3B]">Question Navigator</div>
                            <div className="flex gap-3">
                                {questions.map((question, idx) => {
                                    const isCurrent = idx === currentQuestionIndex;
                                    return (
                                        <button
                                            key={question.id}
                                            className={`w-10 h-10 rounded-lg border text-lg font-bold flex items-center justify-center transition-all duration-200 ${isCurrent ? 'bg-[#E8F5E9] border-[#4CAF50] text-[#388E3C]' : 'bg-white border-[#E3E8EF] text-[#1A2E3B] hover:bg-[#F6FAFF]'}`}
                                            onClick={() => setCurrentQuestionIndex(idx)}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
    )
}

export default TakeTest
