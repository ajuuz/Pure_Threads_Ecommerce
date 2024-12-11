import addressDB from "../../Models/addressSchema.js";
import { errorHandler } from "../../utils/error.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";


export const addAddress =async(req,res,next)=>{
    const formData = req.body
    const id = refreshTokenDecoder(req)
    try{
        const newAddress = new addressDB({...formData,userId:id})
        await newAddress.save();
        return res.status(200).json({success:true,message:"new address added successfully"})
    }
    catch(error)
    {
        console.log(error.message)
        return next(errorHandler(500,"something went wrong during adding new address"))
    }
}

export const getAddresses = async(req,res,next)=>{
    try{
        const id = refreshTokenDecoder(req)
        const addresses = await addressDB.find({userId:id});
        if(!addresses) return next(errorHandler(404,"addresses not found"))
        return res.status(200).json({success:true,message:"addresses fetched successfully",addresses})
    }
    catch(error)
    {
        console.log(error.message)
        return next(errorHandler(500,"something went wrong please try again"))
    }
}

export const getAddress = async(req,res,next)=>{
    const addressId = req.params.id
    try{
        const address = await addressDB.findOne({_id:addressId})
        if(!address) return next(errorHandler(404,"address not found"))
        return res.status(200).json({success:true,message:"address fetched successfullly",address})
    }
    catch(error)
    {
        console.log(error.message)
        return next(errorHandler(500,"something went wrong please try again"))
    }
}

export const editAddress=async(req,res,next)=>{
    const addressId = req.params.id;
    const formData = req.body;
    try{
        const updateAddress = await addressDB.updateOne({_id:addressId},{$set:formData})
        if (updateAddress.nModified === 0) return res.status(400).json({ message: "No changes were made" });
        return res.status(200).json({success:"true",message:"address updated successfully"})

    }
    catch(error)
    {
        console.log(error.message)
        return next(errorHandler(500,"something went wrong please try again"))
    }
}

export const deleteAddress = async(req,res,next)=>{
    const addressId = req.params.id;
    try{
        const userId = refreshTokenDecoder(req)
        const address = await addressDB.findOne({_id:addressId})
        if(address.isDefault) return next(errorHandler(400,"you cannot delete the default address"))

        const deletedAddress = await addressDB.deleteOne({_id:addressId})
        if(deletedAddress.deletedCount === 0) return next(errorHandler(404,"address not found or already deleted"))
        
        const addresses = await addressDB.find({userId})
        
        return res.status(200).json({success:true,message:"address have been deleted address",addresses})
    }
    catch(error)
    {
        console.log(error.message)
        return next(errorHandler(500,"something went wrong please try again"))
    }
}

export const setDefaultAddress = async(req,res,next)=>{
    const addressId = req.params.id;
    try{
        const userId = refreshTokenDecoder(req)
        const updatedAddress = await addressDB.updateOne({_id:addressId},{ isDefault: true });
            if(!updatedAddress) return next(errorHandler(404,"address not found"))


        const addresses = await addressDB.find({userId});
        return res.status(200).json({success:true,message:"address set as default",addresses})
    }
    catch(error)
    {
        console.log(error.message)
        return next(errorHandler(500,"something went wrong please try again"))
    }
}