import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import { error } from "console";

export const  verifyAdmin = async(req,res,next)=>{

    const accessToken = req.cookies.adminAccessToken;
    const refreshToken = req.cookies.adminRefreshToken;
    if(accessToken)
    {
        try{
             jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
             next();
        }
        catch(error)
        {
            return next(errorHandler(401,"you are not authorized , token verification failed"))
        }
    }
    else
    {
        handleRefreshToken(refreshToken,req,res,next)
    }
}

const handleRefreshToken=async (refreshToken,req,res,next)=>{
    if(refreshToken)
    {
        try{
            const decodeRefresh = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
            const newAccessToken = jwt.sign({id:decodeRefresh.id},process.env.ACCESS_TOKEN_SECRET,{
                expiresIn:"1m"
            })
            res.cookie("adminAccessToken",newAccessToken,{
                httpOnly: true,                                                                          
                secure: false,
                sameSite: "strict",
                maxAge: 1 * 60 * 1000,
            })
            next();
        }
        catch(error)
        {
            return next(errorHandler(401,"you are not authorized , refresh token is invalid"))
        }
    }
    else
    {
        res.status(401).json({ message: "No access token and no refresh token provided" });
    }
}