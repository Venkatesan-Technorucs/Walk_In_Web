import React, { useEffect, useRef, useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { Axios } from '../services/Axios';
import CreateTestDialog from './CreateTestDialog';


const TestManagementCard = () => {
    let navigate = useNavigate();
    let [allTests, setAllTests] = useState([]);
    const toast = useRef(null);
    const [testVisible, setTestVisible] = useState(false);
    // const [questionVisible, setQuestionVisible] = useState(false);

    useEffect(() => {
        let fetchtests = async () => {
            let response = await Axios.get('/api/tests/getAllTests');
            if (response.data.success) {
                setAllTests(response.data.data.tests);
            }
        }
        fetchtests();
    }, [])


    const titleBodyTemplate = (allTests) => {
        return <div>
            <p className='text-base font-medium'>{allTests.title}</p>
            {/* <p className='text-sm text-(--secondary-text-color) font-normal'>{test.subTitle}</p> */}
        </div>
    };

    const questionsBodyTemplate = (allTests) => {
        return <div className='flex items-center gap-1'>
            <i className='pi pi-book'></i>
            <p>{allTests.totalQuestions}</p>
        </div>
    };

    const durationBodyTemplate = (allTests) => {
        return <div className='flex items-center gap-1'>
            <i className='pi pi-clock'></i>
            <p>{allTests.duration}m</p>
        </div>
    };

    const scheduleBodyTemplate = (allTests) => {
        // const startDate = allTests.startDate.split('T')[0];
        // const endDate = allTests.endDate.split('T')[0];
        console.log(allTests.startDate);
        console.log(typeof allTests.startDate);
        return <div>
            <p className='text-sm text-(--secondary-text-color) font-medium'>{allTests.startDate}</p>
            <p className='text-sm text-(--secondary-text-color) font-medium'>{allTests.endDate}</p>
        </div>
    };

    const actionBodyTemplate = (allTests) => { return <Button outlined label={'View'} className='text-(--primary-color)' onClick={() => { navigate(`/test/details/${allTests.id}`) }} /> };

    const statusBodyTemplate = (allTests) => {
        return <Tag value={allTests.isActive ? 'Active' : 'Expired'} severity={getSeverity(allTests)}></Tag>;
    };

    const getSeverity = (allTests) => {
        switch (allTests.isActive) {
            case false:
                return 'danger';
            case true:
                return 'success';
            default:
                return null;
        }
    };

    const showTest = (severity, summary, msg) => {
        toast.current.show({ severity: severity, summary: summary, detail: msg });
    };

    let recentTests = allTests.slice(allTests.length - 3);
    console.log(recentTests);


    return (
        <div>
            <div className='flex justify-between items-center p-2'>
                <div>
                    <h1 className='font-medium text-xl'>Test Management</h1>
                    <h2 className='text-(--secondary-text-color)'>Create and manage aptitude tests</h2>
                </div>
                <Button icon='pi pi-plus' label='Create Test' className='w-42 h-9 bg-linear-135 from-(--primary-color-light) from-0% to-(--primary-color) to-100%' onClick={() => { setTestVisible(true) }} />
                <Toast ref={toast} position="top-right" className='h-5' pt={{ root: 'w-[60%]', content: 'p-2', icon: 'w-4 h-4 mt-1', text: 'text-sm xs:text-base', closeButton: 'w-4 h-3 mt-1' }} />
            </div>
            {testVisible && <CreateTestDialog testVisible={testVisible} setTestVisible={setTestVisible} showTest={showTest} tests={recentTests} />}
            <Card className='rounded-xl' title={`Test (${allTests.length})`}>
                <DataTable value={allTests} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '60rem' }}>
                    <Column field="title" header="Title" body={titleBodyTemplate}></Column>
                    <Column field='questions' header="Questions" body={questionsBodyTemplate}></Column>
                    <Column field="duration" header="Duration" body={durationBodyTemplate}></Column>
                    <Column field="schedule" header="Schedule" body={scheduleBodyTemplate}></Column>
                    <Column field='status' header="Status" body={statusBodyTemplate}></Column>
                    <Column field="action" header="Action" body={actionBodyTemplate}></Column>
                </DataTable>
            </Card>
        </div>
    )
}

export default TestManagementCard
