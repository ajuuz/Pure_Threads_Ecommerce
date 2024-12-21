import cartDB from "../Models/cartSchema.js";
import { errorHandler } from "../utils/error.js";
import { refreshTokenDecoder } from "../utils/jwtTokens/decodeRefreshToken.js";

export const validateProduct =async(req,res,next)=>{
    try{
        const userId = refreshTokenDecoder(req);
        const cart = await cartDB.findOne({userId}).populate({path:'items.product',populate:{path:'category',select:'name -_id'}})
        cart.items.forEach((item)=>{
        const sizeObject = item?.product?.sizes.find(x=>x.size===item?.size)
             if(!item?.product?.isActive)
            {
              return next(errorHandler(400,"some of your cart item is currently unavailable"))
            }
            else if(sizeObject.stock<item.quantity){
               return next(errorHandler(400,"some of your cart products are stock out"))
            }
          })
          req.userId=userId;
          req.cartItems = cart.items
          next();
    }
    catch(error){
        console.log(error.message)
    }
} 