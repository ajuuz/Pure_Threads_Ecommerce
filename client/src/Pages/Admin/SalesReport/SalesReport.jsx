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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

//apis
import { getSalesReport } from '@/api/Admin/salesReportApi'
import { Input } from '@/components/ui/input'

const SalesReport = () => {
  let [dateRange, setDateRange] = useState('')
  const [customDateRage,setCustomDateRange] = useState({
    from:"",
    to:""
  })

  
  
  useEffect(()=>{
    const handleGenerateReport=async()=>{
      if(!dateRange) dateRange="all"
      const from = customDateRage.from ? customDateRage.from : null;
      const to = customDateRage.to ? customDateRage.from : null;
      try{
        const getSalesReportResult = await getSalesReport(dateRange,from,to);
        console.log(getSalesReportResult)
      }catch(error)
      {
        toast.error(error.message)
      }
    }
    handleGenerateReport()
  })

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
                  
          <div className="grid grid-cols-3 gap-6 text-center">
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Sales Count</CardTitle>
                <p className="text-3xl font-bold">89</p>
              </CardHeader>
            </Card>
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Order Amount</CardTitle>
                <p className="text-3xl font-bold">₹108,275.00</p>
              </CardHeader>
            </Card>
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Discount</CardTitle>
                <p className="text-3xl font-bold">₹6,021.45</p>
              </CardHeader>
            </Card>
          </div>
                  
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: 106, date: '31 Dec 2024', customer: 'sahal', status: 'pending', amount: 1025.00 },
                    { id: 105, date: '31 Dec 2024', customer: 'sahal', status: 'pending', amount: 1803.65 },
                    { id: 104, date: '31 Dec 2024', customer: 'sahal', status: 'cancelled', amount: 1250.00 },
                    { id: 103, date: '31 Dec 2024', customer: 'sahal', status: 'pending', amount: 1366.25 },
                    { id: 102, date: '31 Dec 2024', customer: 'sahal', status: 'pending', amount: 450.00 },
                  ].map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'pending' ? 'secondary' : 'destructive'}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">₹{order.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}

export default SalesReport
