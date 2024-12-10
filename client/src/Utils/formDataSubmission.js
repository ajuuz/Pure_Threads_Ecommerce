import {toast} from 'react-toastify'
import { uploadImage,formSubmit } from '@/api/Admin/formSubmissionApi';

export const formDatasubmission =async (images,formData,endPoint)=>{
        if(images.length===0){
            console.log("please select an image");
            toast.error("please select an image")
            return
        }

        const imageData = new FormData();
        images.forEach((image,index)=>{
            imageData.append('image',image);
        })
    try{

        const imageUploadResult = await uploadImage(imageData);
        if(!imageUploadResult.success)
        {
            console.log("image upload error")
            throw new Error(imageUploadResult.message || "Failed to upload image");
            return;
        }

        const formDatasubmissionResult = await formSubmit(formData,imageUploadResult.data,endPoint);
        console.log(formDatasubmissionResult);
        return formDatasubmissionResult;
    }
    catch(error)
    {
        console.log(error)
        throw error;
    }
}