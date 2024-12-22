import React, { useEffect, useRef, useState } from "react";

// components
import { Input } from "@/components/ui/input";
import HamburgerMenu from "./HamburgerMenu";

// icons
import { GiHamburgerMenu } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaOpencart } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import { RiAccountCircleLine } from "react-icons/ri";


import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { UserLogout } from "@/Redux/userSlice";
import { toast } from "sonner";
import { logout } from "@/api/User/authApi";

const NavBar = () => {

    // useState
    const [isHamburger,setIsHamburger] = useState(false)
    const [profileDropDown,setProfileDropDown] = useState(false)

    const profileDropDownRef = useRef()
   
    const navigate = useNavigate()

    const {user} = useSelector((state)=>state.user)
    const dispatch = useDispatch()


    const handleLogout=async()=>{
      try{
        const logoutResult = await logout()
        toast.success(logoutResult.message); 
        dispatch(UserLogout())
      }
      catch(error)
      {
        console.log(error.message)
        toast.error(error.message)
      }
    }

    const  closePopupIfOutside=(e)=>
    {
        if(!profileDropDownRef.current.contains(e.target)) setProfileDropDown(false)
    }

    useEffect(()=>{

        if(profileDropDown!==false)document.addEventListener('mousedown',closePopupIfOutside)
        else document.removeEventListener('mousedown',closePopupIfOutside)
        return  ()=>document.removeEventListener('mousedown',closePopupIfOutside)
    },[profileDropDown])

  return (
    <>
  <div className="fixed top-0 left-0 w-full z-[1000]">
    <div className="bg-white text-black text-center shadow-inner shadow-slate-300">FLAT 20% OFF</div>
        {isHamburger && <HamburgerMenu setIsHamburger={setIsHamburger}/>}
    <nav className="bg-black text-white flex items-center justify-between px-8 py-4  w-full">
      <div className="flex items-end gap-4 md:gap-16 ">
            <div className="flex items-center gap-5">
                <div className="cursor-pointer" onClick={()=>setIsHamburger(true)}><GiHamburgerMenu /></div>
                <div className="logo font-mono font-extrabold md:text-2xl">PureThreads</div>
            </div>
        <div className="flex gap-5 md:mb-1">
            <span onClick={()=>navigate('/')} className="hidden md:block cursor-pointer">Home</span>
            <span onClick={()=>navigate('/shop')} className="cursor-pointer">Sale</span>
           {!user && <span className="cursor-pointer"  onClick={()=>navigate('/login')}>SignUp</span>} 
        </div>
      </div>

      <div className="flex gap-6 w-[50%] items-center">
        <div className="flex flex-1">
            <Input placeHolder="what are you looking for?" className="w-full  h-7 rounded-e-none border-none placeholder:text-muted-foreground text-[12px] font-mono"/>
            <div className="bg-white h-7 rounded-e-md text-black flex items-center px-2">
            <FaSearch />
            </div>
        </div>
        <div className="flex gap-7 items-center">
           <div className="hidden md:flex gap-7">
              <div className="cursor-pointer">
                <FaRegHeart />
              </div>
              <div onClick={()=>navigate('/cart')} className="cursor-pointer">
                <FaOpencart />
              </div>
           </div>
           {user && 
           <div className="flex relative cursor-pointer">
            <RiAccountCircleLine className="text-lg" onClick={()=>setProfileDropDown(true)}/>
              {profileDropDown &&
              <div ref={profileDropDownRef} className="absolute flex flex-col gap-3 w-32 text-black bg-white px-4 py-2 shadow-lg rounded-lg top-8 right-[-20px]">
              <div onClick={()=>navigate('/profile')} className="flex items-center gap-4">
                <RiAccountCircleLine />
                <p>Profile</p>
              </div>
              <div onClick={()=>navigate('/wishlist')} className="md:hidden flex items-center gap-4">
                <FaRegHeart />
                <p>wishlist</p>
                </div>
              <div onClick={()=>navigate('/cart')} className="md:hidden flex items-center gap-4">
                <FaOpencart />
                <p>cart</p>
              </div>
              <div>
                <div className="flex items-center gap-4" onClick={handleLogout}><IoIosLogOut />Logout</div>
              </div>
            </div>
              }
           </div>
           }
           
        </div>
      </div>
    </nav>
    
  </div>
    </>
  );
};

export default NavBar;
