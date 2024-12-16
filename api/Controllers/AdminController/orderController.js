import orderDB from "../../Models/orderSchema.js";
import { errorHandler } from "../../utils/error.js";

export const getAllOrders = async(req,res,next)=>{
    try{
    const orders = await orderDB.find()
    if(!orders) return next(errorHandler(404,"order not found"));
    return res.status(200).json({success:true,message:"orders fetched successfully",orders})
    }catch(error){
        return next(errorHandler(500,"something went wrong please try again"))
    }
}

export const updateOrderStatus = async(req,res,next)=>{
    const {orderId} = req.params
    const {status} = req.body
    try{

        const updatedOrder = await orderDB.updateOne({orderId},{$set:{status}});
        if(!updatedOrder.matchedCount) return next(errorHandler(404,"order not found"));
        if(!updatedOrder.modifiedCount) return next(errorHandler(400,"no changes made"));
        return res.status(200).json({success:true,message:"state update to "+status+" successfully"})
    }catch(error){
        return next(errorHandler(500,"something went wrong please try again"))
    }
}