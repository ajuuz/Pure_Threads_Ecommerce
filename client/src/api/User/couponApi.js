import { axiosInstance } from "../axiosInstance";

export const getAllCoupons=async()=>{
    try{
        const response = await axiosInstance.get(`/users/coupons?isActive=${true}`)
        return response.data
    }
    catch(error)
    {
        throw error?.response.data || error;
    }
}

export const getCheckoutAvailableCoupons=async()=>{
    try{
        const response = await axiosInstance.get('/users/coupons/checkoutAvailable')
        return response.data
    }
    catch(error)
    {
        throw error?.response.data || error;
    }
}