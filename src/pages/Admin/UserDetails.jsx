import React from 'react'
import { useParams } from 'react-router-dom'
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';

const UserDetails = () => {
  let {id} = useParams();
  return (
    <div>UserDetails {id}</div>
  )
}

export default UserDetails