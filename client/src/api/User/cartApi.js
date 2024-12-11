import { axiosInstance } from "../axiosInstance";


export const addToCart = async (selectedSize)=>{
    try{
        const response = await axiosInstance.post('/users/cart',selectedSize);
        return response?.data
    }
    catch(error)
    {
        throw error?.response?.data || error 
    }
}