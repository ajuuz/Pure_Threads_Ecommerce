import cartDB from "../../Models/cartSchema.js";
import productDB from "../../Models/productSchema.js";
import { errorHandler } from "../../utils/error.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";


export const selectSizeForProduct = async(req,res,next)=>{
    const {productId,sizeIndex} = req.body
    try{
        const productDetails = await productDB.findOne({_id:productId});
        if(productDetails?.size[sizeIndex]?.stock<1) return next(errorHandler(422,"Sorry, the selected size is currently out of stock"))//unprocessable entity
        return res.status(200).json({success:true,message:"size selected successfully"})
    }
    catch(error)
    {
        return next(errorHandler(500,"something went wrong"))
    }
}


export const addToCart = async(req,res,next)=>{
    const {productId,sizeIndex} = req.body
    if(!productId,!sizeIndex.toString()) return next(errorHandler(400,"required fields are not provided"))
    try{
        const userId = refreshTokenDecoder(req)
        if(!userId) return  next(errorHandler(401,"you are not logged in"));

        const productDetails = await productDB.findOne({_id:productId});
        if(!productDetails) return next(errorHandler(404,"product not found"))
        if(productDetails?.size[sizeIndex]?.stock<1) return next(errorHandler(422,"Sorry, the selected size is currently out of stock"))//unprocessable entity

        const  cart = await cartDB.findOne({userId})
        if(!cart)
        {
            const newCart = new cartDB({
                userId,
                items:[{
                    product:productId,
                    size:productDetails?.size[sizeIndex]?.size,
                    quantity:1
                }]
            })
            await newCart.save();
            return res.status(201).json({success:true,message:"Added to Cart"})
        }
        else
        {
            const existingProduct = cart?.items?.find((item)=>item?.product?.toString()===productId && item?.size===productDetails?.size[sizeIndex]?.size)
            if(existingProduct)
            {
                if(existingProduct.quantity<=5)
                {
                    const addQuantity = await cartDB.updateOne({userId,"items.product":productId,"items.size":productDetails?.size[sizeIndex]?.size},{$inc:{"items.$[item].quantity":1}},{arrayFilters:[{"item.product":productId,"item.size":productDetails?.size[sizeIndex]?.size}]})
                    if(!addQuantity.modifiedCount) return next(errorHandler(404,"product not found in the cart"))
                    return res.status(200).json({success:true,message:"one more added successfully to the cart"})
                }
            }
            else{
                const addNewProduct = await cartDB.updateOne({userId},{$push:{items:{product:productId,size:productDetails?.size[sizeIndex]?.size,quantity:1}}})
                if(!addNewProduct.modifiedCount) return next(errorHandler(404,"cart not found in the cart"));
                return res.status(200).json({success:"true",message:"Added to Cart"})
            }
        }
    }
    catch(error)
    {
        return next(errorHandler(500,"something went wrong please try again"))
    }
}


export const getCartProducts = async(req,res,next)=>{
    try{
        const userId=refreshTokenDecoder(req);
        const cartProducts = await cartDB.findOne({userId},{items:true,_id:false}).populate('items.product')
        if(!cartProducts) return next(errorHandler(404,"you havent added anything yet"))
            return res.status(200).json({success:true,message:"cart fetched successfully",cartProducts:cartProducts?.items})
    }
    catch(error)
    {
        return next(errorHandler(500,"something went wrong please try again"))
    }
}

export const updateCart = async(req,res,next)=>{
    const {productId,size,quantity} = req.body;

    if(quantity && quantity>0 && quantity<=5)
    {
        console.log(quantity)
        try{
            const userId = refreshTokenDecoder(req);
            const updatedCart = await cartDB.findOneAndUpdate({userId,"items.product":productId,"items.size":size},{$set:{"items.$[item].quantity":quantity}},{arrayFilters:[{"item.product":productId,"item.size":size}]}).populate('items.product')
            if(!updatedCart) return next(errorHandler(404,"no product has been updated"));
            console.log("working");
            return res.status(200).json({success:true,message:"updated successfully",updatedCart})

        }
        catch(error){
            console.log(error)
            return next(errorHandler(500,"something went wrong please try again"))

        }
    }
    else{
        try{
            const userId = refreshTokenDecoder(req);
            const updatedCart = await cartDB.updateOne({userId},{$pull:{items:{product:productId,size:size}}})
            if(!updatedCart) return next(errorHandler(404,"no product has been removed"));
            return res.status(200).json({success:true,message:"product removed successfully"})

        }
        catch(error){
            console.log(error)
            return next(errorHandler(500,"something went wrong please try again"))

        }
    }
}


export const proceedToCheckout = async(req,res,next)=>{
    try{
        const userId = refreshTokenDecoder(req);
        console.log("working")
        const cart = await cartDB.findOne({userId}).populate('items.product')

    }
    catch(error)
    {
        return next(errorHandler(500,"something went wrong please try again"))
    }
}
