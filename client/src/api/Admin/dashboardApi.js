import { axiosInstance } from "../axiosInstance";

export const getUserStatus=async()=>{
    try{
        const response=await axiosInstance.get('/admin/dashboard')
        return response.data;
    }catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}