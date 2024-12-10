import UsersDB from "../../Models/userSchema.js";
import { errorHandler } from "../../utils/error.js";
import jwt from "jsonwebtoken"
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";
export const getUserProfile = async(req,res,next)=>{
    try{
        const id = refreshTokenDecoder(req)
        const userDetails = await UsersDB.findOne({_id:id})
        if(!userDetails) return next(errorHandler(404,"user not found"));
        return res.status(200).json({success:true,message:"user details fetched successfully",userDetails:{name:userDetails.name,email:userDetails.email,phone:userDetails.phone??""}}) 
    }
    catch(error)
    {
        console.log(error.message);
        return next(errorHandler(500,"something went wrong please try again"));
    }
}

export const updateUserProfile = async(req,res,next)=>{
    const changedDatas=req.body;
    try{
        const id = refreshTokenDecoder(req)
        const updatedProfile = await UsersDB.updateOne({_id:id},{$set:changedDatas})
        if (updatedProfile.nModified === 0) return next(errorHandler(400,"No changes made"));
        return res.status(200).json({success:true,message:"user profile updated successfully"})
    }
    catch(error)
    {
        console.log(error.message);
        return next(errorHandler(500,"something went wrong please try again"));
    }
}