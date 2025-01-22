import cartDB from "../Models/cartSchema.js";
import failedOrderDB from "../Models/failedOrderSchema.js";
import orderDB from "../Models/orderSchema.js";
import { errorHandler } from "../utils/error.js";
import { refreshTokenDecoder } from "../utils/jwtTokens/decodeRefreshToken.js";

export const validateProduct =async(req,res,next)=>{
    try{
        const userId = refreshTokenDecoder(req);

        const {paymentMethod,totalAmount} = req.body; 

        if(paymentMethod==="cod" && totalAmount<1500) return next(errorHandler(400,"cash on delivery available only for above 1500 purchase"))

        const {failedOrderId}=req.body;//repayment of order if falied payment
        let items=[]
        let order;
        if(failedOrderId){
          order=await failedOrderDB.findOne({_id:failedOrderId},{items:1,couponUsed:1}).populate({path:'items.product',populate:{path:'category',select:'name -_id'}});
          items=order.items;
        }
        else{
          const cart = await cartDB.findOne({userId}).populate({path:'items.product',populate:{path:'category',select:'name -_id'}})
          items=cart.items;
          if(items.length===0) return next(errorHandler(400,"cart is empty"))
        }
        
        items.forEach((item)=>{
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
          
            req.cartItems = items.map((item)=>{
              return {
                product:item.product._id,
                productPrice:item.product.salesPrice,
                size:item.size,
                quantity:item.quantity
              }
            })
                    
          next();
    }
    catch(error){
        console.log(error.message)
    }
} 