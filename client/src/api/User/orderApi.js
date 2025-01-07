import { axiosInstance } from "../axiosInstance";

export const placeOrder = async(paymentMethod,deliveryAddress,selectedCoupon,totalAmount,paymentDetails)=>{
    console.log("working")
    try{
        const response = await axiosInstance.post('/users/orders',{paymentMethod,deliveryAddress,selectedCoupon,totalAmount,paymentDetails})
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

export const cancelOrder=async(orderId,isPaymentDone,totalAmount)=>{
    try{
        const response = await axiosInstance.patch(`/users/orders/${orderId}`,{isPaymentDone,totalAmount})
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

