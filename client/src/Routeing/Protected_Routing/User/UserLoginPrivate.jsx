import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserLoginPrivate = ({children}) => {

    const {user,isFirstLogin} = useSelector((state)=>state.user)

    if(user)
    {
        return <Navigate to={"/"} state={{isFirstLogin}}/>
    }
    return children;
}

export default UserLoginPrivate
