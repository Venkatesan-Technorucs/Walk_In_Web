import React from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';

const TestManagementCard = () => {
    const test = [
        {
            id: 0,
            title: "Sample Aptitude Test One",
            subTitle: 'A sample test  with basic questions covering quantitative and general knowledge',
            questions: 3,
            duration: '30m',
            scheduleFrom: '9/11/2025, 10:46:54 AM',
            scheduleTo: 'to 10/11/2025, 11:46:54 AM',
            status: 'expired',
            action: 'view'
        },
        {
            id: 1,
            title: "Sample Aptitude Test Two",
            subTitle: 'A sample test  with basic questions covering quantitative and general knowledge',
            questions: 3,
            duration: '30m',
            scheduleFrom: '9/11/2025, 10:46:54 AM',
            scheduleTo: 'to 10/11/2025, 11:46:54 AM',
            status: 'active',
            action: 'view'
        },
        {
            id: 2,
            title: "Sample Aptitude Test Three",
            subTitle: 'A sample test  with basic questions covering quantitative and general knowledge',
            questions: 3,
            duration: '30m',
            scheduleFrom: '9/11/2025, 10:46:54 AM',
            scheduleTo: 'to 10/11/2025, 11:46:54 AM',
            status: 'expired',
            action: 'view'
        },
    ]

    const titleBodyTemplate = (test) => {
        return <div>
            <p className='text-base font-medium'>{test.title}</p>
            <p className='text-sm text-(--secondary-text-color) font-normal'>{test.subTitle}</p>
        </div>
    };

    const questionsBodyTemplate = (test) => {
        return <div className='flex items-center gap-1 justify-center'>
            <i className='pi pi-book'></i>
            <p>{test.questions}</p>
        </div>
    };

    const durationBodyTemplate = (test) => {
        return <div className='flex items-center gap-1 justify-center'>
            <i className='pi pi-clock'></i>
            <p>{test.duration}</p>
        </div>
    };

    const scheduleBodyTemplate = (test) => {
        return <div>
            <p className='text-base font-medium'>{test.scheduleFrom}</p>
            <p className='text-sm text-(--secondary-text-color) font-normal'>{test.scheduleTo}</p>
        </div>
    };

    const actionBodyTemplate = (test) => { return <Button outlined label={test.action} className='text-(--primary-color)' /> };

    const statusBodyTemplate = (test) => {
        return <Tag value={test.status} severity={getSeverity(test)}></Tag>;
    };

    const getSeverity = (test) => {
        switch (test.status) {
            case 'expired':
                return 'danger';

            case 'active':
                return 'success';
            default:
                return null;
        }
    };
    
    return (
        <div>
            <div className='flex justify-between items-center p-2'>
                <div>
                    <h1 className='font-medium text-xl'>Test Management</h1>
                    <h2 className='text-(--secondary-text-color)'>Create and manage aptitude tests</h2>
                </div>
                <Button icon='pi pi-plus' label='Create Test' className='w-42 h-9 bg-linear-135 from-(--primary-color-light) from-0% to-(--primary-color) to-100%' />
            </div>
            <Card className='rounded-xl' title='Test (2)'>
                <DataTable value={test} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '60rem' }}>
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
