import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AdminLoginPrivate = ({children}) => {
    const {admin} = useSelector((state)=>state.admin)

    if(admin)
    {
        return <Navigate to={"/admin/products"} />
    }
    return children;
}

export default AdminLoginPrivate;
