import { axiosInstance } from "../axiosInstance"


export const getRefferalCode=async()=>{
    try{
        const response=await axiosInstance.get('/users/refferal')
        return response.data
    }
    catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const applyRefferal=async(refferalCode,currentUserRefferalCode)=>{
    try{
        console.log(refferalCode,currentUserRefferalCode)
        const response=await axiosInstance.post('/users/refferal',{refferalCode,currentUserRefferalCode})
        return response.data
    }
    catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}