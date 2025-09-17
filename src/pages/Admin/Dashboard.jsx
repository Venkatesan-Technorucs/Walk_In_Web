import React, { useState } from 'react'
import Header from '../../components/Header'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button';
import TestManagementCard from '../../components/TestManagementCard';
import QuestionsManagementCard from '../../components/QuestionsManagementCard';
import UsersManagementCard from '../../components/UsersManagementCard';
import ResultsManagementCard from '../../components/ResultsManagementCard';


const Dashboard = () => {

    let [active, setActive] = useState('');

    const renderCard = () => {
        switch (active) {
            case 'usersCard':
                return <UsersManagementCard/>
            case 'questionsCard':
                return <QuestionsManagementCard />;
            case 'testsCard':
                return <TestManagementCard />;
            case 'resultsCard':
                return <ResultsManagementCard/>
        }
    };

    const pt = {
        dashboardCard: {
            body: 'p-0',
            content: 'p-0 mt-1'
        },
    }

    const adminHeader = (
        <div className='flex justify-between'>
            <h1>Total Admins</h1>
            <i className='pi pi-users'></i>
        </div>
    );
    const applicantsHeader = (
        <div className='flex justify-between'>
            <h1>Total Applicants</h1>
            <i className='pi pi-users'></i>
        </div>
    );
    const questionsHeader = (
        <div className='flex justify-between'>
            <h1>Total Questions</h1>
            <i className='pi pi-question'></i>
        </div>
    );
    const testHeader = (
        <div className='flex justify-between'>
            <h1>Active Tests</h1>
            <i className='pi pi-book'></i>
        </div>
    );
    const items = [
        {
            label: 'User Management',
        },
        {
            label: 'Questions',
        },
        {
            label: 'Tests',
        },
        {
            label: 'Results',
        },
    ]
    return (
        <div className='w-full h-full flex flex-col bg-[#E6ECF1]'>
            {/* Header */}
            <Header />
            {/* Body */}
            <div className='w-3/4 h-full flex flex-col self-center my-5 gap-2'>
                <div className=''>
                    <h1 className='text-2xl font-medium'>Super Admin Dashboard</h1>
                    <h2 className='text-lg text-(--secondary-text-color) '>Manage the entire aptitude test platform</h2>
                </div>
                <div className='w-full h-40 flex justify-center items-center gap-10'>
                    <Card className='w-50 h-30 p-5 rounded-2xl border border-gray-400' pt={pt.dashboardCard} header={adminHeader}>
                        <p className='text-4xl'>6</p>
                    </Card>
                    <Card className='w-50 h-30 p-5 rounded-2xl border border-gray-400' pt={pt.dashboardCard} header={applicantsHeader}>
                        <p className='text-4xl'>6</p>
                    </Card>
                    <Card className='w-50 h-30 p-5 rounded-2xl border border-gray-400' pt={pt.dashboardCard} header={questionsHeader}>
                        <p className='text-4xl'>6</p>
                    </Card>
                    <Card className='w-50 h-30 p-5 rounded-2xl border border-gray-400' pt={pt.dashboardCard} header={testHeader}>
                        <p className='text-4xl'>6</p>
                        <p className='text-sm'>of 2 total tests</p>
                    </Card>
                </div>
                <div className='card w-full h-12 bg-white rounded-4xl flex items-center p-2 gap-1 hover:cursor-pointer'>
                    <div className={`h-8 rounded-4xl w-1/4 flex justify-center items-center ${active==='usersCard' ? 'bg-green-100' : ''}`} onClick={()=>{setActive('usersCard')}}>
                        <p>User Management</p>
                    </div>
                    <div className={`h-8 rounded-4xl w-1/4 flex justify-center items-center ${active ==='questionsCard' ? 'bg-green-100' : ''}`} onClick={()=>{setActive('questionsCard')}}>
                        <p>Questions</p>
                    </div>
                    <div className={`h-8 rounded-4xl w-1/4 flex justify-center items-center ${active==='testsCard' ? 'bg-green-100' : ''}`} onClick={()=>{setActive('testsCard')}}>
                        <p>Tests</p>
                    </div>
                    <div className={`h-8 rounded-4xl w-1/4 flex justify-center items-center ${active==='resultsCard' ? 'bg-green-100' : ''}`} onClick={()=>{setActive('resultsCard')}}>
                        <p>Results</p>
                    </div>
                </div>
                <div className=''>
                    {renderCard()}
                </div>
            </div>
        </div>
    )
}

export default Dashboard