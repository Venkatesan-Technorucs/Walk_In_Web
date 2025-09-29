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
import TestQuestionTab from '../../components/TestQuestionTab';
import TestUserTab from '../../components/TestUserTab';
import LeaderBoardTab from '../../components/LeaderBoardTab';

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
          return <TestQuestionTab testQuestions={testQuestions}/>
      case 'testUserTab':
          return <TestUserTab testAttemptedUsers={testAttemptedUsers}/>
      case 'leaderBoardTab':
          return <LeaderBoardTab LeaderBoardData={leaderBoardData}/>
    }
  }
 
  return (
    <>
      {!state?.apiLoading ? (
        <div className="min-h-screen">
          <Header name={state?.user?.name} role={state?.user?.role} />

          <div className='p-5'>
            <div className="my-4">
              <Button
                className="w-8 h-8 p-0 flex items-center justify-center bg-transparent border-none hover:bg-transparent"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <i className="pi pi-arrow-left text-[var(--primary-color)] text-xl" />
              </Button>
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
            <Card className="p-6 bg-white rounded-2xl shadow-md border border-gray-200">
              <>
                <div className="w-full h-12 border-r-green-200 flex items-center p-1 border border-transparent mb-4">
                  <div
                    className={`h-9 w-1/2 flex justify-center items-center rounded-xl transition-colors duration-200 cursor-pointer
              ${active === "TestQuestionTab" ? "bg-green-100 text-green-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                    onClick={() => setActive("TestQuestionTab")}
                    role="button"
                    aria-pressed={active === "TestQuestionTab"}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActive("TestQuestionTab")}
                  >
                    <p>Tests</p>
                  </div>

                  <div
                    className={`h-9 w-1/2 flex justify-center items-center rounded-xl transition-colors duration-200 cursor-pointer
              ${active === "testUserTab" ? "bg-green-100 text-green-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                    onClick={() => setActive("testUserTab")}
                    role="button"
                    aria-pressed={active === "testUserTab"}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActive("testUserTab")}
                  >
                    <p>Users</p>
                  </div>

                  <div
                    className={`h-9 w-1/2 flex justify-center items-center rounded-xl transition-colors duration-200 cursor-pointer
              ${active === "leaderBoardTab" ? "bg-green-100 text-green-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                    onClick={() => setActive("leaderBoardTab")}
                    role="button"
                    aria-pressed={active === "leaderBoardTab"}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActive("leaderBoardTab")}
                  >
                    <p>LeaderBoard</p>
                  </div>
                </div>
                {renderTab()}
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