import React, { useEffect, useRef, useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { useAuth } from '../contexts/AuthContext';
import { Toast } from 'primereact/toast';
import { Axios } from '../services/Axios';
import CreateAdminDialog from './CreateAdminDialog';


const UsersManagementCard = ({ }) => {
    let { state } = useAuth();
    let [users,setUsers] = useState([]);
    const toast = useRef(null); 
    const [visible, setVisible] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState(null);
    const roles = [
        { name: 'Admin', code: 'AD' },
        { name: 'Applicant', code: 'AP' },
    ];

    useEffect(()=>{
        let fetchUsers = async()=>{
            let response = await Axios.get('/api/users/getAllUsers');
            console.log(response.data);
            if(state.user.role ==='SuperAdmin'){
                setUsers(response.data?.filter((user)=> user.role !=='SuperAdmin'))
            }else{
                setUsers(response.data?.filter((user)=> user.role !== 'SuperAdmin' && user.role !== 'Admin'));
            }
        }
        fetchUsers();
    },[])

    console.log(users);
    const userBodyTemplate = (users) => {
        return <div>
            <p className='text-base font-medium'>{users.user_name}</p>
            <p className='text-sm text-(--secondary-text-color) font-normal'>{users.email}</p>
        </div>
    };

    const getSeverity = (users) => {
        switch (users.role) {
            case 'Admin':
                return 'success';
            case 'Applicant':
                return 'info';
            default:
                return null;
        }
    };

    const show = (severity, summary, msg) => {
        toast.current.show({ severity: severity, summary: summary, detail: msg });
    };

    const getIcon = (users) => {
        switch (users.role) {
            case 'SuperAdmin':
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

    // const statusBodyTemplate = (users) => {
    //     return <Tag value={users.status} className='bg-white border-1 border-(--primary-color) text-(--primary-color)'></Tag>;
    // };
    const actionBodyTemplate =
            (
                <div className='flex justify-center items-center gap-2'>
                    <Button outlined icon='pi pi-info-circle' className='text-(--primary-color)' />
                    <Button outlined icon='pi pi-trash' className='text-(--primary-color)' />
                </div>
            );



    return (
        <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center p-2'>
                <div>
                    <h1 className='font-medium text-xl'>User Management</h1>
                    <h2 className='text-(--secondary-text-color)'>Create and manage admin and applicant accounts</h2>
                </div>
                {state.user.role === 'SuperAdmin' && <Button icon='pi pi-user-plus' label='Create Admin' className='w-42 h-9 bg-linear-135 from-(--primary-color-light) from-0% to-(--primary-color) to-100%' onClick={() => { setVisible(true) }} />}
                <Toast ref={toast} position="top-right" className='h-5' pt={{ root: 'w-[60%]', content: 'p-2', icon: 'w-4 h-4 mt-1', text: 'text-sm xs:text-base', closeButton: 'w-4 h-3 mt-1' }} />
                <CreateAdminDialog visible={visible} setVisible={setVisible} show={show} />
            </div>
            <Card title='Filters' className='rounded-xl'>
                <div className='w-full flex justify-evenly gap-2'>
                    <div className='w-1/2 flex flex-col gap-1'>
                        <label htmlFor="" className=''>Search Users</label>
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-search"> </InputIcon>
                            <InputText placeholder="Search by name or email..." className='w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' />
                        </IconField>
                    </div>
                    {state.user.role==='SuperAdmin' && <div className="w-1/2 flex flex-col gap-1 ">
                        <label htmlFor="">Filter by Role</label>
                        <div className='w-full border-gray-400  border-1 rounded-sm hover:border-black focus-within:border-2 focus-within:hover:border-(--primary-color) focus-within:border-(--primary-color)'>
                            <MultiSelect value={selectedRoles} onChange={(e) => setSelectedRoles(e.value)} options={roles} optionLabel="name"
                                placeholder="Select Roles" maxSelectedLabels={3} className="w-full border-none focus-within:border-0 focus-within:shadow-none" />
                        </div>
                    </div>}
                </div>
            </Card>
            <Card className='rounded-xl' title={`Users (${users.length})`} subTitle='Manage all users in the system'>
                <DataTable value={users} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '60rem' }}>
                    <Column field="user" header="User" body={userBodyTemplate} ></Column>
                    <Column field='role' header="Role" body={roleBodyTemplate}></Column>
                    <Column field="action" header="Action" body={actionBodyTemplate}></Column>
                    {/* <Column field="created" header="Created"></Column> */}
                </DataTable>
            </Card>
        </div>
    )
}

export default UsersManagementCard