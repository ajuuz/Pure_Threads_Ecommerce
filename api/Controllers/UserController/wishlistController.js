import wishlistDB from "../../Models/wishlistSchema.js";
import { errorHandler } from "../../utils/error.js";
import {refreshTokenDecoder} from '../../utils/jwtTokens/decodeRefreshToken.js'


export const addToWishlist=async(req,res,next)=>{
    const {productId} = req.params;
    const userId = refreshTokenDecoder(req);
    try{
        const addWishlistProduct = await wishlistDB.updateOne({userId},{$addToSet:{items:productId}},{upsert:true})
        if(addToWishlist.upsertCount===0 && addToWishlist.modifiedCount===0) return next(errorHandler(404,"wishlist not found"))
        return res.status(201).json({success:true,message:"product added to your wishlist"})
    }catch(error){
        return next(errorHandler(500,"something went wrong please try again"))
    }
}

export const getWishlistProducts =async (req,res,next)=>{
    const userId = refreshTokenDecoder(req);
    const onlyIdNeeded = req.query.onlyIdNeeded ==="true" ?true:false
    try{
        if(onlyIdNeeded)
            {
            const wishlist = await wishlistDB.findOne({userId})
            if(!wishlist) return next(errorHandler(404,"wishlist not found"))
            return res.status(200).json({success:true,message:"wishlist fetched successfully",wishlist});
        }
        else
        {
            const wishlist = await wishlistDB.findOne({userId}).populate('items')
            if(!wishlist) return next(errorHandler(404,"wishlist not found"))
            console.log(wishlist)
            return res.status(200).json({success:true,message:"wishlist fetched successfully",wishlist});   
        }
    }catch(error){
        return next(errorHandler(500,"something went wrong please try again"))
    }
}

export const removeFromWishlist = async(req,res,next)=>{
    const {productId} = req.params
    const userId = refreshTokenDecoder(req);
    try{
        const updatedWishlist = await wishlistDB.updateOne({userId},{$pull:{items:productId}});
        if(updatedWishlist.modifiedCount===0) return next(errorHandler(404,"wishlist not found"))
        return res.status(200).json({success:true,message:"product removed from your wishlist"});
    }catch(error){
        return next(errorHandler(500,"something went wrong please try again"))
    }
}

