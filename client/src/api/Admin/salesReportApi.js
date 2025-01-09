import { axiosInstance } from "../axiosInstance";

export const getSalesReport=async(dateRange,from,to)=>{
    try{
        const response = await axiosInstance.get(`/admin/salesReport?dateRange=${dateRange}&from=${from}&to=${to}`);
        return response?.data
    }
    catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}