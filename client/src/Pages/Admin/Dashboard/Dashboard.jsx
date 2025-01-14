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
import { downloadSalesReportExcel, downloadSalesReportPdf, getSalesReport } from '@/api/Admin/salesReportApi'
import { Input } from '@/components/ui/input'

import { dateFormatter } from '@/Utils/dateFormatter/dateFormatter'
import TableComponent from '@/components/AdminComponent/Table/TableCompnent'
import PaginationComponent from '@/components/CommonComponent/PaginationComponent'
import SalesChart from '@/components/AdminComponent/SalesChart/SalesChart'

const Dashboard = () => {
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

  const [sort,setSort]= useState({createdAt:-1})

  const [currentPage,setCurrentPage] = useState(1)
  const [numberOfPages,setNumberOfPages] = useState(1);



  const handleGenerateReport=async()=>{
    if(!dateRange) dateRange="all"
    
    const limit=5
    const sortCriteria = JSON.stringify(sort)
    try{
      const getSalesReportResult = await getSalesReport(dateRange,customDateRage.from,customDateRage?.to,currentPage,limit,sortCriteria);
      const salesReport=getSalesReportResult?.salesReport
      setTotalSaleCount(salesReport?.totalSaleCount) 

      setTotalAmount(salesReport?.totalSaleAmount)
      setCouponStats(salesReport?.couponStats.filter((coupon)=>coupon?.couponCode!="No Coupon Used"))

      const totalCouponDiscount = salesReport?.couponStats.reduce((acc,curr)=>acc+=curr?.totalCouponDiscount,0)
      setTotalCouponDiscount(totalCouponDiscount)

      setNumberOfPages(getSalesReportResult?.numberOfPages)

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


  useEffect(()=>{
    handleGenerateReport()

  },[currentPage])

  const generateSalesReport=()=>{
    handleGenerateReport()
    setCurrentPage(1)
  }

  const percentageCalculator=(couponUsedCount,couponStats)=>{
    const totalCoupons = couponStats.reduce((acc,curr)=>acc+=curr?.couponUsedCount,0)
    const percentage=((couponUsedCount/totalCoupons)*100).toFixed(2)
    return percentage
  }
  const randomColorPicker=(index)=>{
    const hexValue=`#${((index * 1234567) % 16777215).toString(16).padStart(6, "0")}`;
    return hexValue
  }

  const handleDownloadPdf = async () => {
    try {
      const currentPage=null,limit=null;
      const sortCriteria = JSON.stringify(sort)
      const response = await downloadSalesReportPdf(dateRange,customDateRage.from,customDateRage?.to,currentPage,limit,sortCriteria,totalCouponDiscount)
      console.log(response)

      if (!response.ok) {
        throw new Error('Failed to download sales report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sales-report.pdf'; // The file name
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error downloading the sales report:', error);
    }
  };

  const handleDownloadExcel=async()=>{
    try {
      const currentPage=null,limit=null;
      const sortCriteria = JSON.stringify(sort)
      const response = await downloadSalesReportExcel(dateRange,customDateRage.from,customDateRage?.to,currentPage,limit,sortCriteria,totalCouponDiscount)
      console.log(response)

      if (!response.ok) {
        throw new Error('Failed to download sales report');
      }

      // Create a link element to trigger the download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sales-report.xlsx'); // Filename to download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error downloading the sales report:', error);
    }
  }

  

  const headers=["Order ID","Order Date","Items Count","Used Coupon","Customer Name","Amount"]
  return (
    <div className="AdminProduct relative ps-5 md:ps-[300px] pe-5 pt-16">
      <SideBar />
        <div className="p-6 max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Sales Report</h1>
            <div className="space-x-4 flex">
              <Button onClick={handleDownloadPdf}  className="m-0" variant="outline">
                Download PDF
              </Button>
              <Button onClick={handleDownloadExcel} className="m-0">
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
                  <Button onClick={generateSalesReport} className="w-full" size="lg">
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
                <div className='w-full h-8 rounded-2xl flex'>
                {couponStats.map((coupon,index)=>
                                      <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger
                                        style={{width:`${percentageCalculator(coupon?.couponUsedCount,couponStats)}%`,
                                        backgroundColor:randomColorPicker(index)
                                            }}  
                                        className={`w-8 flex  items-center justify-center text-[10px] font-semibold font-mono text-white ${index===0 && "rounded-s-md"} ${index===couponStats.length-1 && "rounded-e-md"} hover:scale-105  transition-all 0.5s cursor-pointer`}
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
              <SalesChart  />
                
              <TableComponent body={orders} headers={headers}/>
              <PaginationComponent numberOfPages={numberOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      </div>
    </div>
  )
}

export default Dashboard
