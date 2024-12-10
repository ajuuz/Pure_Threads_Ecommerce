import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserPrivate = ({children}) => {
    
    const {user} = useSelector((state)=>state.user)
    console.log(user)
    if(!user)
    {
        return <Navigate to={"/"} />
    }
    return children;
}

export default UserPrivate
