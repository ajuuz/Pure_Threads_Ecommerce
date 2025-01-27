import { axiosInstance } from "../axiosInstance";

export const uploadImage =async (imageData)=>{

    try{
        const response = await axiosInstance.post('admin/upload',imageData,{
            headers:{"Content-Type":"multipart/form-data"}
        })

        return response.data;
    }
    catch(error)
    {
        console.error(" api catch")
        if(!error.response){
            throw error;
        }
        else{
        throw error.response.data;
        }    
    }
}


export const formSubmit= async (formData,imageURLs,endPoint)=>{
    const data = {...formData,imageURLs}
    try{
        const response = await axiosInstance.post(`${endPoint==="review"?'users':'admin'}/${endPoint}`,data)
        return response.data;
    }
    catch(error)
    {
        console.error(" api catch")
        if(!error.response){
            throw error;
        }
        else{
        throw error.response.data;
        }  
    }

}