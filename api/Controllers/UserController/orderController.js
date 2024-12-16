import cartDB from "../../Models/cartSchema.js";
import orderDB from "../../Models/orderSchema.js";
import productDB from "../../Models/productSchema.js";
import { errorHandler } from "../../utils/error.js";

export const placeOrder = async(req,res,next)=>{
    const {paymentMethod,deliveryAddress} = req.body
    const userId = req.userId
    const items = req.cartItems.toObject()
    const totalAmount = items.reduce((acc,curr)=>{
        acc+=(curr.quantity*curr.product.salesPrice)
        return acc
    },0)
    try{
        const newOrder =new orderDB({
              userId,
              deliveryAddress,
              items,
              paymentMethod,
              totalAmount
        })

        await newOrder.save()
        await cartDB.updateOne({userId},{$set:{items:[]}})

        for(let item of items)
        {
            const productId = item.product._id;
            const quantityPurchased = item.quantity;
            const sizePurchased = item.size;
            await productDB.updateOne({_id:productId},{$inc:{'size.$[s].stock':-quantityPurchased}},{arrayFilters:[{'s.size':sizePurchased}]},{ runValidators: true })
        }
            res.status(201).json({success:true,message:"order Placed Successfully",orderData:{orderId:newOrder.orderId,deliveryAddress,deliveryDate:newOrder.deliveryDate,totalAmount:newOrder.totalAmount,paymentMethod:newOrder.paymentMethod,createdAt:newOrder.createdAt}})
    }
    catch(error){
        console.log(error.message)
       return next(errorHandler(500,"something went wrong"))
    }
}