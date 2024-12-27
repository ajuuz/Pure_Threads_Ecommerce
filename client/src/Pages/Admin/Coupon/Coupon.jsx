import { getAllCoupons } from '@/api/Admin/couponApi'
import CouponDialogComponent from '@/components/AdminComponent/Dialog/CouponDialogComponent'
import SideBar from '@/components/AdminComponent/SideBar'
import React, { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { toast } from 'sonner'

const Coupon = () => {

  const [coupons,setCoupons] = useState([]);
  useEffect(()=>{
    const fetchCoupons = async()=>{
      try{
        const getCouponsResult = await getAllCoupons();
        setCoupons(getCouponsResult.coupons)
      }
      catch(error)
      {
        toast.error(error.message)
      }
    }
    fetchCoupons();
  },[])
  return (
    <div className="AdminAddCategory relative ps-5 md:ps-[300px] pe-5 pt-16">
      <SideBar />
      {/* header part */}
      <div className="product-first-div flex items-center justify-around gap-7">
          <h1 className="text-xl font-bold">Coupons</h1>
          <div className="flex-1 flex items-center">
            <div className="text-white bg-black p-2 rounded-s-md">search</div>
            <input className="border w-[100%] py-2" type="text" />
            <div className="text-white bg-black p-3 rounded-e-md">
              <CiSearch />
            </div>
          </div>
          <div  className=" cursor-pointer rounded-lg">
            <CouponDialogComponent dialogTriggerer="Add new Coupon" dialogHeader="Add New Coupon" dialogDescription="her you can add new coupon"/>
          </div>
        </div>

      <div className='m-20  shadow-md grid '>
        <div className=''>

        </div>
      </div>
        
    </div>
  )
}

export default Coupon
