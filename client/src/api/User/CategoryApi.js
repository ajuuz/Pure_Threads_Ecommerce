import { axiosInstance } from "../axiosInstance";

export const getCategories=async()=>{
    try{
        const response = await axiosInstance('/users/categories',{
            method:"GET"
        })
        return response.data
    }
    catch(error)
    {
        throw error?.response.data || error
    }
}