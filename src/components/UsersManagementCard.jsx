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
import { Axios } from '../services/Axios';
import CreateAdminDialog from './CreateAdminDialog';
import { useNavigate } from 'react-router-dom';
import ClearFilter from './common/ClearFilter';
import { OverlayPanel } from 'primereact/overlaypanel';
import { pt } from '../utils/pt';


const UsersManagementCard = ({ }) => {
    let { state } = useAuth();
    let overlayRef = useRef(null);
    let [selectedUser, setSelectedUser] = useState(null);
    let navigate = useNavigate();
    let [users, setUsers] = useState([]);
    const [visible, setVisible] = useState(false);
    let [filterText, setFilterText] = useState('');
    const [role, setRole] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(5);
    const roles = [
        { name: 'Admin', code: 'AD' },
        { name: 'Applicant', code: 'AP' },
    ];


    let fetchUsers = async (pageIndex = 0, pageSize = 0, filterText = '', role = '') => {
        setLoading(true);
        try {
            let skip = pageIndex * pageSize;
            let response = await Axios.get(`/api/users/getAllUsers?skip=${skip}&limit=${pageSize}&search=${filterText}&role=${role}`);
            let fetchedUsers = response.data?.data.users || [];
            let total = response.data?.data?.totalUsers || 0;

            // let filteredUsers = state.user.role === 'SuperAdmin'
            //     ? fetchedUsers.filter((user) => user.role !== 'SuperAdmin')
            //     : fetchedUsers.filter((user) => user.role !== 'SuperAdmin' && user.role !== 'Admin');
            // console.log(filteredUsers.length)
            setUsers(fetchedUsers);
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

    // const onPageChange = (event) => {
    //     setPage(event.page);
    //     setRows(event.rows);
    //     fetchUsers(event.page, event.rows, filterText, role?.name);
    // };

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
            <p className='px-1 text-base text-(--secondary-text-color) font-medium'>{users.name}</p>
        </div>
    };

    const handleClearFilter = () => {
        setFilterText('');
        setRole('');
        fetchUsers(0, rows, '', '');
    }

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

    const getIcon = (users) => {
        switch (users.role) {
            // case 'SuperAdmin':
            //     return 'pi pi-shield text-red-500';
            case 'Admin':
                return 'pi pi-shield text-[#689f38]';
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
            <div className='flex items-center gap-2 '>
                <Button icon='pi pi-ellipsis-v' className='bg-white text-(--primary-color) hover:bg-gray-50 rounded-[50%]' onClick={(e) => { setSelectedUser(users); overlayRef.current.toggle(e) }} />
            </div>
        )
    };

    return (
        <div className='min-h-full flex flex-col gap-2'>
            {state.user.role === 'SuperAdmin' && <div className='flex justify-between items-center p-2'>
                <div className='w-full flex gap-2'>
                    <>
                        <IconField className='w-1/3' iconPosition="left">
                            <InputIcon className="pi pi-search"> </InputIcon>
                            <InputText id='filterText' name='filterText' placeholder="Search by name or email..." value={filterText} onChange={(e) => { handleChange('filterText', e) }} className='w-full h-12 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' />
                        </IconField>
                        <div className='w-1/6 border-gray-400 border-1 rounded-sm hover:border-black focus-within:border-2 focus-within:hover:border-(--primary-color) focus-within:border-(--primary-color)'>
                            <Dropdown id='role' name='role' value={role} onChange={(e) => handleChange('role', e)} options={roles} optionLabel="name"
                                placeholder="Select Role" className="w-full h-11.5 border-none focus-within:border-0 focus-within:shadow-none" pt={{ input: "p-[10px]" }} />
                        </div>
                        <ClearFilter onClear={handleClearFilter} />
                    </>
                </div>
                {state.user.role === 'SuperAdmin' && <Button icon='pi pi-user-plus' label='Create Admin' className='max-w-1/6 w-48 h-11.5 bg-(--primary-color-light) duration-700 hover:bg-(--primary-color)' onClick={() => { setVisible(true) }} />}
                <CreateAdminDialog visible={visible} setVisible={setVisible} fetchUsers={fetchUsers} />
            </div>}
            <div>
                {state.user.role === 'Admin' &&
                    <div className='flex justify-start items-center gap-3 mb-4 mr-4'>
                        {/* <label htmlFor="filterText" className="font-medium ml-1">Search:</label> */}
                        <IconField iconPosition='left' className="w-1/3">
                            <InputIcon className="pi pi-search"> </InputIcon>
                            <InputText id='filterText' name='filterText' placeholder="Search by name or email..." value={filterText} onChange={(e) => { handleChange('filterText', e) }} className='w-full bg-gray-100 h-12 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none' />
                        </IconField>
                        <ClearFilter onClear={handleClearFilter} />
                    </div>}
                <DataTable className='mt-4 border-1 border-gray-200' value={users} paginator rows={rows} first={page} totalRecords={totalRecords} loading={loading} tableStyle={{ minWidth: '60rem' }} emptyMessage='No users found' pt={{ bodyRow: '', columns: 'px-2', paginator:pt.paginator }}>
                    <Column className='w-1/3' field="user" header="User" body={userBodyTemplate} ></Column>
                    <Column className='w-1/3' field='email' header="Email" body={emailBodyTemplate}></Column>
                    <Column className='w-1/3' field='role' header="Role" body={roleBodyTemplate}></Column>
                    <Column className='w-1/3' field='actions' header="Actions" body={actionBodyTemplate}></Column>
                </DataTable>
                <OverlayPanel ref={overlayRef}>
                    {selectedUser &&
                        <div className='flex flex-col gap-2'>
                            <Button disabled={selectedUser?.role === "Admin"} icon='pi pi-info-circle' label='View' onClick={() => {
                                navigate(`/user/details/${selectedUser?.id}`)
                            }} className='text-gray-600 hover:text-white h-6 bg-green-100 hover:bg-(--primary-color-light) border-none p-4' />
                            <Button disabled icon='pi pi-trash' label='Delete' className='text-gray-600 hover:text-white h-6 bg-green-100 hover:bg-(--primary-color-light) border-none p-4' />
                        </div>
                    }
                </OverlayPanel>
            </div>
        </div>
    )
}

export default UsersManagementCard