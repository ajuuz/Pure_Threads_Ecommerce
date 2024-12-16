import cartDB from "../../Models/cartSchema.js";
import orderDB from "../../Models/orderSchema.js";
import productDB from "../../Models/productSchema.js";
import { errorHandler } from "../../utils/error.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";

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

export const getOrders = async(req,res)=>{
    try{
        const userId = refreshTokenDecoder(req);
        const orders = await orderDB.find({userId})
        if(!orders) return next(errorHandler(404,"orders not found"));
        return res.status(200).json({success:true,message:"orders fetched successfully",orders})
    }catch(error){
        console.log(error.message)
        return next(errorHandler(500,"something went wrong"))
    }
}

export const cancelOrder = async(req,res,next)=>{
    const {orderId} = req.params
    try{
        const updatedOrder = await orderDB.updateOne({orderId},{$set:{status:"cancelled"}});
        if(!updatedOrder.matchedCount) return next(errorHandler(404,"order not found"))
        if(!updatedOrder.modifiedCount) return next(errorHandler(400,"No changes made"));
        return res.status(200).json({success:true,message:"Your Order has been Cancelled"});
    }
    catch(error)
    {
        return next(errorHandler(500,"something went wrong , please try again"))
    }
}

export const getParticularOrder = async(req,res,next)=>{
    const {orderId} = req.params
    try{
        const order = await orderDB.findOne({orderId})
        if(!order) return next(errorHandler(404,"order not found"));
        res.status(200).json({success:true,message:"order fetched successfully",order})
    }
    catch(error){
        return next(errorHandler(500,"something went wrong , please try again"))
    }
}