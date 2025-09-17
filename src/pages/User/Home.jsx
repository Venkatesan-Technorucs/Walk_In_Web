import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import { Axios } from '../../services/Axios';

const Home = () => {
    let navigate = useNavigate();
    let [tests, setTests] = useState([]);
    let [isActive,setIsActive] = useState(true);
    let [isLoading, setisLoading] = useState(true);


    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                let response = await Axios.get(`/api/tests/getTest/2`);
                setTests(response.data);
                setIsActive(response.data.isActive);
                // let response = await Axios.get('/api/tests/getAllTests');
                // setTests(response.data);

            } catch (error) {
                console.log(error);
            } finally {
                setisLoading(false);
            }
        }
        fetchQuestion();
    }, []);

    let handleTakeTest = async () => {
        try {
            let response = await Axios.post('/api/tests/startAttempt', { testId: 2 });
            let { attempt, sessionId } = response.data;
            sessionStorage.setItem("attempt", attempt);
            sessionStorage.setItem("sessionId", sessionId);
        } catch (error) {
            console.log(error);
        } finally {
            navigate(`take-test/${2}`)
        }
    }

    const pt = {
        progressCard: {
            body: 'p-3 ',
            content: 'p-0 flex flex-col gap-3'
        },
        questionsCard: {
            root: 'self-center',
            body: 'p-0',
            content: 'px-5 py-2 flex flex-col'
        },
        testsNavigatorCard: {
            root: 'w-60 h-50 p-3 rounded-3xl',
            body: 'p-0',
            header: 'uppercase text-right',
            title: 'text-2xl font-bold  font-normal capitalize',
            subTitle:'text-lg font-normal',
            content: 'p-0 flex gap-3 flex-wrap',
            footer: 'px-0 pt-2 pb-0 '
        },
    };

    const getTag = () => {
        if(isActive) return { label: 'Active', severity: 'success' };
    };

    console.log(tests.isActive);
    const header = () => {
        const tag = getTag();
        return (<Tag value={tag.label} severity={tag.severity}></Tag>);
    };
    const footer = (
        <Button label="Take Test" icon="pi pi-book" onClick={handleTakeTest} className='bg-linear-135 from-(--primary-color-light) from-0% to-(--primary-color) to-100%  p-2' />
    );
    const title = (
        <h1>{tests.title}</h1>
    )

    return (
        <div className='w-full h-full flex flex-col'>
            {/* Header */}
            <Header />
            {/* Body */}
            {isLoading
                ? <div className='w-full min-h-[calc(100vh-80px)] flex items-center justify-center self-center bg-[#E6ECF1]'>
                    <ProgressSpinner className='h-16' />
                </div>
                : <div className='w-full min-h-[calc(100vh-80px)] flex flex-col px-[10%] py-4 gap-4 bg-[#E6ECF1]'>
                    <Card className='' title={title} subTitle={`${tests.totalQuestions} Questions`} header={header} footer={footer} pt={pt.testsNavigatorCard} >
                        <div className='flex items-center gap-2'>
                            <i className='pi pi-clock'></i>
                            {tests.duration}m
                        </div>
                    </Card>
                </div>
            }
        </div >
    )
}

export default Home