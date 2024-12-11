import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserPrivate = ({children}) => {

    const {user} = useSelector((state)=>state.user)
    if(!user)
    {
        return <Navigate to={"/"} />
    }
    return children;
}

export default UserPrivate
