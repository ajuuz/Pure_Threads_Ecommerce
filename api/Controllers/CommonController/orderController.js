import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";
import orderDB from "../../Models/orderSchema.js";
import { errorHandler } from "../../utils/error.js";
import mongoose from "mongoose";


export const getAllOrders = async(req,res,next)=>{
    try{
        const userId=new mongoose.Types.ObjectId(refreshTokenDecoder(req))
        
        const {target,currentPage,limit} = req.query;
        const sortCriteria = JSON.parse(req.query.sortCriteria)
        
        const skip=(currentPage-1)*limit;

        const matchFilter={};
        if(target==="user") matchFilter.userId=userId;

    const orders = await orderDB.aggregate([
        
    { $match: matchFilter },
    // Unwind the items array to deconstruct each item into its own document
    { $unwind: "$items" },

    // Lookup to populate the product field in items
    {
        $lookup: {
            from: "products", // The collection name of products
            localField: "items.product", // The field in the items array
            foreignField: "_id", // The field in the products collection
            as: "items.productDetails", // The alias for the joined documents
        },
    },

    // Group back into orders, re-nesting the items array
    {
        $group: {
            _id: "$_id", // Group by the order's ID
            orderId: { $first: "$orderId" },
            userId: { $first: "$userId" },
            deliveryAddress: { $first: "$deliveryAddress" },
            status: { $first: "$status" },
            deliveryDate:{$first:"$deliveryDate"},
            paymentMethod:{$first:"$paymentMethod"},
            paymentStatus:{$first:"$paymentStatus"},
            couponUsed:{$first:"$couponUsed"},
            totalAmount: { $first: "$totalAmount" },
            createdAt: { $first: "$createdAt" },
            items: {
                $push: {
                    product: "$items.product",
                    productDetails: { $arrayElemAt: ["$items.productDetails", 0] }, // Extract first product match
                    productPrice: "$items.productPrice",
                    quantity: "$items.quantity",
                    size: "$items.size",
                },
            },
        },
    },
    {$sort:sortCriteria},
    {
        $facet:{
            orders:[
                {$skip:skip},
                {$limit:Number(limit)}
            ],
            totalCount:[{$count:"count"}]
        }
    },
    {
        $project:{
            orders:"$orders",
            totalCount:{$arrayElemAt:["$totalCount.count",0]}
        }
    }
    
    ])
    const totalOrders=orders[0].totalCount;
    const numberOfPages=Math.ceil(totalOrders/limit)

    if(orders.length===0) return next(errorHandler(404,"order not found"));
    return res.status(200).json({success:true,message:"orders fetched successfully",orders:orders[0]?.orders,numberOfPages})
    }catch(error){
        console.log(error.message)
        return next(errorHandler(500,"something went wrong please try again"))
    }
}