import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Axios } from "../../services/Axios";
import { Button } from "primereact/button";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";

const UserTestDetails = () => {
  const { state } = useAuth();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId, testId } = useParams();

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        setLoading(true);
        if (!userId || !testId) {
          navigate(-1);
          return;
        }
        const response = await Axios.get(`/api/tests/getUserAnswers/${userId}/${testId}`);
        setAnswers(response.data.data);
      } catch (err) {
        setAnswers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnswers();
  }, [userId, testId]);

  const optionBodyTemplate = (rowData) => {
    return (
      <div className="flex flex-col gap-2">
        {rowData.question.options.map((option) => {
          const isSelected = rowData.selectedOptions.includes(option.id.toString());
          return (
            <div key={option.id} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${option.isCorrect && isSelected ? 'border-green-400 bg-green-50' : isSelected ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'} shadow-sm`}>
              <span className="flex items-center gap-2 font-medium text-gray-700">
                {/* {option.isCorrect && <i className="pi pi-check-circle text-green-500" title="Correct Option"></i>}
                {isSelected && <i className="pi pi-user-check text-blue-500" title="Selected Option"></i>} */}
                {option.title}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full">
      {/* <Header name={state.user.name} role={state.user.role} /> */}
      <div className="flex items-center justify-center my-6">
        <Card className="rounded-2xl shadow-xl w-11/12 border border-gray-200"
          title={<div className="flex items-center gap-3"><span className="text-3xl font-medium">User Test Details</span></div>}>
          <div className="my-4 flex justify-between items-center">
            <Button
              className="w-8 h-8 p-0 flex items-center justify-center bg-transparent border-none hover:bg-transparent"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <i className="pi pi-arrow-left text-[var(--primary-color)] text-xl" />
            </Button>
            <div className="flex gap-6 mt-4 mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-green-200 border-black w-5 h-5 shadow-sm"></div>
                -
                <p>correct answer</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-red-200 border-black w-5 h-5 shadow-sm"></div>
                -
                <p>incorrect answer</p>
              </div>
            </div>
          </div>
          <DataTable
            value={answers}
            loading={loading}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: '60rem' }}
            className="rounded-xl overflow-hidden"
            pt={{
              header: 'bg-green-100 text-green-800 text-lg font-semibold',
              column: 'px-4 py-3 text-base',
            }}
            emptyMessage={<span className="text-gray-500">No answers found for this user.</span>}
          >
            <Column field="question.title" header="Question" body={(row) => <span className="font-medium text-gray-800 flex items-center gap-2">{row.question.title}</span>} />
            <Column field="question.isMultiSelect" header="Multiple Choice" body={(row) => <Tag value={row.question.isMultiSelect ? 'True' : 'False'} severity={row.question.isMultiSelect ? 'success' : 'danger'} className="text-xs px-2 py-1" />} />
            <Column header="Options" body={optionBodyTemplate} />
            <Column field="answeredAt" header="Answered At" body={(row) => <span className="text-gray-600 text-sm flex items-center gap-2">{row.answeredAt}</span>} />
          </DataTable>
        </Card>
      </div>
    </div>
  );
};

export default UserTestDetails;