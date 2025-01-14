import { razorpay } from "../../config/RazorPay.js";
import cartDB from "../../Models/cartSchema.js";
import orderDB from "../../Models/orderSchema.js";
import productDB from "../../Models/productSchema.js";
import walletDB from "../../Models/walletSchema.js";
import { errorHandler } from "../../utils/error.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";

import PDFDocument from 'pdfkit';

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

    const {paymentMethod,deliveryAddress,couponUsed,totalAmount} = req.body; //details need for all payment method place order
    const {paymentDetails} = req.body //only when payment made using razorpay (success)
    const {isPaymentFailed} = req.body //only when razor payment fails
    const userId = req.userId
    const items = req.cartItems
    let paymentStatus=req.body.paymentStatus||"Pending"

        const newOrderDetails={
            userId,
            deliveryAddress,
            items,
            paymentMethod,
            paymentStatus,
            totalAmount,
            couponUsed
        }
    try{
    if (paymentMethod === 'razorpay'){
        if(!isPaymentFailed) { //payment success
        paymentVerification(paymentDetails,next);
        newOrderDetails.paymentStatus="Success"
      }else{
        newOrderDetails.expiryDate=new Date() //for expiry of failed order
      }
    }

    let wallet;
    if(paymentMethod==="wallet")
    {
        wallet = await walletDB.findOne({userId})
        if(wallet.balance<totalAmount) return next(errorHandler(400,"not enough balance"))
        newOrderDetails.paymentStatus="Success"
    }
        const newOrder =new orderDB(newOrderDetails)
        await newOrder.save()
        
        //making updation after placing order  - cart,product , if(wallet) updating wallet
        await cartDB.updateOne({userId},{$set:{items:[]}})

        if(!isPaymentFailed)
        {
            for(let item of items)
                {
                    const productId = item.product._id;
                    const quantityPurchased = item.quantity;
                    const sizePurchased = item.size;
                    await productDB.updateOne({_id:productId},{$inc:{'sizes.$[s].stock':-quantityPurchased}},{arrayFilters:[{'s.size':sizePurchased}]},{ runValidators: true })
                }
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

        res.status(201).json({success:true,message:"order Placed Successfully",orderData:{orderId:newOrder.orderId,deliveryAddress,deliveryDate:newOrder.deliveryDate,totalAmount:newOrder.totalAmount,paymentMethod:newOrder.paymentMethod,paymentStatus:newOrder.paymentStatus,createdAt:newOrder.createdAt}})
    }
    catch(error){
        console.log(error.message)
       return next(errorHandler(500,"something went wrong"))
    }
}


export const orderRepayment=async(req,res,next)=>{
    try{
        const {orderId,paymentDetails}=req.body;
        const items = req.cartItems
        console.log(items)
        //verifying payment
        paymentVerification(paymentDetails,next);
        const paymentStatus="Success"

        for(let item of items)
        {
            const productId = item.product._id;
            const quantityPurchased = item.quantity;
            const sizePurchased = item.size;
            await productDB.updateOne({_id:productId},{$inc:{'sizes.$[s].stock':-quantityPurchased}},{arrayFilters:[{'s.size':sizePurchased}]},{ runValidators: true })
        }

        const updateOrderPaymentStatus=await orderDB.updateOne({orderId},{$set:{paymentStatus},$unset:{expiryDate:""}})
        if(updateOrderPaymentStatus.matchedCount===0) return next(errorHandler(404,"order not found"))
        if(updateOrderPaymentStatus.modifiedCount===0) return next(errorHandler(400,"no updation made"));
        return res.status(200).json({success:true,message:"Order Placed Succesfully"})

    }
    catch(error)
    {
        console.log(error.message)
        return next(errorHandler(500,"something went wrong"))
    }
}

export const updateOrderStatus = async(req,res,next)=>{
    if(req.body.target==="cancel") cancelOrder(req,res,next)
    else returnOrderRequest(req,res,next)
}

const cancelOrder=async(req,res,next)=>{
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

        const cancelDate=new Date()
        
        const updatedOrder = await orderDB.updateOne({orderId},{$set:{status:"Cancelled",deliveryDate:cancelDate,paymentStatus}});
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

const returnOrderRequest=async(req,res,next)=>{
    try{
        const {orderId} = req.params
        console.log(orderId)
        const updateOrderStatus=await orderDB.updateOne({orderId},{$set:{status:"Return Requested"}})
        if(updateOrderStatus.matchedCount===0) return next(errorHandler(404,"order not found"))
        if(updateOrderStatus.modifiedCount===0) return next(errorHandler(400,"no updation made"))
        return res.status(200).json({success:true,message:"you order is requested for return"})
    }
    catch(error)
    {
        console.log(error)
        return next(errorHandler(500,"something went wrong , please try again"))
    }
}




export const downloadInvoice=async(req,res,next)=>{
    try {
        console.log("working")
        const { orderId } = req.params
        // Assuming you have a function to fetch order details
        const orderDetails = await orderDB.findOne({orderId})
        
    
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, left: 40, right: 40, bottom: 50 },
        })
    
        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="order-${orderId}.pdf"`)
        doc.pipe(res)
    
        // Header Section
        doc
          .fontSize(24)
          .font('Helvetica-Bold')
          .text('Order Invoice', { align: 'center' })
          .fontSize(14)
          .font('Helvetica')
          .text('Thank you for your purchase', { align: 'center' })
          .moveDown(2)
    
        // Order Details Section
        doc
          .font('Helvetica-Bold')
          .fontSize(18)
          .text('Order Details')
          .moveDown(0.5)
        
        doc
          .font('Helvetica')
          .fontSize(12)
          .text(`Order ID: ${orderDetails.orderId}`, { continued: true })
          .text(`Order Date: ${new Date(orderDetails.createdAt).toLocaleString()}`, { align: 'right' })
          .moveDown(2)
    
        // Delivery Expected Section
        doc
          .font('Helvetica-Bold')
          .fontSize(18)
          .text('Delivery Expected By')
          .moveDown(0.5)
        
        doc
          .font('Helvetica')
          .fontSize(12)
          .text(new Date(orderDetails.deliveryDate).toLocaleDateString())
          .moveDown(2)
    
        // Delivery Address Section
        doc
          .font('Helvetica-Bold')
          .fontSize(18)
          .text('Delivery Address')
          .moveDown(0.5)
        
        doc
          .font('Helvetica')
          .fontSize(12)
          .text(orderDetails.deliveryAddress.name)
          .text(orderDetails.deliveryAddress.address)
          .text(orderDetails.deliveryAddress.buildingName)
          .text(`${orderDetails.deliveryAddress.city}, ${orderDetails.deliveryAddress.state}`)
          .text(orderDetails.deliveryAddress.pincode)
          .moveDown(2)
    
        // Payment Details Section
        doc
          .font('Helvetica-Bold')
          .fontSize(18)
          .text('Payment Details')
          .moveDown(0.5)
    
        // Add a line for shipping fee
        doc
          .font('Helvetica')
          .fontSize(12)
          .text('Shipping Fee:', { continued: true })
          .text(`Rs.${0}`, { align: 'right' })
          .moveDown(0.5)
    
        // Add a line for total amount
        doc
          .font('Helvetica-Bold')
          .fontSize(14)
          .text('Total Amount:', { continued: true })
          .text(`Rs.${orderDetails.totalAmount}`, { align: 'right' })
          .moveDown(2)
    
        // Add a bottom border
        doc
          .moveTo(40, doc.y)
          .lineTo(doc.page.width - 40, doc.y)
          .stroke()
    
        // Footer
        doc
          .moveDown()
          .fontSize(10)
          .font('Helvetica')
          .text('Thank you for shopping with us!', { align: 'center' })
    
        // Finalize the PDF
        doc.end()
    
      } catch (error) {
        console.error('Error generating invoice:', error)
        res.status(500).send('Error generating invoice PDF')
      }
}