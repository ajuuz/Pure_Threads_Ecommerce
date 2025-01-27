import mongoose from "mongoose";
import UsersDB from "../../Models/userSchema.js";
import walletDB from "../../Models/walletSchema.js";
import { errorHandler } from "../../utils/error.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";

export const getRefferalCode=async(req,res,next)=>{
    try{
        const userId = refreshTokenDecoder(req)
        const user=await UsersDB.findOne({_id:userId},{_id:0});
        if(!user) return next(errorHandler(404,"User not found"));
        const refferalCode=user.refferalCode
        return res.status(200).json({success:true,message:"refferal fetched successfully",refferalCode})
    }
    catch(error)
    {
        return next(errorHandler(500,"something went wrong please try again"))
    }
}

export const applyRefferal=async(req,res,next)=>{
    try{
        const userId=refreshTokenDecoder(req);
        const {refferalCode} = req.body;

        const friend=await UsersDB.findOne({refferalCode});
        
        if(!friend) return next(errorHandler(404,"Invalid Refferal Code"));

        if(friend._id.toString()===userId){
            return next(errorHandler(400,"You cannot use your Refferal Code"))
        }

        const friendName=friend.name;
        const friendId=friend._id;

        const transcationDetailsCreator=(description)=>{
         return {
                description:description,
                transactionDate:new Date(),
                transactionType:"Credit",
                transactionStatus:"Success",
                amount:200
            }
        }
        await Promise.all([
            walletDB.updateOne({userId},{$inc:{balance:200},$push:{transactions:transcationDetailsCreator(`₹200 has been credited to your wallet as a reward for the referral offer`)}}),
            walletDB.updateOne({userId:friendId},{$inc:{balance:200},$push:{transactions:transcationDetailsCreator(`₹200 has been credited to your wallet as a you referred ${friendName}`)}}),
            UsersDB.updateOne({_id:userId},{$set:{isFirstLogin:false}})
        ])

        return res.status(200).json({success:true,message:`₹200 has been credited to your wallet as a reward for the referral offer`})

    }catch(error)
    {
        return next(errorHandler(500,"something went wrong please try again"))
    }
}


export const changeFirstLoginStatus=async(req,res,next)=>{
    try{
        const userId=refreshTokenDecoder(req)
        await UsersDB.updateOne({_id:userId},{$set:{isFirstLogin:false}})
        return res.status(200).json({success:true})
    }
    catch(error)
    {
        return next(errorHandler(500,"something went wrong please try again"))
    }
}