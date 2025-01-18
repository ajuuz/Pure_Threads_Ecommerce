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




export const downloadInvoice = async (req, res, next) => {
    try {
      const { orderId } = req.params
      const orderDetails = await orderDB.findOne({ orderId }).populate('items.product')
        console.log(orderDetails)
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 40, left: 40, right: 40, bottom: 40 },
      })
  
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${orderId}.pdf"`)
      doc.pipe(res)
  
      // Add black header bars
      doc
        .fillColor('#000000')
        .rect(0, 0, 100, 60)
        .rect(doc.page.width - 100, 0, 100, 60)
        .fill()
  
      // Header Section
      doc
        .fontSize(36)
        .font('Helvetica-Bold')
        .text('INVOICE', 40, 80)
        
      doc
        .fontSize(16)
        .font('Helvetica')
        .text('PURE THREADS', doc.page.width - 240, 80)
        .fontSize(12)
        .text('Your Shopping Partner', doc.page.width - 240, 100)
  
      // Separator line
      doc
        .moveTo(40, 130)
        .lineTo(doc.page.width - 40, 130)
        .stroke()
  
      // Invoice Details Section
      doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('INVOICE TO:', 40, 150)
  
      doc
        .font('Helvetica')
        .fontSize(12)
        .text(orderDetails.deliveryAddress.name, 40, 170)
        .text(`Address: ${orderDetails.deliveryAddress.address}`, 40, 190)
        .text(`${orderDetails.deliveryAddress.email}`, 90, 210)
        .text(`${orderDetails.deliveryAddress.city, orderDetails.deliveryAddress.state}`, 90, 230)
        .text(`${orderDetails.deliveryAddress.pinCode}`, 90, 250)
  
      // Right side details
      doc
        .fontSize(12)
        .text(`Order ID: ${orderId}`, doc.page.width - 400, 170, { align: 'right' })
        .text(`Date: ${new Date(orderDetails.createdAt).toLocaleDateString()}`, doc.page.width - 200, 190, { align: 'right' })
  
      // Products Table
      const tableTop = 300
      const tableHeaders = ['PRODUCTS', 'QTY', 'PRICE', 'TOTAL']
      const columnWidths = [250, 100, 100, 100]
      
      // Table Header
      doc
        .fillColor('#000000')
        .rect(40, tableTop - 30, doc.page.width - 80, 30)
        .fill()
        .fillColor('#FFFFFF')
        .font('Helvetica-Bold')
        .fontSize(12)
  
      let currentX = 50
      tableHeaders.forEach((header, i) => {
        doc.text(header, currentX, tableTop - 20)
        currentX += columnWidths[i]
      })
  
      // Table Rows
      doc.fillColor('#000000')
      let yPosition = tableTop + 10
  
      orderDetails.items.forEach((item, index) => {
        doc
          .font('Helvetica')
          .fontSize(12)
          .text(item?.product?.name, 50, yPosition)
          .text(item.quantity.toString(), 300, yPosition)
          .text(`Rs.${item?.productPrice}`, 400, yPosition)
          .text(`Rs.${item?.productPrice * item.quantity}`, 500, yPosition)
  
        yPosition += 40
      })
  
      // Separator line
      doc
        .moveTo(40, 430)
        .lineTo(doc.page.width - 50, 430)
        .stroke()

      // Payment Method
      doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('Payment Method:', 40, yPosition + 20)
        .font('Helvetica')
        .fontSize(12)
        .text(`Payment Method: ${orderDetails.paymentMethod==="cod"?"Cash on Delivery":orderDetails.paymentMethod==="razorpay"?"Online":"Wallet"}`, 40, yPosition + 40)
        .text(`Payment Status: ${orderDetails.paymentStatus}`, 40, yPosition + 60)
  
      // Totals
      doc
        .font('Helvetica')
        .fontSize(12)
        // .text('Sub-total:', 400, yPosition + 20)
        // .text(`Rs.${orderDetails.}`, 500, yPosition + 20)
        // .text('Tax:', 400, yPosition + 40)
        // .text(`Rs.${orderDetails.tax}`, 500, yPosition + 40)
        // .font('Helvetica-Bold')
        .text('Delivery Fee:', 400, yPosition + 20)
        .text(`Rs.${0}`, 500, yPosition + 20)
        .text('Coupon Discount:', 400, yPosition + 40)
        .text(`Rs.${orderDetails.couponUsed.couponDiscount}`, 500, yPosition + 40)
        .text('Total:', 400, yPosition + 60)
        .text(`Rs.${orderDetails.totalAmount}`, 500, yPosition + 60)
  
      // Thank you message
      doc
        .font('Helvetica')
        .fontSize(14)
        .text('Thank you for purchase!', 40, yPosition + 100)
  
      
  
      // Bottom bar
      doc
        .fillColor('#000000')
        .rect(0, doc.page.height - 40, doc.page.width, 40)
        .fill()
  
      doc.end()
  
    } catch (error) {
      console.error('Error generating invoice:', error)
      res.status(500).send('Error generating invoice PDF')
    }
  }