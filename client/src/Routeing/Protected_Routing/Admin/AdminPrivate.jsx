import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AdminPrivate = ({children}) => {
    const {admin} = useSelector((state)=>state.admin)
    if(admin)
    {
        return children;
    }
    return <Navigate to={"/admin/login"} />
}

export default AdminPrivate
