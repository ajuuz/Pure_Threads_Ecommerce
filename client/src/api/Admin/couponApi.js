import { axiosInstance } from "../axiosInstance";

export const addNewCoupon=async(couponFormData)=>{
    try{
        console.log(couponFormData)
        const response = await axiosInstance.post('/admin/coupons',couponFormData)
        return response.data;
    }
    catch(error)
    {
        throw error?.response.data || error;
    }
}

export const editCoupon=async(couponFormData)=>{
    try{
        const response = await axiosInstance.put('/admin/coupons',couponFormData)
        return response.data;
    }
    catch(error)
    {
        throw error?.response.data || error;
    }
}

export const getAllCoupons=async(searchInput)=>{
    try{
        const response = await axiosInstance.get(`/admin/coupons?query=${searchInput}`)
        return response.data
    }
    catch(error)
    {
        throw error?.response.data || error;
    }
}