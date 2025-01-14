import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import { refreshTokenDecoder } from "../utils/jwtTokens/decodeRefreshToken.js";

export const verifyUser = async (req,res,next)=>{
    const accessToken = req?.cookies?.userAccessToken;
    const refreshToken = req?.cookies?.userRefreshToken;
    if(accessToken)
    {
        try{
            const decode=jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
            const userId = decode.id;
            req.userId = userId
            next()
        }
        catch(error)
        {
            return next(errorHandler(401,"you are not authorized , token incorrect failed"))
        }

    }
    else{
        handleRefreshToken(req,res,next,refreshToken)
    }
}


const handleRefreshToken = async(req,res,next,refreshToken)=>{
    if(refreshToken)
    {
        try{
            const decodeRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const newAccessToken = jwt.sign({ id: decodeRefresh?.id }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "1m",
            });
            
            res.cookie("userAccessToken", newAccessToken, {
                httpOnly: true,                                                                          
                secure: false,
                sameSite: "strict",
                maxAge: 1 * 60 * 1000,
            });
            const userId = decodeRefresh.id
            req.userId = userId
            next();
        }
        catch(error)
        {
            return next(errorHandler(401,"you are not authorized , refresh token is invalid"))
        }
    }
    else
    {
       return next(errorHandler(401,"you are not logged in"))
    }
}