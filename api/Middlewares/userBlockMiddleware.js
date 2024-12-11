import { errorHandler } from "../utils/error.js";
import UsersDB from "../Models/userSchema.js";
export const verifyUserBlocked = async(req,res,next)=>{
    try{
        const userId = req.userId;
        const validUser = await UsersDB.findOne({_id:userId,isActive:true});
        if(!validUser) 
            {
                res
                .clearCookie('userAccessToken')
                .clearCookie('userRefreshToken')
                return next(errorHandler(403,"you are blocked please contact admin"));
            }
        next();
    }
    catch(error)
    {
        return next(errorHandler(500,"something went wrong please try again"));
    }
}