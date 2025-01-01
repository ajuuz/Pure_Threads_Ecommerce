import { razorpay } from "../../config/RazorPay.js";
import cartDB from "../../Models/cartSchema.js";
import orderDB from "../../Models/orderSchema.js";
import productDB from "../../Models/productSchema.js";
import UsersDB from "../../Models/userSchema.js";
import walletDB from "../../Models/walletSchema.js";
import { errorHandler } from "../../utils/error.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";
import crypto from "crypto"
import dotenv from "dotenv"
dotenv.config(); // Load environment variables from .env file

export const placeOrder = async(req,res,next)=>{

    const {paymentMethod,deliveryAddress,totalAmount,couponUsed,paymentDetails} = req.body;

    const userId = req.userId
    const items = req.cartItems.toObject()
    let paymentStatus="Pending"
    try{
    if (paymentMethod === 'razorpay') {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
          .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
          .update(sign.toString())
          .digest('hex');
  
        if (razorpay_signature !== expectedSign) {
            console.log("working error")
          return next(errorHandler(400,"Invalid payment signature"));
        }
        else
        {
            paymentStatus="Success"
        }
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
        await cartDB.updateOne({userId},{$set:{items:[]}})
        
        for(let item of items)
        {
            const productId = item.product._id;
            const quantityPurchased = item.quantity;
            const sizePurchased = item.size;
            await productDB.updateOne({_id:productId},{$inc:{'sizes.$[s].stock':-quantityPurchased}},{arrayFilters:[{'s.size':sizePurchased}]},{ runValidators: true })
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
    const {isPaymentDone,totalAmount} = req.body;

    try{
        const userId = refreshTokenDecoder(req)
        if(isPaymentDone)
        {
            const transcationDetails={
                orderId,
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
        }


        const updatedOrder = await orderDB.updateOne({orderId},{$set:{status:"Cancelled"}});
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

export const makePayment=async(req,res,next)=>{
    try {
        const options = {
          amount: req.body.amount*100, // amount in the smallest currency unit
          currency: 'INR',
          receipt: 'receipt_' + Math.random().toString(36).substring(7),
        };
    
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
      } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
      }
}

export const verifyPayment=async(req,res,next)=>{
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                                .update(sign.toString())
                                .digest('hex');
    
        if (razorpay_signature === expectedSign) {
          // Payment is verified
          res.status(200).json({ message: 'Payment verified successfully' });
        } else {
          res.status(400).json({ error: 'Invalid payment signature' });
        }
      } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
      }
}