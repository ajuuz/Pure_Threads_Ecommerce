import cartDB from "../../Models/cartSchema.js";
import orderDB from "../../Models/orderSchema.js";
import productDB from "../../Models/productSchema.js";
import walletDB from "../../Models/walletSchema.js";
import { errorHandler } from "../../utils/error.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";

import PDFDocument from 'pdfkit';

import dotenv from "dotenv"
import { paymentVerification } from "../CommonController/razorPayController.js";
import failedOrderDB from "../../Models/failedOrderSchema.js";
import UsersDB from "../../Models/userSchema.js";
import couponDB from "../../Models/couponSchema.js";
dotenv.config(); // Load environment variables from .env file


export const getAllOrders = async(req,res)=>{
    try{
        const userId = refreshTokenDecoder(req);
        const {sortCriteria,currentPage,limit,status}=req.query; //status means failed or successfull order
        const sort = JSON.parse(sortCriteria)
        const skip=(currentPage-1)*limit;
        let collection=orderDB
        if(status==="failed") collection=failedOrderDB;
        const orders=await Promise.all([
          await collection.countDocuments({userId}),
          await collection.find({userId}).sort(sort).skip(skip).limit(limit).populate('items.product'),
          await failedOrderDB.countDocuments({userId}),
          await orderDB.countDocuments({userId})
      ])

      const numberOfPages=Math.ceil(orders[0]/limit)
        return res.status(200).json({success:true,message:"orders fetched successfully",numberOfPages,orders:orders[1],failedOrdersCount:orders[2],ordersCount:orders[3]})
    }catch(error){
      if(error.name==="MongoServerError"){
        return next(errorHandler(500,"Database error occured while fetching failed orders"));
    }
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
    const userId = req.userId
    const items = req.cartItems
    const {isCouponUsableLimit,couponExistInUser}=req.body //for coupon count management
    const {failedOrderId}=req.body;

    let paymentStatus="Pending"

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
        paymentVerification(paymentDetails,next);
        newOrderDetails.paymentStatus="Success"
    }

    let wallet;
    if(paymentMethod==="wallet")
    {
        wallet = await walletDB.findOne({userId})
        if(wallet.balance<totalAmount){
          return next(errorHandler(400,"not enough balance"))
        }
        newOrderDetails.paymentStatus="Success"
    }
    const newOrder =new orderDB(newOrderDetails)
    await newOrder.save()

    const updateTasks=[];
    
        
        //making updation after placing order  - cart,product , if(wallet) updating wallet
        updateTasks.push(cartDB.updateOne({userId},{$set:{items:[]}}))

        items.forEach((item)=>{
          const productId = item.product._id;
          const quantityPurchased = item.quantity;
          const sizePurchased = item.size;
          updateTasks.push(productDB.updateOne({_id:productId},{$inc:{'sizes.$[s].stock':-quantityPurchased}},{arrayFilters:[{'s.size':sizePurchased}]},{ runValidators: true }))
        })
       

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
            updateTasks.push(wallet.save())
        }

        if(couponUsed?.couponCode!=="No Coupon Used"){
          if(isCouponUsableLimit){
            updateTasks.push(couponDB.updateOne({couponCode:couponUsed?.couponCode},{$inc:{'maxUsableLimit.limit':-1}}))
          }

          if(couponExistInUser){
            updateTasks.push(UsersDB.updateOne({_id:userId},{$inc:{'usedCoupons.$[coupon].usedCount':1}},{arrayFilters:[{'coupon.couponCode':couponUsed?.couponCode}]}))
          }else{
            updateTasks.push(UsersDB.updateOne({_id:userId},{$push:{usedCoupons:{couponCode:couponUsed.couponCode,usedCount:1}}}))
          }
        }

        if(failedOrderId)
        {
          updateTasks.push(failedOrderDB.deleteOne({_id:failedOrderId}))
        }

        await Promise.all(updateTasks)

        res.status(201).json({success:true,message:"order Placed Successfully",orderData:{orderId:newOrder.orderId,deliveryDate:newOrder.deliveryDate,paymentStatus:newOrder.paymentStatus,createdAt:newOrder.createdAt}})
    }
    catch(error){
       return next(errorHandler(500,"something went wrong"))
    }
}
// //place order
// export const placeOrder = async(req,res,next)=>{

//     const {paymentMethod,deliveryAddress,couponUsed,totalAmount} = req.body; //details need for all payment method place order
//     const {paymentDetails} = req.body //only when payment made using razorpay (success)
//     const userId = req.userId
//     const items = req.cartItems
//     const {isCouponUsableLimit,couponExistInUser}=req.body //for coupon count management

//     let paymentStatus="Pending"

//         const newOrderDetails={
//             userId,
//             deliveryAddress,
//             items,
//             paymentMethod,
//             paymentStatus,
//             totalAmount,
//             couponUsed
//         }
//     try{
//     if (paymentMethod === 'razorpay'){
//         paymentVerification(paymentDetails,next);
//         newOrderDetails.paymentStatus="Success"
//     }

//     let wallet;
//     if(paymentMethod==="wallet")
//     {
//         wallet = await walletDB.findOne({userId})
//         if(wallet.balance<totalAmount){
//           return next(errorHandler(400,"not enough balance"))
//         }
//         newOrderDetails.paymentStatus="Success"
//     }
//     const newOrder =new orderDB(newOrderDetails)
//     await newOrder.save()

//     const updateTasks=[];
    
        
//         //making updation after placing order  - cart,product , if(wallet) updating wallet
//         await cartDB.updateOne({userId},{$set:{items:[]}})

//         for(let item of items)
//             {
//                 const productId = item.product._id;
//                 const quantityPurchased = item.quantity;
//                 const sizePurchased = item.size;
//                 await productDB.updateOne({_id:productId},{$inc:{'sizes.$[s].stock':-quantityPurchased}},{arrayFilters:[{'s.size':sizePurchased}]},{ runValidators: true })
//             }

//         if(paymentMethod==="wallet") {
//             const transcationDetails={
//                 description:`spend ${totalAmount} for order (${newOrder.orderId})`,
//                 transactionDate:new Date(),
//                 transactionType:"Debit",
//                 transactionStatus:"Success",
//                 amount:totalAmount
//             }
//             wallet.balance=wallet.balance-totalAmount;
//             wallet.transactions.push(transcationDetails);
//             await wallet.save()
//         }

//         if(couponUsed?.couponCode!=="No Coupon Used"){
//           if(isCouponUsableLimit) await couponDB.updateOne({couponCode:couponUsed?.couponCode},{$inc:{'maxUsableLimit.limit':-1}})

//           if(couponExistInUser){
//             await UsersDB.updateOne({_id:userId},{$inc:{'usedCoupons.$[coupon].usedCount':1}},{arrayFilters:[{'coupon.couponCode':couponUsed?.couponCode}]})
//           }else{
//             await UsersDB.updateOne({_id:userId},{$push:{usedCoupons:{couponCode:couponUsed.couponCode,usedCount:1}}})
//           }
//         }

//         res.status(201).json({success:true,message:"order Placed Successfully",orderData:{orderId:newOrder.orderId,deliveryDate:newOrder.deliveryDate,paymentStatus:newOrder.paymentStatus,createdAt:newOrder.createdAt}})
//     }
//     catch(error){
//        return next(errorHandler(500,"something went wrong"))
//     }
// }



export const orderRepayment=async(req,res,next)=>{
    try{
        const {orderId,paymentDetails}=req.body;
        const items = req.cartItems

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
        return next(errorHandler(500,"something went wrong , please try again"))
    }
}

const returnOrderRequest=async(req,res,next)=>{
    try{
        const {orderId} = req.params
        const updateOrderStatus=await orderDB.updateOne({orderId},{$set:{status:"Return Requested"}})
        if(updateOrderStatus.matchedCount===0) return next(errorHandler(404,"order not found"))
        if(updateOrderStatus.modifiedCount===0) return next(errorHandler(400,"no updation made"))
        return res.status(200).json({success:true,message:"you order is requested for return"})
    }
    catch(error)
    {
        return next(errorHandler(500,"something went wrong , please try again"))
    }
}




export const downloadInvoice = async (req, res, next) => {
    try {
      const { orderId } = req.params
      const orderDetails = await orderDB.findOne({ orderId }).populate('items.product')
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