import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Tag } from 'primereact/tag'
import React from 'react'

const TestQuestionTab = ({ testQuestions }) => {

    const isMultiBodyTemplate = (question) => {
        return <i className={question.isMultiSelect ? 'pi pi-check text-(--primary-color)' : ''}></i>
        // <Tag value={question.isMultiSelect ? 'True' : 'False'} severity={question.isMultiSelect ? 'success' : "danger"}></Tag>
    }

    return (
        <div className=''>
            <h1 className='pl-3 font-bold text-xl'>Questions ({testQuestions.length})</h1>
            <DataTable value={testQuestions} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}>
                <Column field="title" header="Question"></Column>
                <Column field="isMultiSelect" header="Multiple Choice" body={isMultiBodyTemplate} ></Column>
                <Column
                    header="Options"
                    body={(row) => (
                        <div className='flex flex-col gap-2'>
                            {row.options?.map((option, index) => (
                                <div className='flex items-center justify-between'>
                                    <p key={option.id || index}>
                                        {index + 1}. {option.title}
                                    </p>
                                    <p>{option.isCorrect && <i className={`pi pi-check-circle`} style={{ color: "green" }}></i>}</p>
                                </div>
                            ))}
                        </div>
                    )}
                />
            </DataTable>
         </div> 
    )
}

export default TestQuestionTab