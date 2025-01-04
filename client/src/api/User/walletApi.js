import { axiosInstance } from "../axiosInstance";

export const getWallet =async(transactionType)=>{
    try{
        const response = await axiosInstance({
            method:"GET",
            url:`/users/wallet?transactionType=${transactionType}`,
        })
        return response.data;
    }catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}
