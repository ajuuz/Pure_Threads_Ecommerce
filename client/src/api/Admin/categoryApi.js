import { axiosInstance } from "../axiosInstance";
import { uploadImage } from "./formSubmissionApi";

export const getCategories = async (searchQuery)=>{
    try{
        const response = await axiosInstance({
            method:'GET',
            url:`admin/categories?searchQuery=${searchQuery}`
        })
        return response.data;
    }
    catch(error)
    {
        throw error.response?.data||error;
    }
}

export const getParticularCategory = async(id)=>{
    try{

        const response = await axiosInstance({
            method:"GET",
            url:`admin/categories/${id}`
        })
        return response.data
    }
    catch(error)
    {
        throw error.response?.data||error;
    }
}

export const editCategory=async(categoryId)=>{
    try{
        const response = await axiosInstance({
            method:'PATCH',
            url:`admin/categories/${categoryId}`
        })
        return response.data;
    }
    catch(error)
    {
        throw error.response?.data||error;
    }
}

export const editEntireCategory=async(id,formData,imagesNeededToUpload)=>{
    try{
        let image=null
        if(imagesNeededToUpload.length>0)
        {
                const imageData = new FormData();
                imagesNeededToUpload.forEach((image,index)=>{
                    imageData.append('image',image);
                })
           const imageUploadResult = await uploadImage(imageData);
            if(!imageUploadResult.success)
            {
                throw new Error(imageUploadResult.message || "Failed to upload image");
                return;
            }
            image=imageUploadResult.data[0]
        }
        const response = await axiosInstance({
            method:"PUT",
            url:`admin/categories/${id}`,
            data:{
                image,
                formData
            }
        })
        return response.data
    }
    catch(error)
    {
        throw error?.response.data || error;
    }
}

export const updateCategoryOffer=async(categoryId,offerValue,offerType)=>{
    try{
        const response = await axiosInstance({
            method:"PATCH",
            url:`admin/categories/${categoryId}`,
            data:{offerValue,offerType}
        })
        return response.data;
    }
    catch(error){
        throw error?.response.data || error;
    }
}