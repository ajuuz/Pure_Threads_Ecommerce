import walletDB from "../../Models/walletSchema.js";
import { errorHandler } from "../../utils/error.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";

export const getWallet = async(req,res,next)=>{
    try{
        const userId = refreshTokenDecoder(req);
        const wallet = await walletDB.findOne({userId});
        if(!wallet) return next(errorHandler(404,"wallet not found"))
        return res.status(200).json({success:true,message:"wallet fetched successfully",wallet})
    }
    catch(error)
    {
        next(errorHandler(500,"something went wrong while fetching wallet"))
    }
}