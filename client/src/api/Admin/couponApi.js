import { axiosInstance } from "../axiosInstance";

export const addNewCoupon=async(couponFormData)=>{
    try{
        const response = await axiosInstance.post('/admin/coupons',couponFormData)
        return response.data;
    }
    catch(error)
    {
        throw error?.response.data || error;
    }
}

export const getAllCoupons=async()=>{
    try{
        const response = await axiosInstance.get('/admin/coupons')
        return response.data
    }
    catch(error)
    {
        throw error?.response.data || error;
    }
}