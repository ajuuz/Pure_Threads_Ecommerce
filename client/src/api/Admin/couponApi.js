import { axiosInstance } from "../axiosInstance";

export const addNewCoupon=async(couponValue,couponType,maxRedeemable,couponCode,minimumAmount)=>{
    try{
        const response = await axiosInstance.post('/admin/coupons',{couponValue,couponType,maxRedeemable,couponCode,minimumAmount})
        return response.data;
    }
    catch(error)
    {
        throw error?.response.data || error;
    }
}

export const getAllCoupons=async()=>{
    try{
        console.log("wokring")
        const response = await axiosInstance.get('/admin/coupons')
        return response.data
    }
    catch(error)
    {
        throw error?.response.data || error;
    }
}