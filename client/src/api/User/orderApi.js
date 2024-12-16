import { axiosInstance } from "../axiosInstance";

export const placeOrder = async(paymentMethod,deliveryAddress)=>{
    try{
        const response = await axiosInstance.post('/users/order',{paymentMethod,deliveryAddress})
        return response.data
    }
    catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}