import React from 'react'
import { useParams } from 'react-router-dom'

const UserDetails = () => {
  let {id} = useParams();
  return (
    <div>UserDetails {id}</div>
  )
}

export default UserDetails