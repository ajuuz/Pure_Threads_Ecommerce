import couponDB from "../../Models/couponSchema.js";
import { errorHandler } from "../../utils/error.js";

export const getAllCoupons = async(req,res,next)=>{
    const {isActive,query} = req.query
    let filter = {}
    // if(isActive!==undefined) filter.isActive =isActive
    if(query?.trim()){
        console.log(query)
        filter.couponCode = {$regex:query,$options:'i'};
    }
    try{
        const coupons = await couponDB.find(filter);
        if(!coupons) return next(errorHandler(404,"failed to fetch coupons"))
        return res.status(200).json({success:true,message:"coupons fetched successfully",coupons})
    }
    catch(error)
    {
        return next(errorHandler(500,"something went wrong please try again"));
    }
}