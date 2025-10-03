import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Tag } from 'primereact/tag'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const TestUserTab = ({ testAttemptedUsers }) => {
    const [selectedUser, setSelectedUser] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    const userBodyTemplate = (user) => {
        return <div>
            <p className='text-base font-medium'>{`${user.userDetails.firstName} ${user.userDetails.lastName}`}</p>
            <p className='text-sm text-(--secondary-text-color) font-normal'>{user.userDetails.email}</p>
        </div>
    };

    const statusBodyTemplate = (user) => {
        return <Tag value={user.status} severity={user.status === 'Completed' ? 'danger' : 'success'}></Tag>
    };
    const timeTakenBodyTemplate = (user) => {
        let startTime = user?.startTime?.split(' ')[1];
        let endTime = user?.endTime?.split(' ')[1];
        if (!startTime || !endTime) return <p>-</p>
        let start = new Date(`1970-01-01T${startTime}Z`);
        let end = new Date(`1970-01-01T${endTime}Z`);
        let diff = new Date(end - start);
        let diffMinutes = diff.getUTCMinutes();
        let diffSeconds = diff.getUTCSeconds();
        return <div className='flex items-center gap-1'>
            <i className='pi pi-clock'></i>
            <p>{`${diffMinutes}m ${diffSeconds}s`}</p>
        </div>
    };

    return (
        <div className=''>
            <h1 className='pl-3 font-bold text-xl'>Users ({testAttemptedUsers.length})</h1>
            <DataTable value={testAttemptedUsers} selectionMode="single" paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '60rem' }}
                selection={selectedUser} onSelectionChange={e => {
                    setSelectedUser(e.value);
                    const userId = e.value?.userDetails?.id;
                    const testId = id;
                    if (userId && testId){
                        navigate(`/user/test/details/${userId}/${testId}`);
                    }
                }}>
                <Column field="user" header="User" body={userBodyTemplate}></Column>
                <Column field="score" header="Score"></Column>
                <Column field="timeTaken" header="Time Taken" body={timeTakenBodyTemplate}></Column>
                <Column field='status' header="Status" body={statusBodyTemplate}></Column>
            </DataTable>
        </div>
    )
}

export default TestUserTab