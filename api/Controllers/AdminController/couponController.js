import couponDB from "../../Models/couponSchema.js";
import { errorHandler } from "../../utils/error.js";



const couponHelperFunction=(couponDetails)=>{
    const error=new Error()
    error.name="customValidationError"
    for(let field in couponDetails)
    {
        if(couponDetails[field]===""||couponDetails[field]===null){
             error.message="All fields are required"
             throw error;
        }
    }
    if(couponDetails.couponType==="%" && couponDetails.couponValue>100){
        error.message="coupon value must be between 0-100 %"
        throw error;
    }
}

export const addNewCoupon = async(req,res,next)=>{
    try{
        const couponDetails = req.body;
        couponHelperFunction(couponDetails);
        const newCoupon = new couponDB(couponDetails);
        await newCoupon.save();
        res.status(201).json({success:true,message:"new coupon created"})
    } 
    catch(error)
    {
        if(error.name==="ValidationError"){
            const {type,path}=Object.values(error?.errors)[0]?.properties;
            if(type==="min"){
                if(path==="couponValue") return next(errorHandler(400,"Coupon value cannot be negative"))
                else if(path==="maxRedeemable") return next(errorHandler(400,"max Redeemable Amount cannot be negative"))
                else if(path==="minimumOrderAmount") return next(errorHandler(400,"Minimum Order Amount cannot be negative"))
                else if(path==="maxUsableLimit.limit") return next(errorHandler(400,"Max Usable limit cannot be negative"))
                else if(path==="perUserLimit") return next(errorHandler(400,"Per Use Limit cannot be negative"))
            }
        }
        if(error.name==="customValidationError") return next(errorHandler(400,error.message))

        if(error.code===11000) return next(errorHandler(409,"the coupon code is already existing"))
        return next(errorHandler(500,"something went wrong please try again"));
    }
}

export const editCoupon=async(req,res,next)=>{
    try{
        const couponDetails = req.body;
        const couponId=req.body._id;
        couponHelperFunction(couponDetails,next);
        
        if(!couponDetails?.maxUsableLimit) couponDetails.maxUsableLimit={ isLimited: false, limit: 0 }
        const updatedCoupon=await couponDB.updateOne({_id:couponId},{$set:couponDetails},{ runValidators: true })
        if(updatedCoupon.matchedCount===0) return next(errorHandler(404,"Coupon Not found"));
        else if(updatedCoupon.modifiedCount===0) return next(errorHandler(400,"No changes made"));
        
        return res.status(200).json({success:true,message:"coupon updated Successfully"})
    }
    catch(error) {
        if(error.name==="ValidationError"){
            const {type,path}=Object.values(error?.errors)[0]?.properties;
            if(type==="min"){
                if(path==="couponValue") return next(errorHandler(400,"Coupon value cannot be negative"))
                else if(path==="maxRedeemable") return next(errorHandler(400,"max Redeemable Amount cannot be negative"))
                else if(path==="minimumOrderAmount") return next(errorHandler(400,"Minimum Order Amount cannot be negative"))
                else if(path==="maxUsableLimit.limit") return next(errorHandler(400,"Max Usable limit cannot be negative"))
                else if(path==="perUserLimit") return next(errorHandler(400,"Per Use Limit cannot be negative"))
            }
        }
        if(error.name==="customValidationError") return next(errorHandler(400,error.message))

        if(error.code===11000) return next(errorHandler(409,"the coupon code is already existing"))
        return next(errorHandler(500,"something went wrong please try again"));
    }
}               