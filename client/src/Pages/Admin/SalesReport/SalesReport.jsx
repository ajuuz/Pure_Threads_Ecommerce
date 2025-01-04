import { getSalesReport } from '@/api/Admin/salesReportApi'
import SideBar from '@/components/AdminComponent/SideBar'
import React, { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { toast } from 'sonner'

const SalesReport = () => {
    const [salesData,setSalesData] = useState({
        salesReport: [],
        totalSalesCount: 0,
        totalPage: 1,
        page: 1,
    })

    useEffect(()=>{
        const fetchSalesReport=async()=>{
            try{
                // const 
                const getSalesReportResult = await getSalesReport()
                console.log(getSalesReportResult);
            }
            catch(error)
            {
                toast.error(error.message)
            }
        }
        fetchSalesReport();
    })
  return (
    <div className="AdminProduct relative ps-5 md:ps-[300px] pe-5 pt-16">
      <SideBar />
      
     {/*  first div */}
     <div className=" flex items-center justify-around gap-7">
          <h1 className="text-xl font-bold">Customers</h1>
          <div className="flex-1 flex items-center">
            <div className="text-white bg-black p-2 rounded-s-md">search</div>
            <input className="border w-[100%] py-2" type="text" />
            <div className="text-white bg-black p-3 rounded-e-md">
              <CiSearch />
            </div>
          </div>
          <div className="bg-black text-white px-4 py-2 rounded-lg">
            <span>Filter</span>
          </div>
        </div>



    </div>
  )
}

export default SalesReport
