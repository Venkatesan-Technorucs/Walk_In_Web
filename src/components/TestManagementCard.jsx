import React, { useEffect, useRef, useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { Axios } from '../services/Axios';
import DateFilter from './DateFilter';

const TestManagementCard = () => {
    let navigate = useNavigate();
    let [allTests, setAllTests] = useState([]);
    let [totalRecords, setTotalRecords] = useState(0);
    let [dateRange, setDateRange] = useState({ startDate: new Date(), endDate: new Date() });
    let [rows, setRows] = useState(5);
    let [page, setPage] = useState(0);
    let [loading, setLoading] = useState(false);
    let [filterText, setFilterText] = useState('');
    const toast = useRef(null);
    const [testVisible, setTestVisible] = useState(false);
    let [msg,setMsg] = useState('');


    let fetchTests = async (pageIndex = 0, pageSize = 0, filterText = '', dateRange = {}) => {
        setLoading(true);
        try {
            let skip = pageIndex * pageSize;
            let response = await Axios.post(`/api/tests/getAllTests?skip=${skip}&limit=${pageSize}&search=${filterText}`, { dateRange });
            if (response.data.success) {
                let fetchedTests = response.data?.data.tests || [];
                let total = response.data?.data.totalTests || 0;
                setAllTests(fetchedTests);
                setTotalRecords(total);
            } else {
                setMsg(response?.data?.message);
            }
        }
        catch (error) {
            setMsg(error?.response?.data?.message);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            fetchTests(page, rows, filterText, dateRange);
            return;
        }
    }, [dateRange.startDate, dateRange.endDate]);

    useEffect(() => {
        fetchTests(page, rows, filterText);
    }, []);

    const onPageChange = (event) => {
        setPage(event.page);
        setRows(event.rows);
        fetchTests(event.page, event.rows, filterText, dateRange);
    };

    let handleChange = (e) => {
        let search = e.target.value;
        setFilterText(search);
        setPage(0);
        fetchTests(0, rows, search, dateRange);
    }

    const titleBodyTemplate = (allTests) => {
        return <div>
            <p className='text-base font-medium'>{allTests.title}</p>
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
        return <div className='flex items-center gap-1'>
            <p className='text-sm text-(--secondary-text-color) font-medium'>{allTests.startDate}</p> -
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

    return (
        <div className='min-h-screen h-full flex flex-col gap-2'>
            <div className='flex justify-between items-center p-2'>
                <div>
                    <h1 className='font-medium text-xl'>Test Management</h1>
                    <h2 className='text-(--secondary-text-color)'>Create and manage aptitude tests</h2>
                </div>
                <Button icon='pi pi-plus' label='Create Test' className='w-42 h-9 bg-(--primary-color-light) duration-700 hover:bg-(--primary-color)' onClick={() => { navigate('/create/test') }} />
                <Toast ref={toast} position="top-right" className='h-5' pt={{ root: 'w-[60%]', content: 'p-2', icon: 'w-4 h-4 mt-1', text: 'text-sm xs:text-base', closeButton: 'w-4 h-3 mt-1' }} />
            </div>
            {testVisible && <CreateTestDialog testVisible={testVisible} setTestVisible={setTestVisible} showTest={showTest} tests={allTests} fetchedTests={fetchTests} />}
            <Card className='rounded-xl' header={
                <div className='flex justify-between items-center p-4'>
                    <div>
                        <div className='text-2xl font-medium text-(--primary-text-color)'>Tests - ({totalRecords})</div>
                        <div className='text-shadow-2xs font-light text-(--secondary-text-color)'>Manage all Tests in the system</div>
                    </div>
                    <div className='flex gap-4'>
                        <span className='p-input-icon-left mr-4'>
                            <DateFilter dateRange={dateRange} setDateRange={setDateRange} />
                        </span>
                        <span className="p-input-icon-left w-1/2">
                            <InputIcon icon="pi pi-search"> </InputIcon>
                            <InputText id="filterText" type="search" value={filterText} onChange={handleChange} className='w-full' placeholder="Search Tests" />
                        </span>
                    </div>
                </div>}>
                <DataTable lazy value={allTests} paginator rows={rows} first={page * rows} totalRecords={totalRecords} onPage={onPageChange} loading={loading} emptyMessage='No tests available' tableStyle={{ minWidth: '60rem' }}>
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
