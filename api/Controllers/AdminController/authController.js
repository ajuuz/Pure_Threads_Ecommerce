import AdminDB from "../../Models/adminSchema.js";
import { errorHandler } from "../../utils/error.js";
import { generateAdminAccessToken } from "../../utils/jwtTokens/accessToken.js";
import { generateAdminRefreshToken } from "../../utils/jwtTokens/refreshToken.js";


export const adminLogin=async(req,res,next)=>{
    const {email,password} = req.body;
    try{
        const adminExist=await AdminDB.findOne({email})
        if(!adminExist) return next(errorHandler(404,`you are not the admin`))
        if(password!=adminExist.password) return next(errorHandler(404,`you are not the admin`))
            generateAdminAccessToken(res,adminExist)
            generateAdminRefreshToken(res,adminExist)
            return res.status(200).json({success:true,message:"admin logged in successfully",adminName:"Admin"})
    }
    catch(error){
        next(errorHandler(500,"something went wrong please try again"));
    }
}


export const logout = async(req,res,next)=>{
    try{
      res
      .clearCookie('adminAccessToken')
      .clearCookie('adminRefreshToken')
      .status(200).json({message:"admin Logged out successfully"});
    }
    catch(error)
    {
      return next(errorHandler(500,"something went wrong please try again"));
    }
  }