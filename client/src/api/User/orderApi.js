import { axiosInstance } from "../axiosInstance";

export const placeOrder = async(paymentMethod,deliveryAddress)=>{
    try{
        const response = await axiosInstance.post('/users/orders',{paymentMethod,deliveryAddress})
        return response.data
    }
    catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const getOrders = async()=>{
    try{

        const response = await axiosInstance.get('/users/orders')
        return response.data
    }
    catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const cancelOrder=async(orderId)=>{
    try{
        console.log(orderId);
        const response = await axiosInstance.patch(`/users/orders/${orderId}`)
        return response.data;
    }
    catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const getParticulartOrder=async(orderId)=>{
    try{

        const response = await axiosInstance.get(`/users/orders/${orderId}`);
        return response.data
    }
    catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}