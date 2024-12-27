import couponDB from "../../Models/couponSchema.js";
import { errorHandler } from "../../utils/error.js";

export const addNewCoupon = async(req,res,next)=>{
    try{
        const couponDetails = req.body;
        const newCoupon = new couponDB(couponDetails);
        await newCoupon.save();
        res.status(201).json({success:true,message:"new coupon created"})
    }
    catch(error)
    {
        if(error.code===11000) return next(errorHandler(409,"the coupon code is already existing"))
        return next(errorHandler(500,"something went wrong please try again"));
    }
}

export const getAllCoupons = async(req,res,next)=>{
    try{
        const coupons = await couponDB.find();
        if(!coupons) return next(errorHandler(404,"failed to fetch coupons"))
        return res.status(200).json({success:true,message:"coupons fetched successfully",coupons})
    }
    catch(error)
    {
        return next(errorHandler(500,"something went wrong please try again"));
    }
}