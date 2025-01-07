import { razorpay } from "../../config/RazorPay.js";
import { errorHandler } from "../../utils/error.js";
import crypto from "crypto"
import dotenv from "dotenv"
dotenv.config(); // Load environment variables from .env file

//make payment
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


//helper function
export const paymentVerification=(paymentDetails,paymentStatus,next)=>{

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