import { axiosInstance } from "../axiosInstance";

export const getFailedOrders = async(sortCriteria,currentPage,limit)=>{
    try{
        const response = await axiosInstance.get(`/users/failedOrders?sortCriteria=${sortCriteria}&currentPage=${currentPage}&limit=${limit}`)
        return response.data
    }
    catch(error)
    {
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}