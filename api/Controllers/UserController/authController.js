import dotenv from "dotenv";
dotenv.config();

// importing models
import otpDB from "../../Models/otpSchema.js";
import UsersDB from "../../Models/userSchema.js";

// importing nodemailer for sending email
import nodemailer from "nodemailer";
// importing bcrypt for hashing password
import bcrypt from "bcryptjs"

// importing crypto for generating otp
import crypto from "crypto";

// importing custom error handling function for handling errors
import { errorHandler } from "../../utils/error.js";

import jwt from 'jsonwebtoken'
import { generateUserAccessToken } from "../../utils/jwtTokens/accessToken.js";
import { generateUserRefreshToken } from "../../utils/jwtTokens/refreshToken.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";
// initializing transporter for sending mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: process.env.pass,
  },
});


// route for verifying email
export const generateOtp = async (req, res, next) => {
  const { name, email, phone, password } = req.body;
 

  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    const userExists= await UsersDB.findOne({email});
    if(userExists) return next(errorHandler(409,'Email already exists. Please use a different email.'))


    // if user already has not expired otp . then to navigate to otp verify page
    const userWithOtp = await otpDB.findOne({email})
    if(userWithOtp) return res.status(200).json({success:true,message:"already send your otp. please check"})

    const otp = crypto.randomInt(10000, 99999);
    const otpData = new otpDB({
      FormData: {
        name,
        email,
        phone,
        password: hashedPassword,
      },
      email,
      otp,
      createdAt: Date.now(),
    });

    await otpData.save();
    
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

    // expire otp
    setTimeout(async()=>{
        const updatedOtp = await otpDB.updateOne({email},{$set:{otp:null}})
        console.log(updatedOtp)        
    },1000*60)


  } catch (error) {
    console.log("error in verifying signup",error)
      return next(errorHandler(500, "something went wrong . please try again"));
  }
};
                  
// function for verirfying otp and adding data of user to the database
export const verifyOtp = async (req, res,next) => {

  const { email, otp } = req.body;
  console.log(email,otp)
  try {
    const document = await otpDB.findOne({ email });
    if (document.otp == otp) {
      if (!document.FormData) {
        return next(errorHandler(400,"Form data is missing. Cannot create user."))
      }
      const newUser = new UsersDB(document.FormData);
      await newUser.save();
      res.status(201).json({ success: true, message: "new account created successfully" });
    } else {
      return next(errorHandler(401,"otp is incorrect.please try again"))
    }
  } catch (error) {
    return res.status(401).json({success:false,message:"session has been expired",sessionExpires:true})
  }
};


// function for verifying login
export const verifyLogin = async (req, res,next) => {
  const { email, password } = req.body;
  console.log(email,password)
  try {
    const userExist = await UsersDB.findOne({ email });
    if (!userExist)return next(errorHandler(404,`No user with ${email} , Signup to create an account`))
      
      if(!userExist.isActive) return next(errorHandler(403,"you are been blocked. please contact admin"))

      const isPasswordCorrect = bcrypt.compareSync(password, userExist.password);
    if (!isPasswordCorrect) return next(errorHandler(401,"invalid credential , please try again"))
      
      console.log(userExist)
        generateUserAccessToken(res,userExist);
        generateUserRefreshToken(res,userExist)
        return res.status(200).json({success: true,message: "user logged in successfully",userName:userExist.name});

  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false,message: "Something went wrong. Please try again."});
  }
};


// resend otp
export const resendOtp = async (req,res)=>{
    const {email} = req.body;
    try{
        const otp = crypto.randomInt(10000, 99999);
        const updatedOtp = await otpDB.updateOne({email},{$set:{otp:otp}})
        console.log(updatedOtp)

       

        if(!updatedOtp.modifiedCount) return  res.status(404).json({success:false,message:"session has been expired",sessionExpires:true})
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
        res.status(200).json({success: true,message: "OTP sent to your email. Please verify.",});
      });

       // expire otp
      setTimeout(async()=>{
        const updatedOtp = await otpDB.updateOne({email},{$set:{otp:null}})
        console.log(updatedOtp)        
    },1000*60)
    }
    catch(error)
    {
        console.error("ERROR IN RESEND OTP",error);
        return res.status(500).json({success: false,message: "Something went wrong. Please try again."});
    }
}





export const googleAuth = async(req,res,next)=>{
  const {name,email} = req.body

  try{
    const UserExists = await UsersDB.findOne({email});
    if(UserExists)
    {
      generateUserAccessToken(res,UserExists)
      generateUserRefreshToken(res,UserExists)
       return res.status(200).json({success:true,message:"user logged in successfully"})
    }
    else
    {
      const newUser = new UsersDB({
        name,
        email
      })
      const newUserDetail = await newUser.save()
      generateUserAccessToken(res,newUserDetail)
      generateUserRefreshToken(res,newUserDetail)
      res.status(200).json({success:true,message:"account created and logged in successfully"})
    }
  }
  catch(error)
  {
    next(errorHandler(500,"something went wrong please try again"));
  }
}


export const logout = async(req,res,next)=>{
  try{
    res
    .clearCookie('userAccessToken')
    .clearCookie('userRefreshToken')
    .status(200).json({message:"user Logged out successfully"});
  }
  catch(error)
  {
    return next(errorHandler(500,"something went wrong please try again"));
  }
}


export const forgotPassword = async(req,res,next)=>{
  const {email} = req.body;
  console.log(email)
  if(!email) return next(errorHandler(400,"email doesnt recieved"))
  try{
    const user = await UsersDB.findOne({email})
    if(!user) return next(errorHandler(404,"user not found. Please check your email"));

     // if user already has not expired otp . then to navigate to otp verify page
     const userWithOtp = await otpDB.findOne({email})
     if(userWithOtp) return res.status(200).json({success:true,message:"already send your otp. please check"})
 
     const otp = crypto.randomInt(10000, 99999);
     const otpData = new otpDB({
       email,
       otp,
       createdAt: Date.now(),
     });
 
     await otpData.save();
     
     // Send OTP to the user's email
     const mailOptions = {
       from: "pure threads", // Sender's email
       to: email,
       subject: "Your OTP for Signup",
       text: `Your OTP code for changing password is: ${otp}`,
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
 
     // expire otp
     setTimeout(async()=>{
         const updatedOtp = await otpDB.updateOne({email},{$set:{otp:null}})
         console.log(updatedOtp)        
     },1000*60)

  }catch(error){
    console.log(error.message)
    return next(errorHandler(500, "something went wrong . please try again"));
  }
}

export const forgotChangePassword=async(req,res,next)=>{

  const {email,newPassword} = req.body;
  try{
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const updatedPassword  = await UsersDB.updateOne({email},{$set:{password:hashedPassword}})
    console.log(updatedPassword)
    if(!updatedPassword.matchedCount) return next(errorHandler(404,"user not found"));
    if(!updatedPassword.modifiedCount) return next(errorHandler(400,"no changes made"))
      return res.status(200).json({success:true,message:"password changed sucesfully"})
  }catch(error){
    console.log("error in changing  password ",error)
    return next(errorHandler(500, "something went wrong . please try again"));
  }
}