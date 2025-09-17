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
import { ProgressBar } from 'primereact/progressbar';

const ResultsManagementCard = () => {
    const [selectedScores, setSelectedScores] = useState(null);
    const scores = [
        { name: 'Above 90', code: 'A9' },
        { name: 'Above 80', code: 'A8' },
        { name: 'Above 70', code: 'A7' },
        { name: 'Above 60', code: 'A6' },
        { name: 'Above 50', code: 'A5' },
    ];

    const results = [
        {
            id: 0,
            userName: "Test User",
            userEmail: "user@test.com",
            testName: 'Sample Aptitude Test',
            score: '1/3',
            percentage: '33%',
            timeSpent: '0m 23s',
            submitted: '9/11/2025, 11:50:27 AM',
        },
    ]

    const userBodyTemplate = (results) => {
        return <div>
            <p className='text-base font-medium'>{results.userName}</p>
            <p className='text-sm text-(--secondary-text-color) font-normal'>{results.userEmail}</p>
        </div>
    };


    const getPercentage = (results) => {
        const percentage = parseInt(results.percentage);
        if (percentage > 75) return { label: 'Excellent', className: 'bg-green-600', severity: 'success' };
        else if (percentage <= 75 && percentage > 50) return { label: 'Good', className: 'bg-blue-500', severity: 'info' };
        else if (percentage <= 50 && percentage > 25) return { label: 'Average', className: 'bg-yellow-500', severity: 'warning' };
        else if (percentage <= 25) return { label: 'Poor', className: 'bg-red-600', severity: 'danger' };
        else return { label: 'None', className: '', severity: null };
    }

    const percentageBodyTemplate = (results) => {
        const percentage = getPercentage(results);
        const percentageValue = parseInt(results.percentage);
        return (
            <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-1 justify-center'>
                    <span>{results.percentage}</span>
                    <Tag value={percentage.label} severity={percentage.severity}></Tag>
                </div>
                <ProgressBar value={percentageValue} className='h-4 text-xs rounded-4xl font-bold' pt={{ value: `${percentage.className}` }}></ProgressBar>
            </div>
        )
    };




    return (
        <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center p-2'>
                <div>
                    <h1 className='font-medium text-xl'>Test Results</h1>
                    <h2 className='text-(--secondary-text-color)'>View and analyze test performance</h2>
                </div>
                <Button outlined icon='pi pi-download' label='Export CSV' className='w-42 h-9 text-(--primary-color) border-green-500' />
            </div>
            <Card title='Filters' className='rounded-xl'>
                <div className='w-full flex justify-evenly gap-2'>
                    <div className='w-full'>
                        <label htmlFor="">Search</label>
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-search"> </InputIcon>
                            <InputText placeholder="Search by user or test..." />
                        </IconField>
                    </div>
                    <div className="w-full">
                        <div className='flex flex-col'>
                            <label htmlFor="">Score Range</label>
                            <MultiSelect value={selectedScores} onChange={(e) => setSelectedScores(e.value)} options={scores} optionLabel="name"
                                placeholder="Select Roles" maxSelectedLabels={3} className="w-full md:w-20rem" />
                        </div>
                    </div>
                </div>
            </Card>
            <Card className='rounded-xl' title='Test Results (1)' subTitle='Detailed results for all completed tests'>
                <DataTable value={results} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '60rem' }}>
                    <Column field="user" header="User" body={userBodyTemplate} ></Column>
                    <Column field='testName' header="Test"></Column>
                    <Column field='score' header="Score"></Column>
                    <Column field="percentage" header="Percentage" body={percentageBodyTemplate}></Column>
                    <Column field="timeSpent" header="Time Spent"></Column>
                    <Column field="submitted" header="Submitted"></Column>
                </DataTable>
            </Card>
        </div>
    )
}

export default ResultsManagementCard