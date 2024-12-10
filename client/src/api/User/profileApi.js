import { axiosInstance } from "../axiosInstance";

export const getUserProfile = async()=>{
    try{
        const response = await axiosInstance.get('/users')
        return response?.data
    }
    catch(error)
    {
        throw error?.response.data || error;
    }
}

export const updateUserProfile=async(changedData)=>{
    console.log(changedData)
    try{
        const response = await axiosInstance.patch('/users',changedData);
        return response?.data
    }
    catch(error)
    {
        throw error?.response.data || error;
    }
}