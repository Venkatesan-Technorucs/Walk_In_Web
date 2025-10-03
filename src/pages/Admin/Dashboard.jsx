import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button';
import TestManagementCard from '../../components/TestManagementCard';
import UsersManagementCard from '../../components/UsersManagementCard';
import { useAuth } from '../../contexts/AuthContext';
import { Axios } from '../../services/Axios';
import CustomCard from '../../components/common/Card.jsx';


const Dashboard = () => {
    let { state, dispatch } = useAuth();
    let [active, setActive] = useState('usersCard');
    let [dashboardData, setDashboardData] = useState({
        totalAdmins: '',
        totalApplicants: '',
        totalTests: '',
        totalActiveTests: '',
    });

    useEffect(() => {
        let fetchData = async () => {
            try {
                let response = await Axios.get('/api/users/getUsersDashboardDetails');
                setDashboardData({
                    totalAdmins: response.data.data.totalAdmin,
                    totalApplicants: response.data.data.totalApplicant,
                    totalTests: response.data.data.totalTests,
                    totalActiveTests: response.data.data.activeTests
                });
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [])

    const renderCard = () => {
        switch (active) {
            case 'usersCard':
                return <UsersManagementCard />
            case 'testsCard':
                return <TestManagementCard />;

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

    const handleChange = (card) => {
        setActive(card);
        localStorage.setItem('activeDashboardCard', card);
    }

    useEffect(() => {
        const storedCard = localStorage.getItem('activeDashboardCard');
        if (storedCard) {
            setActive(storedCard);
        }
    }, [])

    return (
        <div className='w-full min-h-full flex flex-col bg-[#E6ECF1] p-4'>
            <div className='w-full min-h-full flex flex-col self-center my-5 gap-2'>
                <div className='w-full h-80 xs:h-40 flex flex-col xs:flex-row justify-between items-center gap-12'>
                   {state.user.role === 'SuperAdmin' && <CustomCard pt={pt.dashboardCard} header={adminHeader}>
                        <p className='text-4xl'>{dashboardData.totalAdmins}</p>
                    </CustomCard>}
                    <CustomCard pt={pt.dashboardCard} header={applicantsHeader}>
                        <p className='text-4xl'>{dashboardData.totalApplicants}</p>
                    </CustomCard>
                    <CustomCard pt={pt.dashboardCard} header={testHeader}>
                        <p className='text-2xl xs:text-4xl sm:text-4xl'>{dashboardData.totalActiveTests}</p>
                        <p className='text-xs xs:text-sm sm:text-base'>of {dashboardData.totalTests} total tests</p>
                    </CustomCard>
                </div>
                {/* Users or Tests */}
                <div className='w-full bg-white rounded-xl flex flex-col p-2 gap-1'>
                    <div className='w-full flex border-b-1 border-gray-200 gap-10 mb-2'>
                        <div className={`h-8 w-1/12 py-6 flex justify-center items-center ${active === 'usersCard' ? 'border-b-4 border-green-100' : ''}  hover:cursor-pointer`} onClick={() => { handleChange('usersCard') }}>
                            <p className={`${active === 'usersCard' ? 'text-green-600' : 'text-gray-600'}`}>Users</p>
                        </div>
                        <div className={`h-8 w-1/12 py-6 flex justify-center items-center ${active === 'testsCard' ? 'border-b-4 border-green-100' : ''} hover:cursor-pointer`} onClick={() => { handleChange('testsCard') }}>
                            <p className={`${active === 'testsCard' ? 'text-green-600' : 'text-gray-600'}`}>Tests</p>
                        </div>
                    </div>
                    
                    <div className='min-h-full'>
                        {renderCard()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard