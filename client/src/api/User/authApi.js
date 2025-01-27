import { axiosInstance } from "../axiosInstance";

export const loginUser = async (userData)=>{
    try{
        const response = await axiosInstance.post('users/login',userData, { withCredentials: true });
        return response.data;
    }
    catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}


export const signupUser = async (userData)=>{
    try{
        const response = await axiosInstance.post('users/signup',userData);
        return response.data;
    }
    catch(error)
    {
        if(!error.response){
            throw error;
        }
        else{
        throw error?.response?.data || error;
        }    
    }
}

export const verifyOtp = async({email,otp})=>{
    try{
        const response = await axiosInstance.post('users/signup/otp',{email,otp})
        return response.data
    }
    catch(error)
    {
        throw error?.response?.data || error;
    }
}

export const resendOtp = async ({email})=>{
    try{
        const response = await axiosInstance.post('users/resendOtp',{email})
        return response.data;
    }
    catch(error)
    {
        throw error?.response?.data || error;
    }
}


export const loginWithGoogle = async(name,email)=>{
    try{
        const response = await axiosInstance.post('/users/googleLogin',{name,email})
        return response.data
    }
    catch(error)
    {
        throw error?.response?.data || error;
    }
}


export const logout = async()=>{
    try{
        const response  = await axiosInstance.post('/users/logout')
        return response.data;
    }
    catch(error)
    {
        throw error?.response?.data || error;
    }
}


export const forgotVerifyEmail=async(email)=>{
    try{
        const response  = await axiosInstance.post('/users/forgotPassword',{email})
        return response.data;
    }
    catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}

export  const forgotChangePassword=async(email,newPassword)=>{
    try{
        const response = await axiosInstance.patch('/users/forgotPassword',{email,newPassword})
        return response.data
    }catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}