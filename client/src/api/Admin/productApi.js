import { axiosInstance } from "../axiosInstance";
import { uploadImage } from "./formSubmissionApi";


export const getProducts = async(sort,limit,currentPage,category,fit,sleeves,searchQuery,target)=>{
    try{

        const response = await axiosInstance.get(`/admin/products?limit=${limit}&sort=${sort}&currentPage=${currentPage}&category=${category}&fit=${fit}&sleeves=${sleeves}&searchQuery=${searchQuery}&target=admin`);
        return response.data
    }
    catch(error)
    {
        throw error?.response.data || error
    }
}


export const getParticularProduct = async(productId)=>{
    try{
        const response = await axiosInstance(`admin/products/${productId}`,{
            method:"GET"
        });
        return response.data
    }
    catch(error)
    {
        throw error.response?.data||error;
    }
        
}






export const editEntireProduct = async(productId,formData,imagesNeededToUpload)=>{
    try{
        const imageURLsWithIndexes=[]
        if(imagesNeededToUpload.length>0)
        {
        const imagesIndexes=imagesNeededToUpload.map((image)=>Object.keys(image)).flat(1)
        const imagesBlobs=imagesNeededToUpload.map((image)=>Object.values(image)).flat(1)
        let imageUploadResult=null;
            const imageData = new FormData();
            imagesBlobs.forEach((image,index)=>{
                imageData.append('image',image);
            })
            
                imageUploadResult = await uploadImage(imageData);
                if(!imageUploadResult.success)
                {
                    throw new Error(imageUploadResult.message || "Failed to upload image");
                    return;
                }
                for(let i=0;i<imagesIndexes.length;i++)
                    {
                        imageURLsWithIndexes.push({index:imagesIndexes[i],imageURL:imageUploadResult.data[i]})
                    }
                }
        const response = await axiosInstance({method:'PUT',url:`admin/products/${productId}`,data:{imageURLsWithIndexes,formData}})
        return response.data
    }
    catch(error)
    {
        throw error?.response.data||error;
    }
}


export const changeProductState=async(productId)=>{
    try{
        const response = await axiosInstance({
            method:'PATCH',
            url:`admin/products/${productId}`
        })
        return response.data;
    }
    catch(error)
    {
        throw error.response?.data||error;
    }
}


 export const removeProductImage=async(productId,index)=>{
        try{
            const response =  await axiosInstance({
                method:'PATCH',
                url:`admin/products/${productId}`,
                data:{
                    index:index
                }
            })
            return response.data;
        }
        catch(error)
        {
            throw error?.response.data || error
        }
}

export const updateProductOffer=async(productId,offerValue,offerType,offerPrice)=>{
    try{
        const response = await axiosInstance({
            method:"PATCH",
            url:`/admin/products/${productId}`,
            data:{offerValue,offerType,offerPrice}
        })
        return response.data
    }
    catch(error)
    {
        throw error?.response.data || error
    }
}