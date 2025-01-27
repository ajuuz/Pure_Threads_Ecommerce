import orderDB from "../../Models/orderSchema.js";
import { errorHandler } from "../../utils/error.js";
import {startOfDay,endOfDay,startOfWeek,endOfWeek,startOfMonth,endOfMonth,startOfYear,endOfYear} from 'date-fns';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs'

const dateRangeCalculator=(dateRange,from,to)=>{
    const today=new Date()
    let rangeStart,rangeEnd;
    switch(dateRange){
        case "today" :
            rangeStart=startOfDay(today)
            rangeEnd=endOfDay(today)
            break;
        
        case "week":
            rangeStart=startOfWeek(today)
            rangeEnd=endOfWeek(today)
            break;

        case "month":
            rangeStart=startOfMonth(today)
            rangeEnd=endOfMonth(today)
            break;

        case "year":
            rangeStart=startOfYear(today)
            rangeEnd=endOfYear(today)
            break;

        case "custom":
            const fromDate = new Date(from)
            const toDate = new Date(to)
            rangeStart= fromDate
            rangeEnd=toDate
            break;
        
        default:
            rangeStart=null;
            rangeEnd=null
            break;
    }
    return {rangeStart,rangeEnd}
}


const fetchSalesReportData=async(req,res,next,isLimit)=>{
    try{
        const {dateRange,from,to,currentPage,limit,sortCriteria} = req.query;
        const {rangeStart,rangeEnd} = dateRangeCalculator(dateRange,from,to);
        
        const sort = JSON.parse(sortCriteria)

        const skip = Number((currentPage-1)*limit);
        
        const matchFilter={paymentStatus:"Success"};
        if(rangeStart && rangeEnd) matchFilter.createdAt={$gte:rangeStart,$lte:rangeEnd}

        const ordersLimitFilter=[
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
        ]

        if(isLimit){
            ordersLimitFilter.unshift({ $limit: Number(limit) },)
            ordersLimitFilter.unshift({ $skip: skip });
        }

        const salesContent = await orderDB.aggregate([
            {$match:matchFilter},
            {$sort:sort},
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
                    orders:ordersLimitFilter,
                    totalAmount:[
                        {
                            $group: {
                            _id:null,
                            totalAmount:{$sum:"$totalAmount"},
                            totalCount:{$sum:1}
                            }
                        }
                    ],
                    bestSellingProducts: [
                        { $unwind: "$items" }, // Decompose the items array into individual documents
                        {
                            $lookup: {
                              from: "products",
                              localField: "items.product",
                              foreignField: "_id",
                              as: "productDetails"
                            }
                        },
                        { $unwind: "$productDetails" },
                        {
                          $group: {
                            _id: "$items.product", // Group by product ID
                            productName: { $first: "$productDetails.name" },
                            soldCount: { $sum: "$items.quantity" },
                          }
                        },
                        { $sort: { soldCount: -1 } }, // Sort by quantity sold (descending)
                        { $limit: 5 } // Get the top product
                      ],
                      bestSellingCategories: [
                        { $unwind: "$items" },
                        {
                            $lookup: {
                                from: "products",
                                localField: "items.product",
                                foreignField: "_id",
                                as: "productDetails"
                            }
                        },
                        { $unwind: "$productDetails" }, // Flatten the product details
                        {
                            $lookup: {
                                from: "categories", // Assuming your categories collection is named 'categories'
                                localField: "productDetails.category", // Link using the category ID
                                foreignField: "_id",
                                as: "categoryDetails"
                            }
                        },
                        { $unwind: "$categoryDetails" }, // Flatten the category details
                        {
                            $group: {
                                _id: "$productDetails.category", // Group by category ID
                                categoryName: { $first: "$categoryDetails.name" }, // Get the category name
                                soldCount: { $sum: 1 }, // Sum the quantity sold
                            }
                        },
                        { $sort: { soldCount: -1 } }, // Sort by total sales amount (descending)
                        { $limit: 5 } // Get the top category
                      ]
                }
            },
            {
                $project:{
                    couponStats:1,
                    orders:1,
                    totalSaleAmount:{$arrayElemAt:["$totalAmount.totalAmount",0]},
                    totalSaleCount:{$arrayElemAt:["$totalAmount.totalCount",0]},
                    bestSellingProducts:1,
                    bestSellingCategories:1
                }
            }
        ])
        return salesContent;
    }
    catch(error)
    {
        return next(errorHandler(500,"something went wrong during fetching sales report"))
    }
}

export const getSalesReport=async(req,res,next)=>{
    try{
        const {limit} = req.query
        // const {dateRange,from,to,currentPage,limit,sortCriteria} = req.query;
        // const {rangeStart,rangeEnd} = dateRangeCalculator(dateRange,from,to);
        
        // const sort = JSON.parse(sortCriteria)

        // const matchFilter={paymentStatus:"Success"};

        // const skip = Number((currentPage-1)*limit);
        // if(rangeStart && rangeEnd) matchFilter.createdAt={$gte:rangeStart,$lte:rangeEnd}
        // const salesContent = await orderDB.aggregate([
        //     {$match:matchFilter},
        //     {$sort:sort},
        //     {$lookup:{
        //         from:"users",
        //         localField:"userId",
        //         foreignField:"_id",
        //         as:"user"
        //         }
        //     },
        //     {
        //         $addFields:{
        //             itemsCount:{$size:"$items"}
        //         }
        //     },
        //     {
        //         $project:{
        //             deliveryAddress:0,
        //             updatedAt:0,
        //             items:0,
        //             userId:0
        //         }
        //     },
        //     {
        //         $facet: {
        //             couponStats: [
        //                 {
        //                     $group: {
        //                         _id: "$couponUsed.couponCode", // Group by coupon code
        //                         couponUsedCount: { $sum: 1 }, // Count usage of each coupon
        //                         totalCouponDiscount:{$sum:"$couponUsed.couponDiscount"}
        //                     }
        //                 },
        //                 {
        //                     $project: {
        //                         couponCode: "$_id", // Rename _id to couponCode
        //                         couponUsedCount: 1,
        //                         totalCouponDiscount: 1,
        //                         _id: 0 // Exclude the original _id
        //                     }
        //                 }
        //             ],
        //             orders: [
        //                 { $skip: skip }, // Apply skip for pagination
        //                 { $limit: Number(limit) }, // Apply limit for pagination
        //                 {
        //                     $project: {
        //                         _id: 1, // Retain the order ID
        //                         userId: 1,
        //                         status: 1,
        //                         totalAmount: 1,
        //                         paymentMethod: 1,
        //                         paymentStatus: 1,
        //                         couponUsed: 1,
        //                         orderId: 1,
        //                         deliveryDate: 1,
        //                         createdAt: 1,
        //                         user: 1,
        //                         itemsCount: 1
        //                     }
        //                 }
        //             ],
        //             totalAmount:[
        //                 {
        //                     $group: {
        //                     _id:null,
        //                     totalAmount:{$sum:"$totalAmount"},
        //                     totalCount:{$sum:1}
        //                     }
        //                 }
        //             ]
        //         }
        //     },
        //     {
        //         $project:{
        //             couponStats:1,
        //             orders:1,
        //             totalSaleAmount:{$arrayElemAt:["$totalAmount.totalAmount",0]},
        //             totalSaleCount:{$arrayElemAt:["$totalAmount.totalCount",0]},
        //         }
        //     }
        // ])
                   
        const salesContent= await fetchSalesReportData(req,res,next,true)
        if(salesContent.length===0) return next(errorHandler(404,"No orders found"))
        const numberOfPages=Math.ceil(salesContent[0]?.totalSaleCount/limit)

        return res.status(200).json({success:true,message:"sales report fetched successfully",salesReport:salesContent[0],numberOfPages})
        
    }
    catch(error)
    {
        next(errorHandler(500,"something went wrong during fetching sales report"))
    }
}



export const downloadSalesResportPdf=async(req, res,next) => {
    try {
        const {totalCouponDiscount}=req.query;
        const salesContent=await fetchSalesReportData(req,res,next,false)
        const orderDetails=salesContent[0]?.orders.map((order)=>{
            return {
                    orderId:order?.orderId,
                    orderDate:order?.createdAt,
                    itemsCount:order?.itemsCount,
                    usedCoupon:order?.couponUsed?.couponCode==="No Coupon Used"?"N/A":order?.couponUsed?.couponCode,
                    customer:order?.user[0]?.name,
                    amount:order?.totalAmount
                }
        })

      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, left: 40, right: 40, bottom: 50 },
      });
  
      // Set headers to download the file as PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="sales-report.pdf"');
  
      // Pipe the PDF document to the response
      doc.pipe(res);
  
    
  
      // Add Title
      doc.fontSize(20).font('Helvetica-Bold').text('Sales Report', { align: 'center' }).moveDown();
  
      // Add Date Range (Optional)
      const today = new Date().toLocaleDateString();
      doc.fontSize(12).text(`Report Date: ${today}`, { align: 'right' }).moveDown();
  
      // Add Table Header with Background
      doc.rect(20, doc.y, 550, 20).fillAndStroke('#000000', '#00000');
      doc
      .font('Helvetica-Bold')
        .fillColor('#ffffff')
        .fontSize(12)
        .text('Order ID', 55, doc.y + 5, { width: 200 })
        .text('order Date', 135, doc.y - 15 , { width: 70 })
        .text('Items Count', 210, doc.y - 14, { width: 100 })
        .text('Used Coupon', 300, doc.y - 14, { width: 100 })
        .text('Customer', 400, doc.y - 14, { width: 100 })
        .text('Amount', 500, doc.y - 14, { width: 100 })
      doc.moveDown();
  
      // Add Sales Data Rows with Alternating Colors
      let isAlternate = false;
      orderDetails.forEach((order) => {
        const rowColor = isAlternate ? '#f9f9f9' : '#fff';
        doc.rect(20, doc.y, 550, 30).fillAndStroke(rowColor, '#ddd');
        doc
        .font('Helvetica')
          .fillColor('#000')
          .fontSize(12)
          .text(order.orderId.slice(9), 40, doc.y + 9, { width: 200 })
          .text(order.orderDate.toLocaleDateString(), 140, doc.y - 12 , { width: 70 })
          .text(order.itemsCount, 240, doc.y - 14, { width: 100 })
          .text(order.usedCoupon, 330, doc.y - 14, { width: 100 })
          .text(order.customer, 405, doc.y - 14, { width: 100 })
          .text(order.amount, 500, doc.y - 14, { width: 100 })
        doc.moveDown();
        isAlternate = !isAlternate;
      });
  
      doc.rect(20, doc.y, 550, 90).fillAndStroke("f9f9f9", '#ddd');


      // Add Total Sales
      const totalAmount = salesContent[0].totalSaleAmount
      const totalSaleCount = salesContent[0].totalSaleCount
      doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .fillColor('#fff')
        .text(`Total Order Count : ${totalSaleCount}`, 50, doc.y + 10, { align: 'center' })
        .text(`Total Amount : Rs. ${totalAmount}`, 50, doc.y + 10, { align: 'center' })
        .text(`Total Discount : Rs. ${totalCouponDiscount}`, 50, doc.y + 10, { align: 'center' })
        .moveDown();
  
      // Add Footer
      doc
        .fontSize(10)
        .fillColor("#0000")
        .text('Thank you for your business!', 50, doc.y + 15, { align: 'center', baseline: 'bottom' });
  
      // Finalize the document
      doc.end();
    } catch (error) {
      res.status(500).send('Error generating PDF');
    }
  };


                             
export const downloadSalesReportExcel= async (req, res, next) => {
    try {
      const { totalCouponDiscount } = req.query;
      const salesContent = await fetchSalesReportData(req, res, next, false);
  
      const orderDetails = salesContent[0]?.orders.map((order) => {
        return {
          orderId: order?.orderId,
          orderDate: order?.createdAt,
          itemsCount: order?.itemsCount,
          usedCoupon: order?.couponUsed?.couponCode === "No Coupon Used" ? "N/A" : order?.couponUsed?.couponCode,
          customer: order?.user[0]?.name,
          amount: order?.totalAmount,
        };
      });
  
      const totalAmount = salesContent[0].totalSaleAmount;
      const totalSaleCount = salesContent[0].totalSaleCount;
  
      // Create a workbook and add a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sales Report');
  
      // Add title
      worksheet.mergeCells('A1', 'F1');
      worksheet.getCell('A1').value = 'Sales Report';
      worksheet.getCell('A1').font = { size: 16, bold: true };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };
  
      // Add headers
      const headers = ['Order ID', 'Order Date', 'Items Count', 'Used Coupon', 'Customer', 'Amount'];
      worksheet.addRow(headers).font = { bold: true };
  
      // Add rows
      orderDetails.forEach((order) => {
        worksheet.addRow([
          order.orderId,
          new Date(order.orderDate).toLocaleDateString(),
          order.itemsCount,
          order.usedCoupon,
          order.customer,
          order.amount,
        ]);
      });
  
      // Add summary at the bottom
      worksheet.addRow([]);
      worksheet.addRow([`Total Order Count: ${totalSaleCount}`, `Total Amount: Rs. ${totalAmount}`, `Total Discount: Rs. ${totalCouponDiscount}`]);
  
      // Set columns width
      worksheet.columns = [
        { key: 'orderId', width: 15 },
        { key: 'orderDate', width: 15 },
        { key: 'itemsCount', width: 15 },
        { key: 'usedCoupon', width: 20 },
        { key: 'customer', width: 20 },
        { key: 'amount', width: 15 },
      ];
  
      // Set response headers for file download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="sales-report.xlsx"');
  
      // Write workbook to response
      await workbook.xlsx.write(res);
  
      // End the response
      res.end();
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error generating Excel file');
    }
  };


export const getSalesChartData=async(req,res,next)=>{
    const {criteria,year} = req.query;
    let groupingId={};
    let projectFields={}
    let matchFilter={paymentStatus:"Success"}
    if (criteria === "month") {
        matchFilter.$expr={ 
            $eq: [{ $year: "$createdAt" }, Number(year)]  // Directly match the year 2025
          }
        groupingId = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
        projectFields={year:"$_id.year",label:"$_id.month",totalSaleAmount:"$totalSales",totalCount:"$totalCount",_id:0}
    } else if (criteria === "year") {
        groupingId = { year: { $year: "$createdAt" } };
        projectFields={label:"$_id.year",totalSaleAmount:"$totalSales",totalCount:"$totalCount",_id:0}
    }
    else if(criteria==="week")
        {
            matchFilter.$expr={ 
                $eq: [{ $year: "$createdAt" }, Number(year)]  // Directly match the year 2025
              }
            groupingId = { year: { $year: "$createdAt" }, week: { $week: "$createdAt" } };
            projectFields={year:"$_id.year",label:"$_id.week",totalSaleAmount:"$totalSales",totalCount:"$totalCount",_id:0}
    }
    try{
        const chartData=await orderDB.aggregate(
          [
                {
                 $match:matchFilter
                },
                {
                 $group:{
                     _id:groupingId,
                     totalSales: { $sum: "$totalAmount" },
                     totalCount:{$sum:1}
                 }
                },
                {
                    $project:projectFields
                }
                
          ]
        )
        if(chartData.length===0) return next(errorHandler(400,"no orders found"))
        return res.status(200).json({success:true,message:"data fetched succesfully",chartData})
    }
    catch(error)
    {
        next(errorHandler(500,"something went wrong during fetching sales report chart"))
    }
}