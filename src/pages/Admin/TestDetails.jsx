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
  let { state } = useAuth();
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


  function getTimeTaken(startTimeStr, endTimeStr) {
    const parseTime = (str) => {
      const normalized = str.replace(/(am|pm)/i, (match) => ` ${match.toUpperCase()}`);
      return new Date(normalized);
    };

    const startTime = parseTime(startTimeStr);

    if (!endTimeStr) return "-";

    const endTime = parseTime(endTimeStr);

    // if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    //   return "-";
    // }

    const durationMs = endTime - startTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

    const pad = (num) => String(num).padStart(2, "0");
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    } else {
      return `${pad(minutes)}:${pad(seconds)}`;
    }
  }

  const userBodyTemplate = (user) => {
    return <div>
      <p className='text-base font-medium'>{`${user.userDetails.firstName} ${user.userDetails.lastName}`}</p>
      <p className='text-sm text-(--secondary-text-color) font-normal'>{user.userDetails.email}</p>
    </div>
  };

  console.log(testDetails);
  const statusBodyTemplate = (user) => {
    return <Tag value={user.status} severity={user.status === 'Completed' ? 'danger' : 'success'}></Tag>
  };
  const timeTakenBodyTemplate = (user) => {
    return (user.status === 'Completed') ? <div className='flex items-center gap-1 justify-center'>
      <i className='pi pi-clock'></i>
      <p>{getTimeTaken(user.startTime, user.endTime)}</p>
    </div>
      : '-'
  }

  const isMultiBodyTemplate = (question) => {
    return <Tag value={question.isMultiSelect ? 'True' : 'False'} severity={question.isMultiSelect ? 'success' : "danger"}></Tag>
  }

  const optionsBodyTemplate = (question) => {
    return <p className='bg-green-200'>{question.options[0].title}</p>
  };

  const formattedQuestions = testQuestions.map((q) => {
    const opts = q.options || [];
    return {
      questionText: q.title,
      option1: opts[0],
      option2: opts[1],
      option3: opts[2],
      option4: opts[3],
    };
  });

  return (
    <div>
      <Header name={state.user.name} role={state.user.role} />
      <div className='flex flex-col p-5'>
        <div className='flex justify-between'>
          <h1 className='font-bold text-2xl capitalize'>Title: {testDetails.title}</h1>
          <Tag value={testDetails.isActive ? 'Active' : 'Expired'} severity={testDetails.isActive ? 'success' : 'danger'}></Tag>
        </div>
        <div className='flex items-center gap-1'>
          <p>Duration: </p>
          <i className='pi pi-clock'></i>
          <p>{testDetails.duration}m</p>
        </div>
        <h2>Department: {testDetails.department}</h2>
          <h2>Start Date: {testDetails.startDate}</h2>
          <h2>End Date: {testDetails.endDate}</h2>
      </div>
      <Card className='rounded-xl' title={`Question (${testQuestions.length})`}>
        <DataTable value={testQuestions} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '60rem' }}>
         <Column field="title" header="Question"></Column> 
         <Column field="isMultiSelect" header="Multiple Choice" body={isMultiBodyTemplate}></Column>
       <Column field="option" header="Option 1" body={optionsBodyTemplate} ></Column>
        {/* <Column field="option2" header="Option 2" body={optionsBodyTemplate} ></Column> */}
        {/* <Column field="option3" header="Option 3" body={optionsBodyTemplate}></Column> */}
        {/* <Column field="option4" header="Option 4" body={optionsBodyTemplate}></Column>  */}
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