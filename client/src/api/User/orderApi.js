import { axiosInstance } from "../axiosInstance";

export const placeOrder = async(paymentMethod,deliveryAddress,selectedCoupon,totalAmount,couponDiscount,paymentDetails)=>{
    console.log("working")
    try{
        const response = await axiosInstance.post('/users/orders',{paymentMethod,deliveryAddress,selectedCoupon,totalAmount,couponDiscount,paymentDetails})
        return response.data
    }
    catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const getOrders = async(sortCriteria,currentPage,limit)=>{
    try{

        const response = await axiosInstance.get(`/users/orders?target=user&sortCriteria=${sortCriteria}&currentPage=${currentPage}&limit=${limit}`)
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
    console.log(amount)
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
        throw error.response.data;
    }
}

