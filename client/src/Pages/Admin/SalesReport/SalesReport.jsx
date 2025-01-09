import React, { useEffect, useState } from 'react'

//icons
import { Calendar, Lock } from 'lucide-react'

//toaster
import { toast } from 'sonner'

//component
import { Button } from '@/components/ui/button'
import SideBar from '@/components/AdminComponent/SideBar'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


//apis
import { getSalesReport } from '@/api/Admin/salesReportApi'
import { Input } from '@/components/ui/input'

import { dateFormatter } from '@/Utils/dateFormatter/dateFormatter'
import TableComponent from '@/components/AdminComponent/Table/TableCompnent'

const SalesReport = () => {
  let [dateRange, setDateRange] = useState('')
  const [customDateRage,setCustomDateRange] = useState({
    from:"",
    to:""
  })
  const [totalSaleCount,setTotalSaleCount] = useState(0);
  const [totalSaleAmount,setTotalAmount] = useState(0)
  const [totalCouponDiscount,setTotalCouponDiscount] = useState(0)
  const [couponStats,setCouponStats] = useState([])
  const [orders,setOrders] = useState([])
  
  useEffect(()=>{
    const handleGenerateReport=async()=>{
      if(!dateRange) dateRange="all"
      const from = customDateRage.from ? customDateRage.from : null;
      const to = customDateRage.to ? customDateRage.from : null;
      try{
        const getSalesReportResult = await getSalesReport(dateRange,from,to);
        const salesReport=getSalesReportResult?.salesReport
        console.log(salesReport?.couponStats)
        setTotalSaleCount(salesReport?.totalSaleCount) 

        setTotalAmount(salesReport?.totalSaleAmount)
        setCouponStats(salesReport?.couponStats.filter((coupon)=>coupon?.couponCode!="No Coupon Used"))

        const totalCouponDiscount = salesReport?.couponStats.reduce((acc,curr)=>acc+=curr?.totalCouponDiscount,0)
        setTotalCouponDiscount(totalCouponDiscount)

        const transformedOrders=salesReport?.orders.map((order)=>{
          return [order?.orderId,[
            {name:"OrderId",value:<span className='text-muted-foreground'>{order?.orderId}</span>},
            {name:"Order Date",value:<span className='font-semibold'>{dateFormatter(order?.createdAt)}</span>},
            {name:"Items Count",value:<span className='font-semibold'>{order?.itemsCount}</span>},
            {name:"Used Coupon",value:<span className='font-semibold'>{order?.couponUsed?.couponCode}</span>},
            {name:"Customer Name",value:<span className='font-semibold'>{order?.user[0]?.name}</span>},
            {name:"Amount",value:<span className='font-semibold'>₹ {order?.totalAmount}</span>}
            ]]
        })
        setOrders(transformedOrders)

      }catch(error)
      {
        toast.error(error.message)
      }
    }
    handleGenerateReport()
  },[])

  const percentageCalculator=(couponUsedCount,couponStats)=>{
    const totalCoupons = couponStats.reduce((acc,curr)=>acc+=curr?.couponUsedCount,0)
    const percentage=((couponUsedCount/totalCoupons)*100).toFixed(2)
    return percentage
  }
  const randomColorPicker=()=>{
    const hexValue=`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
    return hexValue
  }

  const headers=["Order ID","Order Date","Items Count","Used Coupon","Customer Name","Amount"]
  return (
    <div className="AdminProduct relative ps-5 md:ps-[300px] pe-5 pt-16">
      <SideBar />
        <div className="p-6 max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Sales Report</h1>
            <div className="space-x-4 flex">
              <Button  className="m-0" variant="outline">
                Download PDF
              </Button>
              <Button  className="m-0">
                Download Excel
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Filter By</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">From</label>
                  <div className="relative">
                    <Input
                      type="date"
                      disabled={dateRange!=="custom"}
                      onChange={(e)=>setCustomDateRange((prev)=>({...prev,from:e.target.value}))}
                      className={`${dateRange!=="custom" && "bg-slate-100"} w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
                    />
                    {dateRange!=="custom" &&
                    <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground"/>
                    }
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">To</label>
                  <div className="relative">
                    <Input
                      type="date"
                      disabled={dateRange!=="custom"}
                      onChange={(e)=>setCustomDateRange((prev)=>({...prev,to:e.target.value}))}
                      className={`${dateRange!=="custom" && "bg-slate-300"} w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
                    />
                    {dateRange!=="custom" &&
                    <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground"/>
                    }
                  </div>
                </div>
                <div className="flex items-end">
                  <Button onClick={()=>handleGenerateReport()} className="w-full" size="lg">
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
                  
          <div className="grid grid-cols-4 gap-6 text-center">
            <Card className="col-span-2 transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Sales Count</CardTitle>
                <p className="text-3xl font-bold">{totalSaleCount}</p>
              </CardHeader>
            </Card>
            <Card className="col-span-2 transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Order Amount</CardTitle>
                <p className="text-3xl font-bold">₹{totalSaleAmount?.toFixed(2)}</p>
              </CardHeader>
            </Card>
            
            <Card className="col-span-4 transition-all hover:shadow-lg">
              <CardHeader>
              <CardHeader className="pt-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Discount</CardTitle>
                <p className="text-3xl font-bold">₹{totalCouponDiscount?.toFixed(2)}</p>
              </CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Coupon Usage</CardTitle>
                <div className='w-full h-5 rounded-lg flex'>
                {couponStats.map((coupon,index)=>
                                      <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger
                                        style={{width:`${percentageCalculator(coupon?.couponUsedCount,couponStats)}%`,
                                        backgroundColor:randomColorPicker()
                                            }}  
                                        className={`w-8 flex  items-center justify-center text-[10px] font-semibold font-mono text-white ${index===0 && "rounded-s"} ${index===couponStats.length-1 && "rounded-e"} hover:scale-105  transition-all 0.5s cursor-pointer`}
                                        >
                                            {coupon?.couponCode}
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <div>
                                            <p  className='font-bold font-mono'>coupon Code:{coupon?.couponCode}</p>
                                            <p  className='font-bold font-mono'>Percentage:{percentageCalculator(coupon?.couponUsedCount,couponStats)} %</p>
                                            <p  className='font-bold font-mono'>Used Count:{coupon?.couponUsedCount} out of {couponStats.reduce((acc,curr)=>acc+=curr?.couponUsedCount,0)}</p>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    
              )}
                </div>
              </CardHeader>
            </Card>
                
          </div>
                  
          
              
              <TableComponent body={orders} headers={headers}/>
      </div>
    </div>
  )
}

export default SalesReport
