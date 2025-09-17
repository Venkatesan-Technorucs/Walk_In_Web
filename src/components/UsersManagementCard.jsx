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

const UsersManagementCard = () => {
    const [selectedRoles, setSelectedRoles] = useState(null);
    const roles = [
        { name: 'Super Admin', code: 'SA' },
        { name: 'Admin', code: 'AD' },
        { name: 'Applicant', code: 'AP' },
    ];

    const users = [
        {
            id: 0,
            name: "Super Admin",
            email: "admin@test.com",
            role: 'Super Admin',
            created: '9/11/2025',
            status: 'Active',
        },
        {
            id: 1,
            name: "Test Manager",
            email: "manager@test.com",
            role: 'Admin',
            created: '9/11/2025',
            status: 'Active',
        },
        {
            id: 2,
            name: "Test User",
            email: "user@test.com",
            role: 'Applicant',
            created: '9/11/2025',
            status: 'Active',
        },
    ]

    const userBodyTemplate = (users) => {
        return <div>
            <p className='text-base font-medium'>{users.name}</p>
            <p className='text-sm text-(--secondary-text-color) font-normal'>{users.email}</p>
        </div>
    };

    const getSeverity = (users) => {
        switch (users.role) {
            case 'Super Admin':
                return 'danger';

            case 'Admin':
                return 'success';
            case 'Applicant':
                return 'info';
            default:
                return null;
        }
    };
    
    const getIcon = (users) => {
        switch (users.role) {
            case 'Super Admin':
                return 'pi pi-shield text-red-500';

            case 'Admin':
                return 'pi pi-shield text-green-500';
            case 'Applicant':
                return 'pi pi-users text-blue-500';
            default:
                return null;
        }
    };

    const roleBodyTemplate = (users) => {
        return <div className='flex items-center gap-1 justify-center'>
            <i className={getIcon(users)}></i>
            <Tag value={users.role} severity={getSeverity(users)}></Tag>
        </div>
    };

    const statusBodyTemplate = (users) => {
        return <Tag value={users.status} className='bg-white border-1 border-(--primary-color) text-(--primary-color)'></Tag>;
    };



    return (
        <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center p-2'>
                <div>
                    <h1 className='font-medium text-xl'>User Management</h1>
                    <h2 className='text-(--secondary-text-color)'>Create and manage admin and applicant accounts</h2>
                </div>
                <Button icon='pi pi-user-plus' label='Create User' className='w-42 h-9 bg-linear-135 from-(--primary-color-light) from-0% to-(--primary-color) to-100%' />
            </div>
            <Card title='Filters' className='rounded-xl'>
                <div className='w-full flex justify-evenly gap-2'>
                    <div className='w-full'>
                        <label htmlFor="">Search Users</label>
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-search"> </InputIcon>
                            <InputText placeholder="Search by name or email..." />
                        </IconField>
                    </div>
                    <div className="w-full">
                        <div className='flex flex-col'>
                            <label htmlFor="">Filter by Role</label>
                            <MultiSelect value={selectedRoles} onChange={(e) => setSelectedRoles(e.value)} options={roles} optionLabel="name"
                                placeholder="Select Roles" maxSelectedLabels={3} className="w-full md:w-20rem" />
                        </div>
                    </div>
                </div>
            </Card>
            <Card className='rounded-xl' title='Users (3)' subTitle='Manage all users in the system'>
                <DataTable value={users} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '60rem' }}>
                    <Column field="user" header="User" body={userBodyTemplate} ></Column>
                    <Column field='role' header="Role" body={roleBodyTemplate}></Column>
                    <Column field="created" header="Created"></Column>
                    <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                </DataTable>
            </Card>
        </div>
    )
}

export default UsersManagementCard