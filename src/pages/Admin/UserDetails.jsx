
import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';
import { Avatar } from 'primereact/avatar';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import { Axios } from '../../services/Axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setApiLoading(true);
        const response = await Axios.get(`/api/users/getSingleUser/${id}`);
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          setError(response.data.message);
        }
        setApiLoading(false);
      } catch (err) {
        setError(err.message);
        setApiLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const attempts = Array.isArray(user.testAttempts) ? user.testAttempts : [];

  const statusTag = (isActive) => (
    <Tag value={isActive ? 'Active' : 'Inactive'} severity={isActive ? 'success' : 'danger'} />
  );

  const statusBodyTemplate = (attempt) => (
    <Tag value={attempt.status || 'Unknown'} severity={attempt.status === 'Completed' ? 'success' : attempt.status === 'InProgress' ? 'warning' : 'danger'} />
  );

  const timeTakenBodyTemplate = (attempt) => {
    if (!attempt.startTime || !attempt.endTime) return <span>-</span>;
    let start = new Date(attempt.startTime);
    let end = new Date(attempt.endTime);
    let diff = new Date(end - start);
    let diffMinutes = diff.getUTCMinutes();
    let diffSeconds = diff.getUTCSeconds();
    return (
      <div className="flex items-center gap-1">
        <i className="pi pi-clock"></i>
        <span>{`${diffMinutes}m ${diffSeconds}s`}</span>
      </div>
    );
  };

  return (
    <>
      {!apiLoading ? (
        <div className="flex flex-col min-h-screen h-screen w-full">
          <div className="flex-1 flex flex-col p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              <i
                className="pi pi-arrow-left cursor-pointer text-primary text-xl hover:bg-primary/10 rounded-full p-2 transition"
                onClick={() => navigate(-1)}
              ></i>
              <h1 className="text-xl font-medium text-gray-900 tracking-tight">User Details</h1>
            </div>
            <div className="flex flex-1 flex-col md:flex-row justify-center gap-6 h-full w-full">
              <div className="w-full md:w-1/3 h-full flex flex-col gap-4">
                <div className="bg-white rounded-2xl p-8 flex flex-col justify-center items-center w-full h-full min-h-0">
                  <div className="relative mb-6">
                    <Avatar
                      label={user?.name?.split(' ')?.map(n => n[0])?.join('')?.toUpperCase()}
                      size="xlarge"
                      shape="circle"
                      className="shadow-md"
                      style={{ 
                        background: 'linear-gradient(135deg, #E9ECFF 0%, #E5E1FF 100%)',
                        color: '#6366F1',
                        fontSize: '2rem',
                        width: '100px',
                        height: '100px'
                      }}
                    />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{user.name || '—'}</div>
                  <div className="text-sm font-medium text-gray-500 mb-6">{'Applicant'}</div>

                  <div className="flex flex-col w-full gap-3 mt-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="pi pi-envelope mr-3 text-gray-400" />
                      <span className="font-medium">{user.email || '—'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="pi pi-map-marker mr-3 text-gray-400" />
                      <span className="font-medium">{user.city || '—'}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <i className="pi pi-calendar mr-3 text-gray-400" />
                      <span>Joined: {user.createdDate || '—'}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <i className="pi pi-user mr-3 text-gray-400" />
                      <span>Referred By: {user.referredBy || '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-1/4 bg-white rounded-xl p-4 shadow-md min-h-0">
                  <div className="font-semibold text-gray-700 mb-2">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(user.skills) && user.skills.length > 0 ? (
                      user.skills.map((skill) => (
                        <Tag
                          key={skill.id}
                          value={skill.skillName}
                          rounded
                          className="bg-gray-100 text-gray-700 font-medium px-3 py-1"
                        />
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No skills listed</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="h-full w-full md:w-2/3 bg-white rounded-xl flex flex-col min-h-0">
                <span className="text-xl font-medium text-gray-800 p-6">
                  Test Attempts <span className="text-base text-gray-500">({attempts.length})</span>
                </span>
                <Divider className='mt-2'/>
                <div className='flex-1 overflow-auto px-6 min-h-0'>
                  {attempts.length > 0 ? <DataTable
                  value={attempts}
                  title='Test Attempts'
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  tableStyle={{ minWidth: '40rem' }}
                  pt={{
                    root: 'rounded-lg border border-gray-200 overflow-hidden',
                    headerRow: 'border-none',
                    headerCell: 'py-3 px-4 text-gray-700 font-semibold',
                    bodyRow: ({ context }) => context.selected ? 'bg-primary/5' : 'hover:bg-gray-50 transition-colors',
                    bodyCell: 'py-3 px-4',
                    paginator: 'border-t border-gray-200 py-3'
                  }}
                  className="mt-6 flex-1 min-h-0"
                >
                  <Column
                    field="testName"
                    header={<span className="text-sm">Test Name</span>}
                    body={(row) => (
                      <div className="font-medium text-gray-900">{row.name || '—'}</div>
                    )}
                  ></Column>
                  <Column
                    field="score"
                    header={<span className="text-sm">Score</span>}
                    body={(row) => (
                      <div className="font-medium text-gray-900">
                        {row.score != null ? `${row.score}%` : '—'}
                      </div>
                    )}
                  ></Column>
                  <Column
                    field="timeTaken"
                    header={<span className="text-sm">Time Taken</span>}
                    body={timeTakenBodyTemplate}
                    bodyClassName="text-gray-600"
                  ></Column>
                  <Column
                    field="status"
                    header={<span className="text-sm">Status</span>}
                    body={statusBodyTemplate}
                  ></Column>
                </DataTable> : 
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <i className="pi pi-file text-4xl text-gray-300 mb-4"></i>
                  <span className="text-sm text-gray-400">No test attempts yet</span>
                </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <ProgressSpinner />
        </div>
      )}
    </>
  );
};

export default UserDetails;