import { axiosInstance } from "../axiosInstance";

export const placeOrder = async(paymentMethod,deliveryAddress,selectedCoupon,totalAmount,couponDiscount,paymentDetails,failedOrderId)=>{
    try{
        const response = await axiosInstance.post('/users/orders',{paymentMethod,deliveryAddress,selectedCoupon,totalAmount,couponDiscount,paymentDetails,failedOrderId})
        return response.data
    }
    catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const placeFailedOrder=async(paymentMethod,deliveryAddress,selectedCoupon,totalAmount,couponDiscount)=>{
    try{
        const response = await axiosInstance.post('/users/failedOrders',{paymentMethod,deliveryAddress,selectedCoupon,totalAmount,couponDiscount})
        return response.data
    }
    catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const orderRepayment = async(orderId,selectedCoupon,paymentDetails)=>{
    try{

        const isRepayment=true;
        const response = await axiosInstance.patch('/users/orders/repayment',{isRepayment,orderId,selectedCoupon,paymentDetails})
        return response.data;
    }
    catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const getOrders = async(sortCriteria,currentPage,limit,status)=>{
    try{
        const response = await axiosInstance.get(`/users/orders?sortCriteria=${sortCriteria}&currentPage=${currentPage}&limit=${limit}&status=${status}`)
        return response.data
    }
    catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const cancelOrder=async(orderId,isPaymentDone,totalAmount)=>{
    try{
        const target="cancel"
        const response = await axiosInstance.patch(`/users/orders/${orderId}`,{isPaymentDone,totalAmount,target})
        return response.data;
    }
    catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const returnOrder=async(orderId)=>{
    console.log(orderId)
    try{
        const response = await axiosInstance.patch(`/users/orders/${orderId}`)
        return response.data;
    }
    catch(error)
    {
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

export const makePayment=async(amount)=>{
    try{
        const response= await axiosInstance("/users/makePayment",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({ amount }),
          });

          return response.data
    }
    catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const verifyPayment=async(paymentDetails)=>{
    try{
        const response= await axiosInstance("/users/verifyPayment",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            data: paymentDetails,
          });

          return response.data
    }
    catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}



export const downloadInvoice=async(orderId)=>{
    try{
        const response = await fetch(import.meta.env.VITE_API_URL+`/users/order/invoice/${orderId}`, {
            method: 'GET',
            credentials:"include",
          });
    
          if (!response.ok) {
            throw new Error('Failed to download invoice');
          }

          return response
    }
    catch(error)
    {
        console.log(error)
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}