
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
        <div className="min-h-screen bg-gray-50">
          <Header name={user.name} role={user.role} />
          <div className="w-full h-full mt-8 px-6">
            <div className="h-full flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Button className='w-8 h-8 mb-3 p-0 flex justify-start items-start border-none bg-transparent hover:bg-transparent'>
                  <i className='pi pi-arrow-left text-(--primary-color) text-xl hover:bg-(--primary-color-hover)' onClick={() => navigate(-1)}></i>
                </Button>
                <h1 className="text-2xl font-medium text-gray-900 tracking-tight">User Details</h1>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col items-center">
                  <Avatar label={user?.name?.split(' ')?.map(n => n[0])?.join('')?.toUpperCase()} size="xlarge" shape="circle" className="mb-4 shadow" />
                  <div className="text-2xl font-medium text-gray-800 mb-1">{user.name}</div>
                  <div className="text-base text-gray-500 mb-2">{user.role}</div>
                  <div className="text-sm text-gray-700 mb-2"><i className="pi pi-envelope mr-1 text-gray-400" />{user.email}</div>
                  <div className="text-sm text-gray-500 mb-2"><i className="pi pi-map-marker mr-1 text-gray-400" />{user.city || '—'}</div>
                  <div className="flex items-center gap-2 mt-2">
                    {statusTag(user.isActive)}
                    <span className="text-xs text-gray-400">Joined: {user.createdDate}</span>
                  </div>
                  <div className="mt-6 w-full">
                    <div className="font-semibold text-gray-700 mb-2">Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(user.skills) && user.skills.length > 0 ? (
                        user.skills.map((skill) => (
                          <Tag key={skill.id} value={skill.skillName} rounded className="bg-gray-100 text-gray-700 font-medium px-3 py-1" />
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">No skills listed</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-[2] flex flex-col gap-6">
                  <Card className="rounded-2xl shadow border-0 bg-white" title={<span className="text-xl font-bold text-gray-800">Profile Information</span>}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base text-gray-700 mt-2">
                      <div>
                        <div className="text-gray-500">Email</div>
                        <div className="font-medium">{user.email}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Role</div>
                        <div className="font-medium">{user.role}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">City</div>
                        <div className="font-medium">{user.city || '—'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Referred By</div>
                        <div className="font-medium">{user.referredBy || '—'}</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="rounded-2xl shadow border-0 bg-white mt-2" title={<span className="text-xl font-bold text-gray-800">Test Attempts <span className='text-base text-gray-500'>({attempts.length})</span></span>}>
                    <DataTable value={attempts} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '40rem' }} emptyMessage={<span className="p-6 text-center text-sm text-gray-400">No test attempts yet.</span>} className="mt-2">
                      <Column field="testName" header={<span className="font-semibold text-gray-700">Test</span>} body={(row) => row.name || '—'}></Column>
                      <Column field="score" header={<span className="font-semibold text-gray-700">Score</span>} body={(row) => (row.score != null ? row.score : '—')}></Column>
                      <Column field="timeTaken" header={<span className="font-semibold text-gray-700">Time Taken</span>} body={timeTakenBodyTemplate}></Column>
                      <Column field="status" header={<span className="font-semibold text-gray-700">Status</span>} body={statusBodyTemplate}></Column>
                    </DataTable>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ProgressSpinner className="absolute top-1/2 left-1/2" />
      )}
    </>
  );
};

export default UserDetails;