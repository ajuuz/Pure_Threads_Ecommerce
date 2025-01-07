import { axiosInstance } from "../axiosInstance";

export const getWallet =async(transactionType,limit,currentPage)=>{
    try{
        const response = await axiosInstance({
            method:"GET",
            url:`/users/wallet?transactionType=${transactionType}&limit=${limit}&currentPage=${currentPage}`,
        })
        return response.data;
    }catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const addMoneyToWallet=async(amount,description)=>{
    try{
        const response = await axiosInstance.patch('/users/wallet',{amount,description})
        return response?.data
    }
    catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}