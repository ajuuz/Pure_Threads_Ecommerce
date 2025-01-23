import { getAllCoupons } from '@/api/Admin/couponApi'
import CouponDialogComponent from '@/components/AdminComponent/Dialog/CouponDialogComponent'
import SideBar from '@/components/AdminComponent/SideBar'
import TableComponent from '@/components/AdminComponent/Table/TableCompnent'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { toast } from 'sonner'

const Coupon = () => {

  const [coupons,setCoupons] = useState([]);
  const [searchInput,setSearchInput]=useState("");
  const [refresh,setRefresh]=useState(false);

  useEffect(()=>{
    const fetchCoupons = async()=>{
      try{
        const getCouponsResult = await getAllCoupons(searchInput);
        const transformedCoupons = getCouponsResult?.coupons.map((coupon,index)=>{
          return [coupon?._id,[{name:"SNO",value:index+1},
                          {name:"coupon code",value:coupon?.couponCode},
                          {name:"coupon value",value:`${coupon?.couponValue} ${coupon?.couponType}`},
                          {name:"description",value:coupon?.description},
                          {name:"max redeemable",value:coupon?.maxRedeemable??coupon?.couponValue},
                          {name:"minimum Purchase",value:coupon?.minimumOrderAmount},
                          {name:"Max Usable Limit",value:coupon?.maxUsableLimit?.isLimited?coupon?.maxUsableLimit?.limit:"No limit"},
                          {name:"Per user Limit",value:coupon?.perUserLimit},
                          {name:"Action",value:<CouponDialogComponent dialogTriggerer="View & Edit" dialogHeader="Add New Coupon" dialogDescription="her you can add new coupon" coupon={coupon}/>}
                        ]]
        })
        setCoupons(transformedCoupons)
      }
      catch(error)
      {
        toast.error(error.message)
      }
    }
    fetchCoupons();
  },[refresh])

  const handleCouponChange=(e)=>{
    setSearchInput(e.target.value);
    if(e.target.value==="") setRefresh(!refresh)
  }

  const headers = ["SNO","COUPON CODE","COUPON VALUE","DESCRIPTION","MAX REDEEMABLE","MINIMUM PURCHASE","MAX USABLE LIMIT","PER USER LIMIT","ACTION"]
  return (
    <div className="AdminAddCategory relative ps-5 md:ps-[300px] pe-5 pt-16">
      <SideBar />
      {/* header part */}
      <div className="product-first-div flex items-center justify-around gap-7">
          <h1 className="text-xl font-bold">Coupons</h1>
          <div className="flex-1 flex items-center">
            <div className="text-white bg-black p-2 rounded-s-md">search</div>
            <input onChange={handleCouponChange} className="border w-[100%] py-2" type="text" />
            <div onClick={()=>setRefresh(!refresh)} className="cursor-pointer text-white bg-black p-3 rounded-e-md">
              <CiSearch />
            </div>
          </div>
          <div  className=" cursor-pointer rounded-lg">
            <CouponDialogComponent dialogTriggerer="Add new Coupon" dialogHeader="Add New Coupon" dialogDescription="her you can add new coupon"/>
          </div>
        </div>

      <TableComponent headers={headers} body={coupons} />
        
    </div>
  )
}

export default Coupon
