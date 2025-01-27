import cartDB from "../../Models/cartSchema.js";
import failedOrderDB from "../../Models/failedOrderSchema.js";
import { errorHandler } from "../../utils/error.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";

export const placeFailedOrder=async(req,res,next)=>{
    try{
      const {paymentMethod,deliveryAddress,couponUsed,totalAmount} = req.body; //details need for all payment method place order
      if(!paymentMethod) return next(errorHandler(400,"select a payment method"))
      if(!deliveryAddress) return next(errorHandler(400,"select a deivery Address"))


      const userId = req.userId
      const items = req.cartItems
  
      const newFailedOrderDetails={
        userId,
        deliveryAddress,
        items,
        paymentMethod,
        totalAmount,
        couponUsed
    }
  
    const newOrder =new failedOrderDB(newFailedOrderDetails)

    await Promise.all([
        newOrder.save(),
        cartDB.updateOne({userId},{$set:{items:[]}})
    ])


    res.status(200).json({success:true,message:"Payment has been failed! Order has been created you can Re pay and place Order from My Orders"})
      
    }catch(error)
    {
        return next(errorHandler(500,"something went wrong during order creation when payment failed"));
    }
  }
  

