import React, { useEffect, useRef, useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';
import { useParams } from 'react-router-dom'
import { Axios } from '../../services/Axios';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

const TestDetails = () => {
  let {state} = useAuth();
  let { id } = useParams();
  let [testDetails, setTestDetais] = useState({});
  let [testAttemptedUsers, setTestAttemptedUsers] = useState([])
  let [testQuestions, setTestQuestions] = useState([])

  useEffect(() => {
    let fetchTestDetails = async () => {
      let response = await Axios.get(`/api/tests/getTestDetails/${id}`);
      setTestDetais(response.data.data);
      setTestAttemptedUsers(response.data.data.testAttemptDetails);
      setTestQuestions(response.data.data.questions);
    };
    fetchTestDetails();
  }, [id]);

  const userBodyTemplate = (user) => {
    return <div>
      <p className='text-base font-medium'>{`${user.userDetails.firstName} ${user.userDetails.lastName}`}</p>
      <p className='text-sm text-(--secondary-text-color) font-normal'>{user.userDetails.email}</p>
    </div>
  };

  const statusBodyTemplate = (user) => {
    return <Tag value={user.status} severity={user.status ==='Completed' ? 'danger' : 'success'}></Tag>
  };
  const timeTakenBodyTemplate = (user) => {
    let startTime = user.startTime;
    let endTime = user.endTime;
    const start = new Date(startTime.replace(' ', 'T'));
    const end = new Date(endTime.replace(' ', 'T'));
    const diffMs = end - start;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return <div className='flex items-center gap-1 justify-center'>
      <i className='pi pi-clock'></i>
      <p>{`${diffMinutes}m ${diffSeconds}s`}</p>
    </div>
  };

  const isMultiBodyTemplate = (question)=>{
    return <Tag value={question.isMultiSelect ? 'True' : 'False'} severity={question.isMultiSelect ? 'success': "danger"}></Tag>
  }

  const optionsBodyTemplate = (question) => {
    return <p>{question.options.title}</p>
  };

  return (
    <div>
      <Header name={state.user.name} role={state.user.role} />
      <div className='flex flex-col p-5'>
        <div className='flex justify-between'>
          <h1>{testDetails.title}</h1>
          <Tag value={testDetails.isActive ? 'Active' : 'Expired'} severity={testDetails.isActive ? 'success' : 'danger'}></Tag>
        </div>
        <div className='flex items-center gap-1'>
          <i className='pi pi-clock'></i>
          <p>{testDetails.duration}m</p>
        </div>
        <h2>{testDetails.department}</h2>
        <div className='flex gap-2'>
          <h2>{testDetails.startDate}</h2>
          <h2>{testDetails.endDate}</h2>
        </div>
      </div>
      <Card className='rounded-xl' title={`Question (${testQuestions.length})`}>
        <DataTable value={testQuestions} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '60rem' }}>
          <Column field="title" header="Question"></Column>
          <Column field="isMultiSelect" header="Multiple Choice"  body={isMultiBodyTemplate}></Column>
          <Column field="option1" header="Option 1" body={optionsBodyTemplate} ></Column>
          <Column field="option2" header="Option 2"body={optionsBodyTemplate} ></Column>
          <Column field="option3" header="Option 3" body={optionsBodyTemplate}></Column>
          <Column field="option4" header="Option 4" body={optionsBodyTemplate}></Column>
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
    </div>
  )
}

export default TestDetails