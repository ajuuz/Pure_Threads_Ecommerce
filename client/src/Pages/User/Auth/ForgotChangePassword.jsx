import React from 'react'
import './auth.css'
// shadcn component
import { Button } from '@/components/ui/button';

// importing hooks
import { useState } from 'react';

// importing api's function
import { forgotChangePassword, forgotPassword, } from '@/api/User/authApi';



import { useLocation, useNavigate } from 'react-router-dom';

// implementing toast for messages
import { toast } from 'sonner';
import {toast as reactToastify} from "react-toastify"


const ForgotChangePassword = () => {

const [formData,setFormData] = useState({
  newPassword:"",
  confirmPassword:""
})

const location = useLocation()
const {email} = location.state

// for navigating to landing page
const navigate = useNavigate()

// for dispatching actions

const handleInputChange=(e)=>{
  setFormData((prev)=>({...prev,[e.target.name]:e.target.value}))
}

const handleSubmitForm=async(e)=>{
  e.preventDefault();
    if(formData.newPassword!=formData.confirmPassword) return reactToastify.error("new and confirm password should be same")
    try{
     const response = await forgotChangePassword(email,newPassword);
     console.log(response);
     toast.success(response.message);
     navigate('/login')
    }
    catch(error){
      if(error?.statusCode===403) return
      console.log("forgot password error",error)
      toast.error(error?.message || "change password failed. Please try again.");
    }
}




  return (
    <>
    <div className='flex justify-center items-center h-[100vh]'>
      <div className='p-5 border-black  inline-block'>
        <h4 className='text-center pb-8 font-bold'>Enter a new Password?</h4>
        <form>
            <div className='mb-5'>
                <label className='text-sm' htmlFor="email">New Password</label><br />
                <input className='py-2 px-4 w-[300px] mt-1 border rounded-sm border-gray-200 auth-inputs' type="password"  name='newPassword' onChange={(e)=>handleInputChange(e)} required/>
            </div>
            <div className='mb-5'>
                <label className='text-sm' htmlFor="email">Confirm Password:</label><br />
                <input className='py-2 px-4 w-[300px] mt-1 border rounded-sm border-gray-200 auth-inputs' type="password"  name='confirmPassword' onChange={(e)=>handleInputChange(e)} required/>
            </div>
            
            <Button onClick={handleSubmitForm}>Change Password</Button>
        </form>
      </div>
    </div>
    </>
  )
}

export default ForgotChangePassword
