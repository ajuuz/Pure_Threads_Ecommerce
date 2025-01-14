import { axiosInstance } from "../axiosInstance";

export const getAllOrders = async(sortCriteria,currentPage,limit,tab)=>{
    try{
        const response = await axiosInstance.get(`/admin/orders?target=admin&sortCriteria=${sortCriteria}&currentPage=${currentPage}&limit=${limit}&tab=${tab}`);
        return response?.data
    }
    catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const updateOrderStatus=async(orderId,userId,status,isPaymentDone,totalAmount)=>{
    try{
        const response = await axiosInstance.patch(`/admin/orders/${orderId}`,{userId,status,isPaymentDone,totalAmount})
        console.log(response)
        return response.data
    }catch(error){
        console.log(error)
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const confirmReturnOrder=async(orderId,userId,totalAmount,returnConfirmation,decision)=>{
    try{
        const response = await axiosInstance.patch(`/admin/orders/${orderId}`,{userId,totalAmount,returnConfirmation,decision})
        console.log(response)
        return response.data
    }catch(error){
        console.log(error)
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}