import orderDB from "../../Models/orderSchema.js";
import walletDB from "../../Models/walletSchema.js";
import { errorHandler } from "../../utils/error.js";

export const getAllOrders = async(req,res,next)=>{
    try{
    const orders = await orderDB.find().populate('items.product')
    if(!orders) return next(errorHandler(404,"order not found"));
    return res.status(200).json({success:true,message:"orders fetched successfully",orders})
    }catch(error){
        return next(errorHandler(500,"something went wrong please try again"))
    }
}

export const updateOrderStatus = async(req,res,next)=>{
    const {orderId} = req.params
    const {userId,status,isPaymentDone,totalAmount} = req.body
    
    if(!["Pending","Confirmed","Packed","Shipped","Delivered","Returned","Cancelled"].includes(status)) return next(errorHandler(400,"Invalid Status"))
        const updationFields={status};

        if(["Cancelled","Delivered"].includes(status)){
            const today = new Date();
            today.setDate(today.getDate() + 6);
            updationFields.deliveryDate = today
        }

        //refunding the paid amount
        if(status==="Cancelled" && isPaymentDone){
            const transcationDetails={
                description:`cashback for order cancellation orderId:${orderId}`,
                transactionDate:new Date(),
                transactionType:"Credit",
                transactionStatus:"Success",
                amount:totalAmount
            }

            const wallet = await walletDB.findOne({userId})
            if(!wallet)
            {
                const newWallet = new walletDB({
                    userId,
                    balance:totalAmount,
                    transactions:[transcationDetails]
                })
                await newWallet.save();
            }
            else
            {
                wallet.balance+=totalAmount;
                wallet.transactions.push(transcationDetails)
                await wallet.save()
            }
            //payment status changing
            updationFields.paymentStatus="Refunded";
        }else if(status==="Cancelled"){
            updationFields.paymentStatus="Cancelled"        
        }

        if(status==="Delivered"){
            updationFields.paymentStatus="Success"
        }

        try{
        const updatedOrder = await orderDB.updateOne({orderId},{$set:updationFields});
        if(!updatedOrder.matchedCount) return next(errorHandler(404,"order not found"));
        if(!updatedOrder.modifiedCount) return next(errorHandler(400,"no changes made"));
        return res.status(200).json({success:true,message:"state update to "+status+" successfully"})
    }catch(error){
        return next(errorHandler(500,"something went wrong please try again"))
    }
}