import { axiosInstance } from "../axiosInstance";

export const getUserProfile = async()=>{
    try{
        const response = await axiosInstance.get('/users')
        return response?.data
    }
    catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const updateUserProfile=async(changedData)=>{
    try{
        console.log("working")
        const response = await axiosInstance.put('/users',changedData);
        return response?.data
    }
    catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const changePassword=async(passwordForm)=>{
    try{
    const response = await axiosInstance.patch('/users',passwordForm)
    return response.data
    }catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}