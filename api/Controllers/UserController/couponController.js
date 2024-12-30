import couponDB from "../../Models/couponSchema.js";
import cartDB from "../../Models/cartSchema.js";
import { errorHandler } from "../../utils/error.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";

export const getCheckoutAvailableCoupons = async(req,res,next)=>{
    try{
        const userId = refreshTokenDecoder(req)
        
        const cartItemsDoc = await cartDB.findOne({userId},{_id:0,userId:0}).populate('items.product')
        if(!cartItemsDoc) return next(errorHandler(404,"cart not found"))
        const cartItems = cartItemsDoc.items;
        const totalOrderAmount = cartItems.reduce((acc,curr)=>acc+=(curr?.quantity*curr?.product?.salesPrice),0)
        
        const availableCoupons = await couponDB.find({minimumOrderAmount:{$lte:totalOrderAmount}})
        if(!availableCoupons) return next(errorHandler(404,"coupons not found"))
        return res.status(200).json({success:true,message:"fetched available coupons successfully",availableCoupons})
    }
    catch(error)
    {
        return next(errorHandler(500,"something went wrong please try again"));
    }
}