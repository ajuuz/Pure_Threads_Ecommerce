import { axiosInstance } from "../axiosInstance";
import { uploadImage } from "./formSubmissionApi";


export const getProducts = async()=>{
    try{

        const response = await axiosInstance('/admin/products',{
            method:"GET"
        });
        return response.data
    }
    catch(error)
    {
        throw error?.response.data || error
    }
}


export const getParticularProduct = async(id)=>{
    try{
        const response = await axiosInstance(`admin/products/${id}`,{
            method:"GET"
        });
        return response.data
    }
    catch(error)
    {
        throw error.response?.data||error;
    }
        
}






export const editEntireProduct = async(id,formData,imagesNeededToUpload)=>{
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
                    console.log("image upload error")
                    throw new Error(imageUploadResult.message || "Failed to upload image");
                    return;
                }
                for(let i=0;i<imagesIndexes.length;i++)
                    {
                        imageURLsWithIndexes.push({index:imagesIndexes[i],imageURL:imageUploadResult.data[i]})
                    }
                }
        const response = await axiosInstance({method:'PUT',url:`admin/products/${id}`,data:{imageURLsWithIndexes,formData}})
        return response.data
    }
    catch(error)
    {
        console.log(error)
        throw error?.response.data||error;
    }
}


export const changeProductState=async(id)=>{
    try{
        console.log("working")
        const response = await axiosInstance({
            method:'PATCH',
            url:`admin/products/${id}`
        })
        console.log(response.data)
        return response.data;
    }
    catch(error)
    {
        throw error.response?.data||error;
    }
}


 export const removeProductImage=async(id,index)=>{
        try{
            console.log("removeP working")
            const response =  await axiosInstance({
                method:'PATCH',
                url:`admin/products/${id}`,
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