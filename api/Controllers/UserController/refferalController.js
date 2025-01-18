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
        const isRefferedUser=user.refferalDetails.isRefferedUser
        const friendName=user.refferalDetails.friendName
        return res.status(200).json({success:true,message:"refferal fetched successfully",refferalCode,isRefferedUser,friendName})
    }
    catch(error)
    {
        console.log(error.message)
        return next(errorHandler(500,"something went wrong please try again"))
    }
}

export const applyRefferal=async(req,res,next)=>{
    try{
        const userId=refreshTokenDecoder(req);
        const {refferalCode,currentUserRefferalCode} = req.body;

        const currentUser=await UsersDB.findOne({_id:userId})
        const userWithRefferalCode=await UsersDB.findOne({refferalCode});
        
        if(!userWithRefferalCode) return next(errorHandler(404,"Invalid Refferal Code"));

        if(userWithRefferalCode._id.toString()===userId){
            return next(errorHandler(400,"You cannot use your Refferal Code"))
        }

        if(userWithRefferalCode.refferalDetails?.isRefferedUser)
        {
            if(userWithRefferalCode?.refferalDetails?.friendId.toString()===currentUser?._id.toString()){
                return next(errorHandler(400,"You Cannot use the Refferal Code of your friend who reffered you"))
            }
        }
        const friendName=userWithRefferalCode.name;
        const friendId=userWithRefferalCode._id;
        const transcationDetails={
            description:`₹200 has been credited to your wallet as a reward for the referral offer`,
            transactionDate:new Date(),
            transactionType:"Credit",
            transactionStatus:"Success",
            amount:200
        }

        const wallet = await walletDB.findOne({userId})
        if(!wallet)
        {
            const newWallet = new walletDB({
                userId,
                balance:200,
                transactions:[transcationDetails]
            })
            await newWallet.save();
        }
        else
        {
            wallet.balance+=200;
            wallet.transactions.push(transcationDetails)
            await wallet.save()
        }
        
        await UsersDB.updateOne({_id:userId},{$set:{"refferalDetails.isRefferedUser":true,"refferalDetails.friendName":friendName,"refferalDetails.friendId":friendId}});
        return res.status(200).json({success:true,message:`${friendName}'s refferal matched.₹200 has been credited to your wallet as a reward for the referral offer`})
        
    }catch(error)
    {
        console.log(error.message)
        return next(errorHandler(500,"something went wrong please try again"))
    }
}