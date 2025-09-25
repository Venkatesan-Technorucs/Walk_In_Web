import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import React from 'react'
import { pt } from '../utils/pt';

const QuestionCard = ({question, testData, setTestData,index, questionData,setQuestionData}) => {


    let onRemove = ()=>{
        let filteredQuestions = testData.questions.filter((_,i)=> i !== index)
        setTestData({...testData,questions:filteredQuestions})
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
                <div className='flex justify-between items-center'>
                    <div className='flex'>
                    <label htmlFor="qtitle" >Question</label>
                    <i className='pi pi-asterisk text-[8px] mt-1'></i>
                    </div>
                    <i className='pi pi-times hover:cursor-pointer' onClick={onRemove}></i>
                </div>
                <InputText id='qtitle' type='text' placeholder='Enter question' value={question.qtitle} className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' />
                {/* {(questionErrors.qtitle && isQuestionErrorView) && <small className='text-xs text-red-500'>{questionErrors.qtitle}</small>} */}
            </div>
            <div className='flex gap-2 items-center'>
                <Checkbox inputId='isMultiSelect' name='isMultiSelect'
                 pt={pt.checkbox} 
                 />
                <label htmlFor="isMultiSelect">Multiple Choice</label>
            </div>
            <div className='flex justify-between items-start'>
                <h1 className='font-bold text-base'>Options</h1>
                <Button type='button' label='Add' outlined className='p-1 text-(--primary-color)' />
            </div>
            <div className='flex flex-col gap-2'>
                {question.options.map((option, index) => {
                    const isSingleMode = !question.isMultiSelect;
                    const anyCorrectSelected = question.options.some(opt => opt.isCorrect);
                    return (
                        <div>
                            <div className='flex items-center justify-between'>
                                <Checkbox className=''
                                 pt={pt.checkbox}
                                  inputId={index} checked={option.isCorrect} disabled={isSingleMode && anyCorrectSelected && !option.isCorrect} onChange={(e) => {
                                    let newOptions = [...question.options];
                                    if (isSingleMode) {
                                        newOptions = newOptions.map((opt, i) => ({
                                            ...opt,
                                            isCorrect: i === index ? e.checked : false,
                                        }));
                                    } else {
                                        newOptions[index].isCorrect = e.checked;
                                    }
                                    // setQuestionData({ ...questionData, options: newOptions });
                                }
                                } />
                                <InputText id={`option-${index}`} className='h-6 w-[80%] bg-gray-100 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' placeholder={`Enter option ${index + 1}`} value={option.title} pt={{ root: 'py-1' }} 
                                // onChange={(e) => {
                                //     let newOptions = [...questionData.options];
                                //     newOptions[index].title = e.target.value;
                                //     setQuestionData({ ...questionData, options: newOptions });
                                // }} 
                                />
                                <Button type='button' outlined icon='pi pi-trash text-xs' className='p-0 w-6 text-(--primary-color)'
                                //  onClick={() => { handleRemoveOption(index) }} 
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