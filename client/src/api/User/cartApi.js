import { axiosInstance } from "../axiosInstance";


export const selectSizeOfProduct = async(productId,sizeIndex)=>{
    try{
        const response = await axiosInstance.post('/users/cart/selectSize',{productId,sizeIndex})
        return response?.data
    }catch(error){
        throw error?.response?.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const addToCart = async (productId,sizeIndex)=>{
    try{
        const response = await axiosInstance.post('/users/cart',{productId,sizeIndex});
        return response?.data
    }
    catch(error)
    {
        throw error?.response?.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const getCartProducts = async ()=>{
    try{
        const response = await axiosInstance.get('/users/cart')
        return response?.data
    }
    catch(error){
        throw error?.response?.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const updateQuantity = async(productId,size,quantity)=>{
    try{
        const response = await axiosInstance.patch('/users/cart',{productId,size,quantity})
        return response.data
    }
    catch(error){
        throw error?.response?.data && {...error?.response.data,statusCode:error.status} || error
    }
}

