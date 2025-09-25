import React, { useEffect, useRef, useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';
import { useNavigate, useParams } from 'react-router-dom'
import { Axios } from '../../services/Axios';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { ProgressSpinner } from 'primereact/progressspinner';

const TestDetails = () => {
  let { state, dispatch } = useAuth();
  let { id } = useParams();
  let [testDetails, setTestDetais] = useState({});
  let [testAttemptedUsers, setTestAttemptedUsers] = useState([])
  let [testQuestions, setTestQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let fetchTestDetails = async () => {
      try {
        dispatch({ type: 'API_LOADING', payload: true });
        let response = await Axios.get(`/api/tests/getTestDetails/${id}`);
        setTestDetais(response.data.data);
        setTestAttemptedUsers(response.data.data.testAttemptDetails);
        setTestQuestions(response.data.data.questions);
        dispatch({ type: 'API_LOADING', payload: false });
      } catch (err) {
        console.log(err);
        dispatch({ type: 'API_LOADING', payload: false });
        dispatch({ type: 'ERROR', payload: err.message });
      }
    };
    fetchTestDetails();
  }, []);

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

  const isMultiBodyTemplate = (question) => {
    return <Tag value={question.isMultiSelect ? 'True' : 'False'} severity={question.isMultiSelect ? 'success' : "danger"}></Tag>
  }

  const optionsBodyTemplate = (option) => {
    // let option = option
    // if (option.isCorrect) {
      return <p className={option.isCorrect ? 'text-green-400' : ''}>{option.title}</p>
    // } else {
    //   <p>{option.title}</p>
    // }
  };

  const renderColumn = (row, index) => {
    return <Column field={`option${index + 1}`} header={`Option ${index + 1}`} body={optionsBodyTemplate(row)}></Column>
  }

  return (
    <>
      {!state.apiLoading ? <div>
        <Header name={state.user.name} role={state.user.role} />
        <div className='flex flex-col p-5'>
          <Button className='w-8 h-8 mb-3 p-0 flex justify-start items-start border-none bg-transparent hover:bg-transparent'>
            <i className='pi pi-arrow-left text-(--primary-color) text-xl hover:bg-(--primary-color-hover)' onClick={() => navigate(-1)}></i>
          </Button>
          <div className='flex justify-between'>
            <h1 className='capitalize font-bold text-2xl'>Title: {testDetails.title}</h1>
            <Tag value={testDetails.isActive ? 'Active' : 'Expired'} severity={testDetails.isActive ? 'success' : 'danger'}></Tag>
          </div>
          <div className='flex items-center gap-1'>
            <p className='text-base font-medium'>Duration: </p>
            <i className='pi pi-clock'></i>
            <p>{testDetails.duration}m</p>
          </div>
          <h2 className='font-medium test-base'>Department: {testDetails.department}</h2>
          <h2 className='font-medium text-base'>Start Date: {testDetails.startDate}</h2>
          <h2 className='font-medium text-base'>End Date: {testDetails.endDate}</h2>
        </div>
        <Card className='rounded-xl' title={`Question (${testQuestions.length})`}>
          <DataTable value={testQuestions} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '60rem' }}>
            <Column field="title" header="Question"></Column>
            <Column field="isMultiSelect" header="Multiple Choice" body={isMultiBodyTemplate}></Column>
            {testQuestions?.options && testQuestions?.options.map((option, index) => renderColumn(option, index))}
            {/* <Column header='options' body={(rowData,questions)} ></Column> */}
          </DataTable>
        </Card>
        <Card className='rounded-xl' title={`User (${testAttemptedUsers.length})`}>
          <DataTable value={testAttemptedUsers} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '60rem' }}>
            <Column field="user" header="User" body={userBodyTemplate}></Column>
            <Column field="score" header="Score"></Column>
            <Column field="timeTaken" header="Time Taken" body={timeTakenBodyTemplate}></Column>
            <Column field='status' header="Status" body={statusBodyTemplate}></Column>
          </DataTable>
        </Card>
      </div> : <ProgressSpinner className='absolute top-1/2 left-1/2' />}
    </>
  )
}

export default TestDetails;