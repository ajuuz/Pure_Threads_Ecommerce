import React from 'react'
import '../auth.css'
// importing hooks
import { useState } from 'react';

// shadcn component
import { Button } from '@/components/ui/button';

// importing api's function
import { forgotVerifyEmail, } from '@/api/User/authApi';

import { useNavigate } from 'react-router-dom';

// implementing toast for messages
import { toast } from 'sonner';
import {toast as reactToastify} from "react-toastify"

import spinner from '../../../../assets/Spin@1x-1.0s-200px-200px.svg'



const VerifyEmail = () => {

  // useState
  const [email,setEmail] = useState("")
  const [loading,setLoading] = useState(false)


// for navigating to landing page
const navigate = useNavigate()

// for dispatching actions
const handleEmailInput=(e)=>{
    setEmail(e.target.value)
}

const handleSubmitForm=async(e)=>{
  e.preventDefault();
    
    if(email.trim===null || email==="") return reactToastify.error("Email is required")
    if(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)===false) return reactToastify.error("Please enter a valid email address in the format: username@domain.com.")
    setLoading(true);
    try{
     const response = await forgotVerifyEmail(email);
     toast.success(response.message);
     setLoading(false)
     navigate('/otp',{state:{email:email,from:"forgotPassword"}})
    }
    catch(error){
      setLoading(false)
      if(error?.statusCode===403) return
      console.log("login error",error)
      toast.error(error?.message || "Login failed. Please try again.");
    }
}


  return (
    <>
    <div className='flex justify-center items-center h-[100vh]'>
      <div className='p-5 border-black  inline-block'>
        <h4 className='text-center pb-8 font-bold'>Have You Forgot You password?</h4>
        <p className='text-sm text-muted-foreground'>Enter you registered email ID for the secret code</p>
        <form>
            <div className='mb-5'>
                <label className='text-sm' htmlFor="email">Email address:</label><br />
                <input className='py-2 px-4 w-[300px] mt-1 border rounded-sm border-gray-200 auth-inputs' type="email" placeholder='example@gmail.com' name='email' onChange={(e)=>handleEmailInput(e)} required/>
            </div>
            
            <Button disabled={loading} onClick={handleSubmitForm}>{loading ? <img className='scale-50' src={spinner} alt="Loading..." /> :"verify Email"}</Button>
            <p onClick={()=>navigate('/login')} className='text-[14px] font-[400] text-gray-500 mt-2 mb-10 cursor-pointer'>Back to Login</p>
        </form>
      </div>
    </div>
    </>
  )
}

export default VerifyEmail
