import React, { useEffect, useRef, useState } from 'react'
import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag';
import { useNavigate, useParams } from 'react-router-dom'
import { Axios } from '../../services/Axios';
// import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { ProgressSpinner } from 'primereact/progressspinner';
import TestQuestionTab from '../../components/TestQuestionTab';
import TestUserTab from '../../components/TestUserTab';
// import LeaderBoardTab from '../../components/LeaderBoardTab';
// import { Divider } from 'primereact/divider';

const TestDetails = () => {
  let { state, dispatch } = useAuth();
  let { id } = useParams();
  let [testDetails, setTestDetais] = useState({});
  let [testAttemptedUsers, setTestAttemptedUsers] = useState([])
  let [testQuestions, setTestQuestions] = useState([]);
  let [leaderBoardData, setLeaderBoardData] = useState([]);
  const [active, setActive] = useState('TestQuestionTab')
  const navigate = useNavigate();

  useEffect(() => {
    let fetchTestDetails = async () => {
      try {
        dispatch({ type: 'API_LOADING', payload: true });
        let response = await Axios.get(`/api/tests/getTestDetails/${id}`);
        setTestDetais(response.data.data);
        setTestAttemptedUsers(response.data.data.testAttemptDetails);
        setTestQuestions(response.data.data.questions);
        setLeaderBoardData(response.data.data.leaderboard);
        dispatch({ type: 'API_LOADING', payload: false });
      } catch (err) {
        console.log(err);
        dispatch({ type: 'API_LOADING', payload: false });
        dispatch({ type: 'ERROR', payload: err.message });
      }
    };
    fetchTestDetails();
  }, []);

  const renderTab = () => {
    switch (active) {
      case 'TestQuestionTab':
        return <TestQuestionTab testQuestions={testQuestions} />
      case 'testUserTab':
        return <TestUserTab testAttemptedUsers={testAttemptedUsers} />
      // case 'leaderBoardTab':
      //     return <LeaderBoardTab LeaderBoardData={leaderBoardData}/>
    }
  }

  const handleChange = (card) => {
    setActive(card);
  }

  return (
    <>
      {!state?.apiLoading ? (
        <div className="min-h-screen">
          {/* <Header name={state?.user?.name} role={state?.user?.role} /> */}

          <div className='px-4'>
            <div className="">
              <div
                className="w-8 h-8 p-0 mb-2 flex items-center justify-center bg-transparent border-none cursor-pointer hover:bg-transparent"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <i className="pi pi-arrow-left text-[var(--primary-color)] text-xl" />
              </div>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 space-y-3 mb-4 ">
              <div className="flex justify-between items-center">
                <h1 className="capitalize font-bold text-2xl text-gray-800">
                  Title: {testDetails.title}
                </h1>
                <Tag
                  value={testDetails.isActive ? "Active" : "Expired"}
                  severity={testDetails.isActive ? "success" : "danger"}
                />
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <p className="text-base font-medium">Duration:</p>
                <i className="pi pi-clock text-gray-500" />
                <p className="text-base">{testDetails.duration}m</p>
              </div>
              <h2 className="font-medium text-base text-gray-700">
                Department: {testDetails.department}
              </h2>
              <div className="flex gap-4 text-gray-700">
                <h2 className="">
                  <p className='font-bold text-base'>Start Date:</p> {testDetails.startDate}
                </h2>
                <h2 className="">
                  <p className='font-bold text-base'>End Date:</p> {testDetails.endDate}
                </h2>
              </div>
            </div>
            <Card className="bg-white rounded-2xl shadow-md border border-gray-200" pt={{root:"p-4",body:"p-0",content:"p-0"}}>
              <>
                <div className='w-full flex border-b-1 border-gray-200 gap-10 mb-2'>
                  <div className={`h-8 w-1/12 py-6 flex justify-center items-center ${active === 'TestQuestionTab' ? 'border-b-4 border-green-100' : ''}  hover:cursor-pointer`} onClick={() => { setActive("TestQuestionTab") }}>
                    <p className={`${active === 'TestQuestionTab' ? 'text-green-600' : 'text-gray-600'}`}>Questions</p>
                  </div>
                  <div className={`h-8 w-1/12 py-6 flex justify-center items-center ${active === 'testUserTab' ? 'border-b-4 border-green-100' : ''} hover:cursor-pointer`} onClick={() => { setActive("testUserTab") }}>
                    <p className={`${active === 'testUserTab' ? 'text-green-600' : 'text-gray-600'}`}>Users</p>
                  </div>
                </div>

                <div className='min-h-full'>
                  {renderTab()}
                </div>

                {/* {renderTab()} */}
              </>
            </Card>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
          <ProgressSpinner />
        </div>
      )}
    </>
  );

}

export default TestDetails;