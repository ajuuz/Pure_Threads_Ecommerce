import mongoose from "mongoose";
import walletDB from "../../Models/walletSchema.js";
import { errorHandler } from "../../utils/error.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";

export const getWallet = async(req,res,next)=>{
        const  {transactionType} = req.query;
    try{
        
        const userId = refreshTokenDecoder(req);
        let filerCondition;
        if(transactionType==="all"){
           filerCondition={ $in: ["$$transaction.transactionType", ["Credit", "Debit"] ]}
        }
        else
        {
            filerCondition={ $eq: ["$$transaction.transactionType", transactionType] }
        }

        const wallet = await walletDB.aggregate([
            { $match: { userId:new mongoose.Types.ObjectId(userId) } },
            {
                $project: {
                    transactions: {
                        $filter: {
                            input: "$transactions",
                            as: "transaction",
                            cond: filerCondition
                        }
                    }
                }
            }
        ]);
        console.log(wallet)
        if(!wallet) return next(errorHandler(404,"wallet not found"))
        return res.status(200).json({success:true,message:"wallet fetched successfully",wallet:wallet[0]})
    }
    catch(error)
    {
        console.log(error.message)
        next(errorHandler(500,"something went wrong while fetching wallet"))
    }
}