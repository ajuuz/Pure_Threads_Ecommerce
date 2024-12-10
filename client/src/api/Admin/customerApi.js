import { axiosInstance } from "../axiosInstance";

export const getCustomers = async ()=>{
    try{
        const response = await axiosInstance('/admin/customers',{
            method:"GET"
        })
        return response.data;
    }
    catch(error)
    {
        throw error?.response.data || error;
    }
}

export const editCustomers = async(id)=>{
    try{
        const response = await axiosInstance(`/admin/customers?id=${id}`,{
            method:"PATCH"
        })
        return response.data
    }
    catch(error)
    {
        throw error?.response.data || error;
    }
}