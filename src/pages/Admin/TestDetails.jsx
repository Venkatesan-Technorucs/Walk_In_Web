import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Axios } from '../../services/Axios';

const TestDetails = () => {
    let {id} = useParams();
    let [testDetails,setTestDetais] = useState({});

    useEffect(()=>{
        let fetchTestDetails = async()=>{
            let response = await Axios.get(`/api/tests/getTestDetails/${id}`);
            setTestDetais(response.data);
        };
        fetchTestDetails();
    },[id]);

    console.log(testDetails);
  return (
    <div>TestDetails {id}</div>
  )
}

export default TestDetails