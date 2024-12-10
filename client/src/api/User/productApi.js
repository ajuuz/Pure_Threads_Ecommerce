import { axiosInstance } from "../axiosInstance";

export const getProducts = async(sort)=>{
    try{
        const response = await axiosInstance(`/users/products?sort=${sort}`)
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
        throw error?.response.data || error
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