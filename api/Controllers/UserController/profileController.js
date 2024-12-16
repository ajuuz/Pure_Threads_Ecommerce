import UsersDB from "../../Models/userSchema.js";
import { errorHandler } from "../../utils/error.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";

import bcrypt from "bcryptjs"

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
        const userId = refreshTokenDecoder(req)
        const updatedProfile = await UsersDB.updateOne({_id:userId},{$set:changedDatas})
        if (updatedProfile.nModified === 0) return next(errorHandler(400,"No changes made"));
        return res.status(200).json({success:true,message:"user profile updated successfully"})
    }
    catch(error)
    {
        console.log(error.message);
        return next(errorHandler(500,"something went wrong please try again"));
    }
}

export const changePassword = async(req,res,next)=>{
    const {currentPassword,newPassword} = req.body
    console.log("working")
    try{
        const userId = refreshTokenDecoder(req);
        const user = await UsersDB.findOne({_id:userId})
        console.log(user)
        if(!user) return next(errorHandler(404,"user not found"));
        const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);
        if(!isPasswordCorrect) return next(errorHandler(400,"incorrect password"));

          // Validate the new password format
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) return next(errorHandler(400, "Password must include uppercase, lowercase, number, special character,and minimum 8 character."));
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        user.password=hashedPassword
        await user.save()
        return res.status(200).json({success:true,message:"password changed successfully"})
    }catch(error){
        console.log(error.message);
        return next(errorHandler(500,"something went wrong please try again"));
    }
}