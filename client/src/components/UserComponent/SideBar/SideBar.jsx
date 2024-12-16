import React from 'react'

import { useNavigate } from 'react-router-dom';

import { FaAddressBook } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaBagShopping } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { IoWallet } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";

import "./SideBar.css"

const SideBar = ({current}) => {


const navigate = useNavigate()    
  return (
    <div className='sideBarOuterDiv fixed top-32 left-5  rounded-3xl shadow-lg w-72 hidden md:inline-block z-999'>
      <div>
        <div className='flex ps-14  gap-4 rounded-b-3xl  items-center shadow-lg py-8 '>
            <div className='rounded-[50px] px-4 text-white py-2 bg-black'>
            A
            </div>
            <p className='text-xl font-medium'>Ajmal</p>
        </div>
      </div>
      <div className='flex flex-col gap-6 py-6  text-[16px]'>

        <div onClick={()=>navigate('/profile')} className='flex gap-10 justify-between items-center'>
            <div className={`bg-black w-5 h-5 ${current==="profile" ? "visible":"invisible"}`}></div>
                <div className='flex flex-1 gap-6 items-center'><FaAddressBook className='text-xl'/>Profile</div>
            <div className={`bg-black  w-5 h-5 ${current==="profile" ? "visible":"invisible"}`}></div>
        </div>

        <div onClick={()=>navigate('/address')} className='flex gap-10 justify-between items-center'>
            <div className={`bg-black   w-5 h-5  ${current==="address" ? "block":"invisible"}`}></div>
                <div className='flex flex-1 gap-6 items-center'><FaMapLocationDot className='text-xl'/>Address</div>
            <div className={`bg-black   w-5 h-5  ${current==="address" ? "block":"invisible"}`}></div>
        </div>

        <div onClick={()=>navigate('/orders')} className='flex gap-10 justify-between items-center'>
            <div className={`bg-black   w-5 h-5  ${current==="order" ? "visible":"invisible"}`}></div>
                <div className='flex flex-1 gap-6 items-center'><FaBagShopping className='text-xl'/>Orders</div>
            <div className={`bg-black   w-5 h-5  ${current=="order" ? "visible":"invisible"}`}></div>
        </div>

        <div onClick={()=>navigate('/coupon')} className='flex gap-10 justify-between items-center'>
            <div className={`bg-black   w-5 h-5  ${current==="coupon" ? "visible":"invisible"}`}></div>
                <div className='flex flex-1 gap-6 items-center'><FaBagShopping className='text-xl'/>Coupons</div>
            <div className={`bg-black   w-5 h-5  ${current==="coupon" ? "visible":"invisible"}`}></div>
        </div>

        <div onClick={()=>navigate('/wallet')} className='flex gap-10 justify-between items-center'>
            <div className={`bg-black   w-5 h-5  ${current==="wallet" ? "visible":"invisible"}`}></div>
                <div className='flex flex-1 gap-6 items-center'><IoWallet className='text-xl'/>Wallet</div>
            <div className={`bg-black   w-5 h-5  ${current==="wallet" ? "visible":"invisible"}`}></div>
        </div>

        <div onClick={()=>navigate('/wishlist')} className='flex gap-10 justify-between items-center'>
            <div className={`bg-black   w-5 h-5  ${current==="wishlist" ? "visible":"invisible"}`}></div>
                <div className='flex flex-1 gap-6 items-center'><FaHeart className='text-xl'/>Wishlist</div>
            <div className={`bg-black   w-5 h-5  ${current==="wishlist" ? "visible":"invisible"}`}></div>
        </div>

        <div onClick={()=>navigate('/chagePassword')} className='flex gap-10 justify-between items-center'>
            <div className={`bg-black   w-5 h-5  ${current==="password" ? "visible":"invisible"}`}></div>
                <div className='whitespace-nowrap flex flex-1 gap-6 items-center'><RiLockPasswordFill className='text-xl'/>Change Password</div>
            <div className={`bg-black   w-5 h-5  ${current==="password" ? "visible":"invisible"}`}></div>
        </div>
        
        <div onClick={()=>navigate('/')} className='flex gap-10 justify-between items-center'>
            <div className={`bg-black   w-5 h-5  ${current==="refferal" ? "visible":"invisible"}`}></div>
                <div className='flex flex-1 gap-6 items-center'><FaUserFriends className='text-xl'/>Refferal Code</div>
            <div className={`bg-black   w-5 h-5  ${current==="refferal" ? "visible":"invisible"}`}></div>
        </div>

        <div onClick={()=>navigate('/')} className='flex gap-10 justify-between items-center'>
            <div className={`bg-black   w-5 h-5  ${current==="logout" ? "visible":"invisible"}`}></div>
                <div className='flex flex-1 gap-6 items-center'><AiOutlineLogout className='text-xl'/>Logout</div>
            <div className={`bg-black   w-5 h-5  ${current==="logout" ? "visible":"invisible"}`}></div>
        </div>

      </div>


    </div>
  )
}

export default SideBar
