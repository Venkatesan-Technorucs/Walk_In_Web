import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import {useNavigate } from 'react-router-dom';
import { Axios } from '../../services/Axios';
import { useAuth } from '../../contexts/AuthContext';

const Home = () => {
    let navigate = useNavigate();
    let { state, dispatch } = useAuth();
    let [tests, setTests] = useState([]);
    let [msg, setMsg] = useState('');
    let [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let fetchTests = async () => {
            try {
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');

                const formattedDate = `${yyyy}-${mm}-${dd}`;

                let payload = {
                    date: formattedDate,
                    tests_page: true
                }
                let response = await Axios.post('/api/tests/testbyDate', payload);
                setTests(response.data.data.tests);
            } catch (error) {
                    setMsg(error.response.data.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTests();
    }, []);

    let handleTakeTest = async (id) => {
        try {
            let response = await Axios.post('/api/tests/startAttempt', { testId: id }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            let user = { ...state.user, test: { ...response.data.data } };
            dispatch({ type: "TEST_STARTED", payload: user });
            navigate(`/take-test/${id}`)
        } catch (error) {
            console.log(error);
        }
    }

    const pt = {
        testsNavigatorCard: {
            root: 'w-70 h-50 p-3 flex flex-col gap-1 items-center justify-center rounded-xl ',
            body: 'p-0',
            header: 'uppercase text-right',
            title: 'text-xl font-bold font-normal capitalize',
            subTitle: 'text-base font-normal',
            content: 'p-0 flex flex-col gap-2',
            footer: 'px-0 pt-2 pb-0 '
        },
    };



    return (
        <div className='w-full h-full flex flex-col'>
            {/* Header */}
            {/* <Header name={state.user.name} role={state.user.role} /> */}
            {/* Body */}
            {isLoading
                ? <div className='w-full min-h-[calc(100vh-100px)] flex items-center justify-center self-center bg-[#E6ECF1]'>
                    <ProgressSpinner className='h-16' />
                </div>
                : <div className='w-full min-h-[calc(100vh-100px)] px-[5%] py-4 bg-[#E6ECF1]'>
                    <div className='w-full h-full flex flex-col items-center xs:flex-row xs:items-start xs:justify-center md:justify-start xs:flex-wrap gap-x-4 gap-y-2'>
                        {tests?.map((test) => {
                            return (
                                <Card className='' key={test.id} title={test.title} subTitle={`${test.totalQuestions} Questions`} pt={pt.testsNavigatorCard} >
                                    <div className='flex items-center gap-1 text-sm'>
                                        <i className='pi pi-clock'></i>
                                        {test.duration}m
                                    </div>
                                    <Button label="Take Test" icon="pi pi-book" onClick={()=>{handleTakeTest(test.id)}} className='w-30 bg-(--primary-color-light) duration-700 hover:bg-(--primary-color)  p-2' />
                                </Card>
                            );
                        })}
                    </div>

                </div>
            }
        </div >
    )
}

export default Home