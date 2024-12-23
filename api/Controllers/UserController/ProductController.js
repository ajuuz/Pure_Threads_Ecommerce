import mongoose from "mongoose";
import productDB from "../../Models/productSchema.js";
import { errorHandler } from "../../utils/error.js";

// export const getProducts=async(req,res,next)=>{
//     const sort = JSON.parse(req.query.sort);
//     try{
//         const activeProducts = await productDB.find({isActive:true}).sort(sort).populate('category')
//         console.log(activeProducts)
//         const products = activeProducts.filter((activeProduct)=>activeProduct?.category && activeProduct?.category?.isActive)
//         if(!products) return next(errorHandler(404,"products not found"))
//         return res.status(200).json({success:true,message:"products fetched successfully",products})
//     }
//     catch(error)
//     {
//         next(errorHandler(500,"something went wrong during fetching products"))
//     }
// }

export const getProducts = async(req,res,next)=>{
    const sortCriteria = JSON.parse(req.query.sort);
    const {limit,currentPage,category,fit,sleeves,searchQuery} = req.query;
    try{
        const filter = {isActive:true}
        if(category.length>0){
            filter.category={$in:category.split(',').map(id =>new mongoose.Types.ObjectId(id))}
        }
        if(fit.length>0){
            filter.fit={$in:fit.split(',')}
        }
        if(sleeves.length>0){
            filter.sleeves={$in:sleeves.split(',')}
        }
        if(searchQuery?.trim()){
            filter.name = {$regex:searchQuery,$options:'i'};
        }

        const totalDocuments  = await productDB.aggregate([
            {$match:filter},
            {
                $lookup: {
                    from: "categories", // The name of the categories collection
                    localField: "category", // Correct field name
                    foreignField: "_id", // Correct reference field in the categories collection
                    as: "categoryDetails", // Populated data alias
                }
            },
            { $unwind: "$categoryDetails" },
            {$match:{'categoryDetails.isActive':true}},
            {$sort:sortCriteria},
        ])

        const totalCount = totalDocuments.length
        const numberOfPages = Math.ceil(totalCount/limit);
        
        const products  = await productDB.aggregate([
            {$match:filter},
            {
                $lookup: {
                    from: "categories", // The name of the categories collection
                    localField: "category", // Correct field name
                    foreignField: "_id", // Correct reference field in the categories collection
                    as: "categoryDetails", // Populated data alias
                }
            },
            { $unwind: "$categoryDetails" },
            {$match:{'categoryDetails.isActive':true}},
            {$sort:sortCriteria},
            {$skip:(currentPage-1)*limit},
            {$limit:Number(limit)}
        ])
        res.json({success:true,message:"products fetched succesfully",products,numberOfPages})
    }

    catch(error)
    {
        console.log(error.message)
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