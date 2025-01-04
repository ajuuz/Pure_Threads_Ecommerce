import React from 'react'

import { GiCardboardBoxClosed } from "react-icons/gi";
import { RxCaretRight } from "react-icons/rx";
import './SideBar.css'

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Button } from '../ui/button';
import { AdminLogout } from '@/Redux/adminSlice';
import { toast } from 'sonner';
import { logout } from '@/api/Admin/authApi';
const SideBar = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()


  // function
  const handleLogout=async()=>{
    try{
      const logoutResult = await logout();
      toast.success(logoutResult.message); 
      dispatch(AdminLogout())
      navigate('/admin/login')
    }
    catch(error)
    {
      console.log(error.message)
      toast.error(error.message);
    }
    
  }

  return (
    <div className='sidebar hidden md:block fixed top-0 left-0 shadow-lg pt-5 ps-7 pe-12' >
      <h1 className='font-bold text-2xl '>PURE THREADS</h1>
      <div className='flex flex-col gap-6 mt-16'>
        <p className='text-lg font-semibold flex items-center justify-between cursor-pointer'><GiCardboardBoxClosed />Dashboard<RxCaretRight /></p>
        <p className='text-lg font-semibold flex items-center justify-between cursor-pointer' onClick={()=>navigate('/admin/products')}><GiCardboardBoxClosed />Products<RxCaretRight /></p>
        <p className='text-lg font-semibold flex items-center justify-between cursor-pointer' onClick={()=>navigate('/admin/orders')}><GiCardboardBoxClosed />Orders<RxCaretRight /></p>
        <p className='text-lg font-semibold flex items-center justify-between cursor-pointer'  onClick={()=>navigate('/admin/customers')}><GiCardboardBoxClosed />Customers<RxCaretRight /></p>
        <p className='text-lg font-semibold flex items-center justify-between cursor-pointer' onClick={()=>navigate('/admin/salesReports')} ><GiCardboardBoxClosed />Sales<RxCaretRight /></p>
        <p className='text-lg font-semibold flex items-center justify-between cursor-pointer'  onClick={()=>navigate('/admin/categories')}><GiCardboardBoxClosed />Categeroies<RxCaretRight /></p>
        <p className='text-lg font-semibold flex items-center justify-between cursor-pointer'><GiCardboardBoxClosed />Coupons<RxCaretRight /></p>
        <p className='text-lg font-semibold flex items-center justify-between cursor-pointer'><GiCardboardBoxClosed />Banners<RxCaretRight /></p>
      </div>
      <div className='mt-4 flex flex-col items-center'>
        <Button className="bg-white border border-black text-black">Account</Button>
        <Button onClick={handleLogout} className="w-36">Logout</Button>
      </div>
    </div>
  )
}

export default SideBar
