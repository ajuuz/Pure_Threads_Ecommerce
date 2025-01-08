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



export const getSalesReport=async(req,res,next)=>{
    try{
        console.log(req.query)
        return
        const {startDate=null,endDate=null,period="daily",page=1,limit=5}= req.query;
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
        next(errorHandler(500,"something went wrong during fetching sales report"))
    }
}