import productDB from "../../Models/productSchema.js";
import { errorHandler } from "../../utils/error.js";

export const getProducts=async(req,res,next)=>{
    const sort = JSON.parse(req.query.sort);
    try{
        const activeProducts = await productDB.find({isActive:true}).sort(sort).populate('category')
        console.log(activeProducts)
        const products = activeProducts.filter((activeProduct)=>activeProduct?.category && activeProduct?.category?.isActive)
        if(!products) return next(errorHandler(404,"products not found"))
        return res.status(200).json({success:true,message:"products fetched successfully",products})
    }
    catch(error)
    {
        next(errorHandler(500,"something went wrong during fetching products"))
    }
}



export const getParticularProduct = async(req,res,next)=>{
    const id = req.params.id;
    try{
        const product = await productDB.findOne({_id:id})
        if(!product) return next(errorHandler(404,"product not found"))
        return res.status(200).json({success:true,message:"product fetched successfully",product})
    }
    catch(error)
    {
        console.log(error)
        next(errorHandler(500,"something went wrong during gettting products"))
    }
}

export const getRelatedProduct = async(req,res,next)=>{
    const catId = req.params.catId;
    try{
        const products = await productDB.find({category:catId})
        if(!products) return next(errorHandler(404,"product not found"))
        return res.status(200).json({success:true,message:"related products fetched successfully",products})
    }
    catch(error)
    {
        console.log(error)
        next(errorHandler(500,"something went wrong during gettting related products"))
    }
}