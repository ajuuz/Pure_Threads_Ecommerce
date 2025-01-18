import UsersDB from "../../Models/userSchema.js";
import { errorHandler } from "../../utils/error.js";

export const getUserStatus=async(req,res,next)=>{
    try{
        const userStaus=await UsersDB.aggregate([
            {
                $facet:
                {
                    blockedUser:[
                        {$match:{isActive:false}},
                        {$count:"blockedUserCount"}
                    ],
                    unBlockedUser:[
                        {$match:{isActive:true}},
                        {$count:"unBlockedUserCount"}
                    ],
                }
            },
            {
                $project:{
                    blockedUser:{$arrayElemAt:["$blockedUser.blockedUserCount",0]},
                    unBlockedUser:{$arrayElemAt:["$unBlockedUser.unBlockedUserCount",0]},
                }
            }
        ])
        if(userStaus.length===0) return next(errorHandler(400,"No User Found"));
        return res.status(200).json({success:true,message:"userStatus fetched successfully",userStatus:userStaus[0]})
    }
    catch(error)
    {
        return next(errorHandler(500,"something went wrong during userStatus fetching"))
    }
}