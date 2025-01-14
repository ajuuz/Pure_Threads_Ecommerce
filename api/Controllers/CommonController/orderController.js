import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";
import orderDB from "../../Models/orderSchema.js";
import { errorHandler } from "../../utils/error.js";
import mongoose from "mongoose";


export const getAllOrders = async(req,res,next)=>{
    try{
        const {target,currentPage,limit,tab} = req.query;

        const sortCriteria = JSON.parse(req.query.sortCriteria)
        const skip=(currentPage-1)*limit;

        const matchFilter={};

        let userId;
        let paymentStatus={$ne:"Failed"}
        let totalNotSuccessfulOrderCount;
        if(target==="user"){
            userId=new mongoose.Types.ObjectId(req.userId)
            matchFilter.userId=userId;
            totalNotSuccessfulOrderCount=[{$match:{paymentStatus:"Failed"}},{$count:"count"}]
            if(tab==="failedOrders") paymentStatus="Failed"
        }
        else
        {
            totalNotSuccessfulOrderCount=[{$match:{status:"Return Requested"}},{$count:"count"}]
            if(tab==="returnOrders") matchFilter.status="Return Requested"
            else matchFilter.status={$ne:"Return Requested"}
        }
        


    const orders = await orderDB.aggregate([
    { $match: matchFilter },
    {$lookup:{
        from:"users",
        localField:"userId",
        foreignField:"_id",
        as:"user"
        }
    },
    // Unwind the items array to deconstruct each item into its own document
    { $unwind: "$items" },

        //populating the product field
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
            user:{$first:"$user"},
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
                {$match:{paymentStatus:paymentStatus}},
                {$skip:skip},
                {$limit:Number(limit)}
            ],
            totalCount:[
                {$match:{paymentStatus:paymentStatus}},
                {$count:"count"}
            ],
            totalNotSuccessfulOrderCount
        }
    },
    {
        $project:{
            orders:"$orders",
            totalCount:{$arrayElemAt:["$totalCount.count",0]},
            totalNotSuccessfulOrderCount:{$arrayElemAt:["$totalNotSuccessfulOrderCount.count",0]},
        }
    }
    ])
    console.log(orders)
    const totalOrders=orders[0].totalCount;
    const numberOfPages=Math.ceil(totalOrders/limit)
    if(orders.length===0) return next(errorHandler(404,"order not found"));
    return res.status(200).json({success:true,message:"orders fetched successfully",orders:orders[0]?.orders,numberOfPages,failedOrders:orders[0]?.failedOrders})
    }catch(error){
        console.log(error.message)
        return next(errorHandler(500,"something went wrong please try again"))
    }
} 