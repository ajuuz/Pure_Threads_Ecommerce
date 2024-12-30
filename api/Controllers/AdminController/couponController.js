import couponDB from "../../Models/couponSchema.js";
import { errorHandler } from "../../utils/error.js";

export const addNewCoupon = async(req,res,next)=>{
    try{
        console.log(req.body)
        const couponDetails = req.body;
        const newCoupon = new couponDB(couponDetails);
        await newCoupon.save();
        res.status(201).json({success:true,message:"new coupon created"})
    }
    catch(error)
    {
        console.log(error.message)
        if(error.code===11000) return next(errorHandler(409,"the coupon code is already existing"))
        return next(errorHandler(500,"something went wrong please try again"));
    }
}

