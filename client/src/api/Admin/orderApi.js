import { axiosInstance } from "../axiosInstance";

export const getAllOrders = async()=>{
    try{
        const response = await axiosInstance.get('/admin/orders');
        return response?.data
    }
    catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const updateOrderStatus=async(orderId,status)=>{
    try{

        const response = await axiosInstance.patch(`/admin/orders/${orderId}`,{status})
        return response.data
    }catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}