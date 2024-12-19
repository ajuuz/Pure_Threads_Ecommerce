import dotenv from "dotenv";
dotenv.config();


// importing nodemailer for sending email
import nodemailer from "nodemailer";
import { errorHandler } from "./error.js";

// initializing transporter for sending mail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.pass,
    },
  });
  

  export const otpSender = async(email,otp,res,next)=>{
     // Send OTP to the user's email
     const mailOptions = {
        from: "pure threads", // Sender's email
        to: email,
        subject: "Your OTP for Signup",
        text: `Your OTP code for signup is: ${otp}`,
      };
      
      // Sending the email with the OTP
      transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
              console.log(err);
              return next(errorHandler(500,"Failed to send OTP" ))
          }
          // Return success message with an OTP sent notification
          res.status(200).json({success: true,message: "OTP sent to your given email. Please verify."});
      });
  
  }