import { axiosInstance } from "../axiosInstance";


export const adminLogin =async(userData)=>{
    try{
        const response = await axiosInstance.post('admin/login',userData, { withCredentials: true })
        console.log(response.data)
        return response.data;
    }
    catch(error)
    {
        console.log("admin login error",error?.response.data)
        throw error.response?.data
    }
}


export const logout = async()=>{
    try{
        const response  = await axiosInstance.post('/admin/logout')
        return response.data;
    }
    catch(error)
    {
        throw error?.response.data || error
    }
}