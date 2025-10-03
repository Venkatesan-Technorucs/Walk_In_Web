import React, { lazy, useEffect, useRef, useState } from 'react'
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
import ClearFilter from './common/ClearFilter';

const TestManagementCard = () => {
    let navigate = useNavigate();
    let [allTests, setAllTests] = useState([]);
    let [totalRecords, setTotalRecords] = useState(0);
    let [startDate, setStartDate] = useState(new Date());
    let [endDate, setEndDate] = useState(new Date());
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
        if (startDate && endDate) {
            fetchTests(page, rows, filterText, { startDate, endDate });
            return;
        }
    }, [startDate, endDate]);

    // useEffect(() => {
    //     fetchTests(page, rows, filterText);
    // }, []);

    // const onPageChange = (event) => {
    //     setPage(event.page);
    //     setRows(event.rows);
    //     // fetchTests(event.page, event.rows, filterText, dateRange);
    // };

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

    const handleClearFilter = () => {
        setFilterText('');
        setStartDate(new Date());
        setEndDate(new Date());
        fetchTests(0, rows, '', {});
    }

    const showTest = (severity, summary, msg) => {
        toast.current.show({ severity: severity, summary: summary, detail: msg });
    };

    return (
        <div className='min-h-full flex flex-col gap-2'>
            {/* {testVisible && <CreateTestDialog testVisible={testVisible} setTestVisible={setTestVisible} showTest={showTest} tests={allTests} fetchedTests={fetchTests} />} */}
            <div>
                {<div className='w-full flex justify-between items-center gap-1 py-2'>
                    <div className='w-full flex gap-2 items-center'>
                        <IconField iconPosition='left' className="w-1/3 h-12">
                            <InputIcon className="pi pi-search"> </InputIcon>
                            <InputText id="filterText" type="search" value={filterText} onChange={handleChange} className='w-full h-12 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' placeholder="Search Tests" />
                        </IconField>
                        <span className='w-1/6 h-12 m-0'>
                            <DateFilter startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
                        </span>
                        <ClearFilter onClear={handleClearFilter} />
                    </div>
                    
                    <div className='flex justify-between items-center p-2'>
                        <Button icon='pi pi-plus' label='Create Test' className='w-42 h-12 bg-(--primary-color-light) duration-700 hover:bg-(--primary-color)' onClick={() => { navigate('/create/test') }} />
                        <Toast ref={toast} position="top-right" className='h-5' pt={{ root: 'w-[60%]', content: 'p-2', icon: 'w-4 h-4 mt-1', text: 'text-sm xs:text-base', closeButton: 'w-4 h-3 mt-1' }} />
                    </div>
                </div>}
                <DataTable value={allTests} paginator rows={rows} totalRecords={totalRecords} loading={loading} emptyMessage='No tests available' tableStyle={{ minWidth: '60rem' }}>
                    <Column field="title" header="Title" body={titleBodyTemplate}></Column>
                    <Column field='questions' header="Questions" body={questionsBodyTemplate}></Column>
                    <Column field="duration" header="Duration" body={durationBodyTemplate}></Column>
                    <Column field="schedule" header="Schedule" body={scheduleBodyTemplate}></Column>
                    <Column field='status' header="Status" body={statusBodyTemplate}></Column>
                    <Column field="action" header="Action" body={actionBodyTemplate}></Column>
                </DataTable>
            </div>
        </div>
    )
}

export default TestManagementCard
