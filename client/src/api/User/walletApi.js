import { axiosInstance } from "../axiosInstance";

export const getWallet =async()=>{
    try{
        const response = await axiosInstance({
            method:"GET",
            url:'/users/wallet',
        })
        return response.data;
    }catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}
