import categoryDB from "../../Models/categorySchema.js";
import { errorHandler } from "../../utils/error.js";

export const getCategories=async(req,res,next)=>{
    try{

        const categories = await categoryDB.find();
        if(!categories) return next(errorHandler(404,"categories not found"));
        return res.status(200).json({success:true,message:"categories fetched successfully",categories})
    }
    catch(error)
    {
        return next(errorHandler(500,"something went wrong during fetching categories"))
    }
}