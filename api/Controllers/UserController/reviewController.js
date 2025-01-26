import reviewDB from "../../Models/reviewSchema.js";
import { errorHandler } from "../../utils/error.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";

export const addReview=async(req,res,next)=>{
    try{
        const userId = refreshTokenDecoder(req);
        const data=req.body
        console.log(data)
        const newReview=new reviewDB({...data,userId})
        await newReview.save()
        return res.status(201).json({success:true,message:"Review Added Successfully"})
    }catch(error){
        return next(errorHandler(500,"something went wrong during adding review"))
    }
}

export const getReviews=async(req,res,next)=>{
    const {productId}=req.params;
    const {currentPage,limit}=req.query;
    const skip = (currentPage-1)*limit
    const filter={productId}
    const userId=refreshTokenDecoder(req)
    try{
       const reviews= await Promise.all(
            [
                reviewDB.countDocuments(filter),
                reviewDB.find(filter).skip(skip).limit(limit).populate('userId','name')
            ]
        )
        const numberOfPages=Math.ceil(reviews[0]/limit)
        console.log(numberOfPages)
        return res.status(200).json({success:true,message:'reviews fetched succesfully',reviews:reviews[1],numberOfPages,userId});
    }catch(error)
    {
        return next(errorHandler(500,"something went wrong during getting review"))
    }
}

export const voteReview=async(req,res,next)=>{
        const {status}=req.body;
        const {reviewId} = req.params;
        const userId=refreshTokenDecoder(req);
    try{
        if(status==="helpful"){
           await reviewDB.updateOne({_id:reviewId},{$addToSet:{helpfulUsers:userId}})
        }
        else{
            await reviewDB.updateOne({_id:reviewId},{$pull:{helpfulUsers:userId}});
        }
        return res.status(200).json({success:true,message:'voted Successfully'});
    }catch(error)
    {
        console.log(error.message)
        return next(errorHandler(500,"something went wrong during voting review"))
    } 
}