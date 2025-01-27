import { axiosInstance } from "../axiosInstance";

export const getProducts = async(sort,limit,currentPage,category,fit,sleeves,searchQuery)=>{
    try{
        const response = await axiosInstance(`/users/products?limit=${limit}&sort=${sort}&currentPage=${currentPage}&category=${category}&fit=${fit}&sleeves=${sleeves}&searchQuery=${searchQuery}&target=user`)
        return response.data
    }
    catch(error)
    {
        throw error?.response.data||error
    }
}

export const getParticularProduct = async(id)=>{
    try{
        const response = await axiosInstance(`/users/products/${id}`)
        return response.data
    }
    catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export const getRelatedProducts = async(categoryId)=>{
    try{
        const response = await axiosInstance(`/users/products/category/${categoryId}`,{
            method:"GET"
        })
        return response.data
    }
    catch(error)
    {
        throw error?.response.data || error
    }   
}