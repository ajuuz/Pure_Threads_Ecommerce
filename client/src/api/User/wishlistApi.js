import { axiosInstance } from "../axiosInstance";

export const addToWishlist=async(productId)=>{
    try{
        const response = await axiosInstance.post(`/users/wishlist/${productId}`);
        return response.data;
    }catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const getWishlistProducts =async(onlyIdNeeded)=>{
    try{
        const response = await axiosInstance({
            method:"GET",
            url:'/users/wishlist',
            params:{onlyIdNeeded}
        })
        return response.data;
    }catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const removeFromWishlist = async(productId)=>{
    try{
        const response = await axiosInstance.patch(`/users/wishlist/${productId}`)
        return response.data
    }catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}
