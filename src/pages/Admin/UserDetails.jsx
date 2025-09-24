import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';
import { Axios } from '../../services/Axios';

const UserDetails = () => {
  let { id } = useParams();
  let [msg, setMsg] = useState('');
  let [user, setUser] = useState({});
  useEffect(() => {
    let fetchUser = async () => {
      let response = await Axios.get(`/get/users/getSingleUser/${id}`);
      if (response.data.success) {
        setUser(response.data?.data);
      }
      else {
        setMsg(response.data?.message);
      }
    }
    fetchUser();
  }, [id]);

  return (
    <div>UserDetails {id}
    <h1></h1>
    </div>
  )
}

export default UserDetails