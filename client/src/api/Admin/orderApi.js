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

export const updateOrderStatus=async(orderId,userId,status,isPaymentDone)=>{
    try{
        console.log(orderId,status)
        const response = await axiosInstance.patch(`/admin/orders/${orderId}`,{userId,status,isPaymentDone})
        console.log(response)
        return response.data
    }catch(error){
        console.log(error)
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}