import React, { useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';

const QuestionsManagementCard = () => {
    const [selectedCities, setSelectedCities] = useState(null);
    const [selectedDifficulties, setSelectedDifficulties] = useState(null);
    const cities = [
        { name: 'Quantitative', code: 'Q' },
        { name: 'General', code: 'RM' },
        { name: 'Lo', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
     const difficulties = [
        { name: 'Easy', code: 'E' },
        { name: 'Medium', code: 'M' },
        { name: 'Hard', code: 'H' },
    ];

    const questions = [
        {
            id: 0,
            question: "What is 2+2",
            category: 'Quantitative',
            difficulty: 'Easy',
            options: '4 options',
        },
        {
            id: 0,
            question: "Which of the following are prime numbers?",
            category: 'Quantitative',
            difficulty: 'Medium',
            options: '5 options',
        },
        {
            id: 0,
            question: "What is the capital of France?",
            category: 'General',
            difficulty: 'Easy',
            options: '4 options',
        },
    ]


    const categoryBodyTemplate = (questions) => {
        return <Tag value={questions.category} className='text-black bg-white border-1 border-(--primary-color)'></Tag>;
    };

    const difficultyBodyTemplate = (questions) => {
        return <Tag value={questions.difficulty} className='bg-gray-200 text-black rounded-lg'></Tag>;
    };

    const actionBodyTemplate =
        (
            <div className='flex justify-center items-center gap-2'>
                <Button outlined icon='pi pi-pen-to-square' className='text-(--primary-color)' />
                <Button outlined icon='pi pi-trash' className='text-(--primary-color)' />
            </div>
        );


    return (
        <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center p-2'>
                <div>
                    <h1 className='font-medium text-xl'>Question Management</h1>
                    <h2 className='text-(--secondary-text-color)'>Create and manage MCQ questions</h2>
                </div>
                <div className='flex justify-center items-center gap-2'>
                    <Button outlined icon='pi pi-download' label='Export CSV' className='w-42 h-9 text-(--primary-color) border-green-500' />
                    <Button icon='pi pi-plus' label='Add Questions' className='w-42 h-9 bg-linear-135 from-(--primary-color-light) from-0% to-(--primary-color) to-100%' />
                </div>
            </div>
            <Card title='Filters' className='rounded-xl'>
                <div className='w-full flex justify-evenly gap-2'>
                    <div className='w-full'>
                        <label htmlFor="">Search</label>
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-search"> </InputIcon>
                            <InputText placeholder="Search questions..." />
                        </IconField>
                    </div>
                    <div className="w-full">
                        <div className='flex flex-col'>
                        <label htmlFor="">Category</label>
                        <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                            placeholder="Select Cities" maxSelectedLabels={3} className="w-full md:w-20rem" />
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className='flex flex-col'>
                        <label htmlFor="">Difficulty</label>
                        <MultiSelect value={selectedDifficulties} onChange={(e) => setSelectedDifficulties(e.value)} options={difficulties} optionLabel="name"
                            placeholder="Select Difficulty" maxSelectedLabels={2} className="w-full md:w-20rem" />
                        </div>
                    </div>
                </div>
            </Card>
            <Card className='rounded-xl' title='Questions (3)'>
                <DataTable value={questions} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '60rem' }}>
                    <Column field="question" header="Question" ></Column>
                    <Column field='category' header="Category" body={categoryBodyTemplate}></Column>
                    <Column field="difficulty" header="Difficulty" body={difficultyBodyTemplate}></Column>
                    <Column field="options" header="Options"></Column>
                    <Column field='actions' header="Action" body={actionBodyTemplate}></Column>
                </DataTable>
            </Card>
        </div>
    )
}

export default QuestionsManagementCard