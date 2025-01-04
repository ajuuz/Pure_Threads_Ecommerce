import { axiosInstance } from "../axiosInstance";

export const getSalesReport=async()=>{
    try{
        const response = await axiosInstance.get(`/admin/salesReport`);
        return response?.data
    }
    catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}