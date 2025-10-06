import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react'
import { pt } from '../utils/pt';

const QuestionCard = ({ question, testData, setTestData, index, handleQuestionChange, handleOptionChange }) => {

    let onRemove = () => {
        let filteredQuestions = testData.questions.filter((_, i) => i !== index)
        setTestData({ ...testData, questions: filteredQuestions })
    }

    return (
        <div className='flex flex-col gap-4 p-3'>
            <div className='flex flex-col gap-1'>
                <div className='flex justify-between items-center'>
                    <div className='flex'>
                        <>
                            {index + 1}.
                            <label htmlFor="qtitle" >Question</label>
                        </>
                        <i className='pi pi-asterisk text-[8px] mt-1'></i>
                    </div>
                    <i className='pi pi-times hover:cursor-pointer' onClick={onRemove}></i>
                </div>
                <InputText id='qtitle' type='text' placeholder='Enter question' value={question.qtitle} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' onChange={(e) => { handleQuestionChange('qtitle', e.target.value, index) }} />
            </div>
            <div className='flex gap-2 items-center'>
                <Checkbox inputId='isMultiSelect' name='isMultiSelect' checked={question.isMultiSelect}
                    pt={pt.checkbox} onChange={(e) => { handleQuestionChange('isMultiSelect', e.checked, index) }}
                />
                <label htmlFor="isMultiSelect">Multiple Choice</label>
            </div>
            <div className='flex justify-between items-start'>
                <h1 className='font-medium text-base'>Options</h1>
                <Button type='button' outlined icon='pi pi-plus text-xs' className='p-0 w-6 text-(--primary-color)' disabled={question.options.length >= 6}
                    onClick={() => {
                        const newOptions = [...question.options,{title:"",isCorrect:false}]
                        handleQuestionChange("options", newOptions, index)
                    }} />
            </div>
            <div className='flex flex-col gap-2'>
                {question.options.map((option, oIndex) => {
                    const isSingleMode = !question.isMultiSelect;
                    const anyCorrectSelected = question.options.some(opt => opt.isCorrect);
                    return (
                        <div>
                            <div className='flex items-center justify-between'>
                                <Checkbox className='mr-2' pt={pt.checkbox}
                                    inputId={oIndex} checked={option.isCorrect} disabled={isSingleMode && anyCorrectSelected && !option.isCorrect} onChange={(e) => {
                                        let newOptions = [...question.options];
                                        if (isSingleMode) {
                                            newOptions = newOptions.map((opt, optionIndex) => ({
                                                ...opt,
                                                isCorrect: optionIndex === oIndex ? e.checked : false,
                                            }));
                                        } else {
                                            newOptions[oIndex] = { ...newOptions[oIndex], isCorrect: e.checked };
                                        }
                                        handleQuestionChange('options', newOptions, index)
                                    }
                                    } />
                                <InputText id={`option-${oIndex}`} className='h-8 w-full mr-2 bg-gray-100 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' placeholder={`Enter option ${oIndex + 1}`} value={option.title} pt={{ root: 'py-1' }}
                                    onChange={(e) => { handleOptionChange(`title`, index, oIndex, e.target.value) }}
                                />
                                <Button type='button' outlined icon='pi pi-minus text-xs' className='p-0 w-6 text-red-400' disabled={question.options.length <= 2}
                                    onClick={() => {
                                        const newOptions = question.options.filter((_, i) => i !== oIndex);
                                        handleQuestionChange("options", newOptions, index)
                                    }}
                                />
                                <div className='flex items-center gap-2'>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <p>Select the correct answers</p>
            </div>
        </div>
    )
}

export default QuestionCard