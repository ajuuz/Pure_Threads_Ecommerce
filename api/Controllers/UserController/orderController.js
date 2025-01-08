import { razorpay } from "../../config/RazorPay.js";
import cartDB from "../../Models/cartSchema.js";
import orderDB from "../../Models/orderSchema.js";
import productDB from "../../Models/productSchema.js";
import walletDB from "../../Models/walletSchema.js";
import { errorHandler } from "../../utils/error.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";
import crypto from "crypto"
import dotenv from "dotenv"
import { paymentVerification } from "../CommonController/razorPayController.js";
dotenv.config(); // Load environment variables from .env file


export const getOrders = async(req,res)=>{
    try{
        const userId = refreshTokenDecoder(req);
        const orders = await orderDB.find({userId}).populate('items.product')
        if(!orders) return next(errorHandler(404,"orders not found"));
        return res.status(200).json({success:true,message:"orders fetched successfully",orders})
    }catch(error){
        console.log(error.message)
        return next(errorHandler(500,"something went wrong"))
    }
}

export const getParticularOrder = async(req,res,next)=>{
    const {orderId} = req.params
    try{
        const order = await orderDB.findOne({orderId}).populate('items.product')
        if(!order) return next(errorHandler(404,"order not found"));
        res.status(200).json({success:true,message:"order fetched successfully",order})
    }
    catch(error){
        return next(errorHandler(500,"something went wrong , please try again"))
    }
}




//place order
export const placeOrder = async(req,res,next)=>{

    const {paymentMethod,deliveryAddress,totalAmount,couponUsed,paymentDetails} = req.body;

    const userId = req.userId
    console.log(req.cartItems)
    const items = req.cartItems
    let paymentStatus="Pending"
    try{
    if (paymentMethod === 'razorpay') {
        paymentVerification(paymentDetails,paymentStatus,next);
      }
    let wallet;
    if(paymentMethod==="wallet")
    {
        wallet = await walletDB.findOne({userId})
        if(wallet.balance<totalAmount) return next(errorHandler(400,"not enough balance"))
    }

        const newOrder =new orderDB({
              userId,
              deliveryAddress,
              items,
              paymentMethod,
              paymentStatus,
              totalAmount,
              couponUsed
        })
        await newOrder.save()
        
        //making updation after placing order  - cart,product , if(wallet) updating wallet
        await cartDB.updateOne({userId},{$set:{items:[]}})
        for(let item of items)
        {
            const productId = item.product._id;
            const quantityPurchased = item.quantity;
            const sizePurchased = item.size;
            await productDB.updateOne({_id:productId},{$inc:{'sizes.$[s].stock':-quantityPurchased}},{arrayFilters:[{'s.size':sizePurchased}]},{ runValidators: true })
        }

        if(paymentMethod==="wallet") {
            const transcationDetails={
                description:`spend ${totalAmount} for order (${newOrder.orderId})`,
                transactionDate:new Date(),
                transactionType:"Debit",
                transactionStatus:"Success",
                amount:totalAmount
            }
            wallet.balance=wallet.balance-totalAmount;
            wallet.transactions.push(transcationDetails);
            await wallet.save()
        }

        res.status(201).json({success:true,message:"order Placed Successfully",orderData:{orderId:newOrder.orderId,deliveryAddress,deliveryDate:newOrder.deliveryDate,totalAmount:newOrder.totalAmount,paymentMethod:newOrder.paymentMethod,createdAt:newOrder.createdAt}})
    }
    catch(error){
        console.log(error.message)
       return next(errorHandler(500,"something went wrong"))
    }
}



export const cancelOrder = async(req,res,next)=>{
    const {orderId} = req.params
    const {isPaymentDone,totalAmount} = req.body;

    try{
        const userId = refreshTokenDecoder(req);
        let paymentStatus="Cancelled";
        if(isPaymentDone)
        {
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
            paymentStatus="Refunded";
        }


        const updatedOrder = await orderDB.updateOne({orderId},{$set:{status:"Cancelled",paymentStatus}});
        if(!updatedOrder.matchedCount) return next(errorHandler(404,"order not found"))
        if(!updatedOrder.modifiedCount) return next(errorHandler(400,"No changes made"));
        return res.status(200).json({success:true,message:"Your Order has been Cancelled"});
    }
    catch(error)
    {
        console.log(error.message)
        return next(errorHandler(500,"something went wrong , please try again"))
    }
}




