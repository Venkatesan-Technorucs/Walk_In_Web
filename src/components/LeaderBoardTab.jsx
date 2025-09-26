import React from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const LeaderBoardTab = ({ LeaderBoardData }) => {
  return (
    <Card className="rounded-xl" title={`Leaderboard (${LeaderBoardData?.length || 0})`}>
      <DataTable
        className='mt-4'
        value={LeaderBoardData}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '60rem' }}
        stripedRows
      >
        <Column header="Name" body={(row) => `${row.user.firstName} ${row.user.lastName}`} />
        <Column field="score" header="Score" />
        <Column field="attemptDate" header="Attempt Date" />
        <Column field="completionTime" header="Completion Time" />
      </DataTable>
    </Card>
  );
};

export default LeaderBoardTab;