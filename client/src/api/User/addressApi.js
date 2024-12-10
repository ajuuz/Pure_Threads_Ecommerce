import { axiosInstance } from "../axiosInstance";

export const getAddresses = async()=>{
    try{
        const response = await axiosInstance.get('/users/address')
        return response.data;
    }
    catch(error)
    {
        throw error?.response.data || error
    }   
}




export const  addAddress = async(formData)=>{
    try{
        const response = await axiosInstance.post("/users/address",formData);
        return response.data
    }
    catch(error)
    {
        throw error?.response.data || error
    }
}

export const getAddress = async(id)=>{
    try{
        const response = await axiosInstance.get(`/users/address/${id}`);
        return response.data;
    }
    catch(error)
    {
        throw error?.response.data||error
    }
}


export const editAddress = async(formData,id)=>{
    try{

        const response = await axiosInstance.put(`/users/address/${id}`,formData)
        return response.data;
    }
    catch(error)
    {
        throw error?.response.data || error
    }
}

export const deleteAddress = async(id)=>{
    try{

        const response = await axiosInstance.delete(`/users/address/${id}`);
        return response.data;
    }
    catch(error)
    {
        throw error?.response.data || error
    }
}

export const setDefaultAddress=async(id)=>{
    try{
        const response = await axiosInstance.patch(`/users/address/${id}`)
        return response.data;
    }
    catch(error)
    {
        throw error?.response.data || error
    }
}