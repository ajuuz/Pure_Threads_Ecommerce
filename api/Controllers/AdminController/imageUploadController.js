import { errorHandler } from "../../utils/error.js";
export const uploadImages=(req,res,next)=>{

    console.log(req.file)
    try{
        const uploadedFiles = req.files.map((file)=>({
            url:file.path,
            public_id:file.filename,
        }));
        res.status(200).json({success:true,message:"Image uploaded successfully!",data:uploadedFiles})
    }
    catch(error)
    {
        next(errorHandler(500,"Error uploading images"))
    }
}


