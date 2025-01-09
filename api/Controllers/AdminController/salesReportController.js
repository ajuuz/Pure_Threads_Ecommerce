import orderDB from "../../Models/orderSchema.js";
import { errorHandler } from "../../utils/error.js";

const getSalesReportHelperFunction = async (skip = 0, limit = 0, startDate, endDate, period) => {
    let dateSelection = {};
    const currentDate = new Date();

    // Build dateSelection query
    if (period === "custom" && startDate && endDate) {
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        const end = new Date(endDate).setHours(23, 59, 59, 999);
        dateSelection = {
            placed_at: { $gte: new Date(start), $lte: new Date(end) },
            "order_items.order_status": { $ne: "cancelled" },
        };
    } else {
        switch (period) {
            case "daily":
                currentDate.setHours(0, 0, 0);
                dateSelection = {
                    placed_at: {
                        $gte: currentDate,
                        $lt: new Date(),
                    },
                    "order_items.order_status": {
                        $nin: ["cancelled", "returned"]
                    }
                }
                break;
            case "weekly":
                dateSelection = {
                    placed_at: {
                        $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)),
                        $lt: new Date(),
                    },
                    "order_items.order_status": {
                        $nin: ["cancelled", "returned"]
                    }
                }
                break;
            case "monthly":
                dateSelection = {
                    placed_at: {
                        $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 1)),
                        $lt: new Date(),
                    },
                    "order_items.order_status": {
                        $nin: ["cancelled", "returned"]
                    }
                }
                break;
            case "yearly":
                dateSelection = {
                    placed_at: {
                        $gte: new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)),
                        $lt: new Date(),
                    },
                    "order_items.order_status": {
                        $nin: ["cancelled", "returned"]
                    }
                }
                break;
            default:
                break;
        }
    }

    // Return both query and results
    const salesReport = await Order.find(dateSelection)
        .populate('userId')
        .populate('order_items.product')
        .skip(skip)
        .limit(limit);
    
    return { salesReport, dateSelection };
};

const dateRangeCalculator=(dateRange)=>{
    const  rangeStart=new Date()
    const  rangeEnd=new Date();

    if(dateRange==="all"){
        console.log("working")
        rangeStart.setHours(0,0,0,0)
        rangeEnd.setHours(23,59,59,59)
    }
    else if(dateRange==="month"){
        rangeStart.setDate(1);
        rangeStart.setHours(0,0,0,0);

        rangeEnd.setMonth(rangeEnd.getMonth()+1)
        rangeEnd.setDate(1);
        rangeEnd.setHours(0,0,0,0);
        rangeEnd.setMilliseconds(rangeEnd.getMilliseconds()-1)
    }
    return {rangeStart,rangeEnd}
}

export const getSalesReport=async(req,res,next)=>{
    try{
        const {dateRange,from,to} = req.query;
       
        const {rangeStart,rangeEnd} = dateRangeCalculator(dateRange);
        const orders = await orderDB.aggregate([
            {$match:{paymentStatus:"Success",createdAt:{$gte:rangeStart,$lte:rangeEnd}}},
            {$lookup:{
                from:"users",
                localField:"userId",
                foreignField:"_id",
                as:"user"
                }
            },
            {
                $addFields:{
                    itemsCount:{$size:"$items"}
                }
            },
            {
                $project:{
                    deliveryAddress:0,
                    updatedAt:0,
                    items:0,
                    userId:0
                }
            },
            {
                $facet: {
                    couponStats: [
                        {
                            $group: {
                                _id: "$couponUsed.couponCode", // Group by coupon code
                                couponUsedCount: { $sum: 1 }, // Count usage of each coupon
                                totalCouponDiscount:{$sum:"$couponUsed.couponDiscount"}
                            }
                        },
                        {
                            $project: {
                                couponCode: "$_id", // Rename _id to couponCode
                                couponUsedCount: 1,
                                totalCouponDiscount: 1,
                                _id: 0 // Exclude the original _id
                            }
                        }
                    ],
                    orders: [
                        {
                            $project: {
                                _id: 1, // Retain the order ID
                                userId: 1,
                                status: 1,
                                totalAmount: 1,
                                paymentMethod: 1,
                                paymentStatus: 1,
                                couponUsed: 1,
                                orderId: 1,
                                deliveryDate: 1,
                                createdAt: 1,
                                user: 1,
                                itemsCount: 1
                            }
                        }
                    ],
                    totalAmount:[
                        {
                            $group: {
                            _id:null,
                            totalAmount:{$sum:"$totalAmount"},
                            totalCount:{$sum:1}
                            }
                        }
                    ]
                }
            },
            {
                $project:{
                    couponStats:1,
                    orders:1,
                    totalSaleAmount:{$arrayElemAt:["$totalAmount.totalAmount",0]},
                    totalSaleCount:{$arrayElemAt:["$totalAmount.totalCount",0]}
                }
            }
        ])
        console.log(orders)
        if(orders.length===0) return next(errorHandler(404,"No orders found"))
        return res.status(200).json({success:true,message:"sales report fetched successfully",salesReport:orders[0]})
        const skip = (page-1)*limit;

        const {salesReport ,dateSelection } = await getSalesReportHelperFunction(skip,limit,startDate,endDate,period);

        // Fetch additional metrics
        const totalReportCount = await orderDB.countDocuments(dateSelection);
        const totalPage = Math.ceil(totalReportCount / limit);
        const report = await orderDB.find(dateSelection);

        const totalSalesCount = report.length;
        return res.status(200).json({success:true,message:"sales report fetched successfully",salesReport:{salesReport,totalSalesCount}})
    }
    catch(error)
    {
        console.log(error.message)
        next(errorHandler(500,"something went wrong during fetching sales report"))
    }
}