import { axiosInstance } from "../axiosInstance";

export const  getReviews=async(productId,currentPage,limit)=>{
    try{
        const response = await axiosInstance.get(`/users/review/${productId}?currentPage=${currentPage}&limit=${limit}`)
        return response.data
        }catch(error){
            throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
        }
}

export const voteReview=async(reviewId,status)=>{
    try{
        const response = await axiosInstance.patch(`/users/review/${reviewId}`,{status})
        return response.data
        }catch(error){
            throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
        }
}