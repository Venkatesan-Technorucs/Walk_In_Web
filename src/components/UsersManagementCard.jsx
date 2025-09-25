import React, { useEffect, useRef, useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useAuth } from '../contexts/AuthContext';
import { Toast } from 'primereact/toast';
import { Axios } from '../services/Axios';
import CreateAdminDialog from './CreateAdminDialog';
import { useNavigate } from 'react-router-dom';


const UsersManagementCard = ({ }) => {
    let { state } = useAuth();
    let navigate = useNavigate();
    let [users, setUsers] = useState([]);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    let [filterText, setFilterText] = useState('');
    const [role, setRole] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(5);
    const roles = [
        { name: '', code: 'A' },
        { name: 'Admin', code: 'AD' },
        { name: 'Applicant', code: 'AP' },
    ];


    let fetchUsers = async (pageIndex = 0, pageSize = 0, filterText = '', role = '') => {
        setLoading(true);
        try {
            let skip = pageIndex * pageSize;
            let response = await Axios.get(`/api/users/getAllUsers?skip=${skip}&limit=${pageSize}&search=${filterText}&role=${role}`);
            let fetchedUsers = response.data?.data.users || [];
            let total = response.data?.data.totalUsers || 0;

            let filteredUsers = state.user.role === 'SuperAdmin'
                ? fetchedUsers.filter((user) => user.role !== 'SuperAdmin').sort((a, b) => ((b.role === 'Admin') - (a.role === 'Admin')))
                : fetchedUsers.filter((user) => user.role !== 'SuperAdmin' && user.role !== 'Admin');

            setUsers(filteredUsers);
            setTotalRecords(total);
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchUsers(page, rows, filterText, role);
    }, [])

    const onPageChange = (event) => {
        setPage(event.page);
        setRows(event.rows);
        fetchUsers(event.page, event.rows, filterText, role?.name);
    };

    let handleChange = (fieldName, e) => {
        let newRole = role;
        let newFilter = filterText;

        if (fieldName === 'role') {
            newRole = e.value;
            setRole(newRole);
        }
        if (fieldName === 'filterText') {
            newFilter = e.target.value;
            setFilterText(newFilter);
        }
        setPage(0);
        fetchUsers(0, rows, newFilter, newRole?.name || '');
    }
    const userBodyTemplate = (users) => {
        return <div>
            <p className='text-base text-(--secondary-text-color) font-medium'>{users.name}</p>
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

    const emailBodyTemplate = (users) => {
        return <p className='text-(--secondary-text-color) items-center justify-center font-normal'>{users.email}</p>;
    }

    const roleBodyTemplate = (users) => {
        return <div className='flex items-center gap-1'>
            <i className={getIcon(users)}></i>
            <Tag value={users.role} severity={getSeverity(users)}></Tag>
        </div>
    };

    // const statusBodyTemplate = (users) => {
    //     return <Tag value={users.status} className='bg-white border-1 border-(--primary-color) text-(--primary-color)'></Tag>;
    // };
    const actionBodyTemplate = (users) => {
        return (
            <div className='flex items-center gap-2'>
                <Button outlined icon='pi pi-info-circle' onClick={() => {
                    navigate(`/user/details/${users.id}`)
                }} className='text-(--primary-color)' />
                <Button outlined icon='pi pi-trash' className='text-(--primary-color)' />
            </div>
        )
    };

    return (
        <div className='min-h-screen h-full flex flex-col gap-2'>
            <div className='flex justify-between items-center p-2'>
                <div>
                    <h1 className='font-medium text-xl'>User Management</h1>
                    <h2 className='text-(--secondary-text-color)'>Create and manage admin and applicant accounts</h2>
                </div>
                {state.user.role === 'SuperAdmin' && <Button icon='pi pi-user-plus' label='Create Admin' className='w-42 h-9 bg-(--primary-color-light) duration-700 hover:bg-(--primary-color)' onClick={() => { setVisible(true) }} />}
                <Toast ref={toast} position="top-right" className='h-5' pt={{ root: 'w-[60%]', content: 'p-2', icon: 'w-4 h-4 mt-1', text: 'text-sm xs:text-base', closeButton: 'w-4 h-3 mt-1' }} />
                <CreateAdminDialog visible={visible} setVisible={setVisible} show={show} fetchUsers={fetchUsers} />
            </div>
            {state.user.role === 'SuperAdmin' && <Card title='Filters' className='rounded-xl'>
                <div className='w-full flex justify-evenly gap-2'>
                    <>
                        <div className='w-1/2 flex flex-col gap-1'>
                            <label htmlFor="filterText" name='filterText' className=''>Search Users</label>
                            <IconField iconPosition="left">
                                <InputIcon className="pi pi-search"> </InputIcon>
                                <InputText id='filterText' name='filterText' placeholder="Search by name or email..." value={filterText} onChange={(e) => { handleChange('filterText', e) }} className='w-full h-12 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' />
                            </IconField>
                        </div>
                        <div className="w-1/2 flex flex-col gap-1 ">
                            <label htmlFor="role" name='role'>Filter by Role</label>
                            <div className='w-full border-gray-400 border-1 rounded-sm hover:border-black focus-within:border-2 focus-within:hover:border-(--primary-color) focus-within:border-(--primary-color)'>
                                <Dropdown id='role' name='role' value={role} onChange={(e) => handleChange('role', e)} options={roles} optionLabel="name"
                                    placeholder="Select Role" className="w-full h-12 border-none focus-within:border-0 focus-within:shadow-none" />
                            </div>
                        </div>
                    </>
                </div>
            </Card>}
            <Card className='rounded-xl' pt={{}} 
                header={state.user.role === 'Admin' ?
                    <div className='flex justify-between items-center p-4'>
                        <div>
                            <div className='text-2xl font-medium text-(--primary-text-color)'>Users - ({totalRecords})</div>
                            <div className='text-shadow-2xs font-light text-(--secondary-text-color)'>Manage all Users in the system</div>
                        </div>
                        <span className="p-input-icon-left w-1/2">
                            <InputIcon icon="pi pi-search"> </InputIcon>
                            <InputText id="filterText" type="search" value={filterText} onChange={handleChange} className='w-full' placeholder="Search Users" />
                        </span>
                    </div>: ''}>
                <DataTable value={users} lazy paginator rows={rows} first={page*rows} totalRecords={totalRecords} onPage={onPageChange} loading={loading} tableStyle={{ minWidth: '60rem' }} emptyMessage='No users found' pt={{ bodyRow: 'p-0', column: 'text-center p-0'}}>
                    <Column className='w-1/3 p-0' field="user" header="User" body={userBodyTemplate} ></Column>
                    <Column className='w-1/3' field='email' header="Email" body={emailBodyTemplate}></Column>
                    <Column className='w-1/3' field='role' header="Role" body={roleBodyTemplate}></Column>
                    <Column className='w-1/3' field='action' header="Action" body={actionBodyTemplate}></Column>
                </DataTable>
            </Card>
        </div>
    )
}

export default UsersManagementCard