import { getAllCoupons } from '@/api/User/couponApi'
import {CouponCardType1} from '@/components/UserComponent/CouponCard/CouponCard'
import NavBar from '@/components/UserComponent/NavBar/NavBar'
import SideBar from '@/components/UserComponent/SideBar/SideBar'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'


const Coupon = () => {
  const [coupons,setCoupons] = useState([])

  useEffect(()=>{
    const fetchCoupons = async()=>{
      try{
        const getAllCouponsResult =await getAllCoupons()
        setCoupons(getAllCouponsResult.coupons);
      }
      catch(error)
      {
        toast.error(error.message)
      }
    } 
    fetchCoupons();
  },[])


  return (
    <div className='md:ps-[340px]  pt-32'>
    <NavBar/>
    <SideBar current="coupon"/>
      {/* <div className='grid   grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 gap-3 p-5'> */}
      <div className='flex flex-wrap gap-y-7'>
          {coupons.map((coupon,index)=><CouponCardType1 coupon={coupon}/>)}
      </div>
    </div>
  )
}

export default Coupon
