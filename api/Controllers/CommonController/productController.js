import productDB from "../../Models/productSchema.js";
import { errorHandler } from "../../utils/error.js";
import mongoose from "mongoose";

export const getProducts = async(req,res,next)=>{
    
    const sortCriteria = JSON.parse(req.query.sort);

    const {limit,currentPage,category,fit,sleeves,searchQuery,target} = req.query;
    console.log(target)
    try{
        const filter = {}
        const categoryFilter={}
        if(target==="user")
        {
            filter.isActive=true
            categoryFilter['categoryDetails.isActive']=true
        }

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
            {$match:categoryFilter},
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