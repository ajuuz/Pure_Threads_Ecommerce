import mongoose from "mongoose";
import walletDB from "../../Models/walletSchema.js";
import { errorHandler } from "../../utils/error.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";

export const getWallet = async(req,res,next)=>{
        const  {transactionType,limit,currentPage} = req.query;
        
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

        const skip = (currentPage-1)*limit;

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
                    },
                    balance:1
                }
            },
            {
                $addFields: {
                    transactionCount: { $size: "$transactions" },
                    transactions:{$slice:["$transactions",skip,Number(limit)]}
                }
            },
        ]);

        const numberOfPages = Math.ceil(wallet[0].transactionCount/limit)
        wallet[0].numberOfPages=numberOfPages
        if(!wallet) return next(errorHandler(404,"wallet not found"))
        return res.status(200).json({success:true,message:"wallet fetched successfully",wallet:wallet[0]})
    }
    catch(error)
    {
        next(errorHandler(500,"something went wrong while fetching wallet"))
    }
}

export const addMoneyToWallet = async(req,res,next)=>{
    const {amount,description} = req.body;
    try{
        const userId = refreshTokenDecoder(req);
        const transcationDetails={
            description,
            transactionDate:new Date(),
            transactionType:"Credit",
            transactionStatus:"Success",
            amount
        }
        const walletUpdate = await walletDB.updateOne({userId},{
            $push:{transactions:transcationDetails},
            $inc:{balance:amount}
            })
        if(walletUpdate.modifiedCount===0) return next(errorHandler(404,"wallet not found"))
        return res.status(200).json({success:true,message:"Money added to wallet successfully"})
    }
    catch(error)
    {
        return next(errorHandler(500,"something went wrong during adding money to wallet"));
    }
}

