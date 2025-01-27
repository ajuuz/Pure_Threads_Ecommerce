import React from 'react'
import './auth.css'
// shadcn component
import { Button } from '@/components/ui/button';

// importing hooks
import { useState,useEffect } from 'react';

// importing api's function
import { loginUser, loginWithGoogle } from '@/api/User/authApi';

// import dispatch form redux
import { useDispatch } from 'react-redux';
import { UserFirstLogin, UserLogin } from '@/Redux/userSlice';


import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../../../FireBase/fireBase.js';
import { signInWithPopup } from 'firebase/auth';

// implementing toast for messages
import { toast } from 'sonner';
import {toast as reactToastify} from "react-toastify"

import {  validateUserDetailsForm } from '@/Utils/formValidation';

const Login = () => {
  const [formData,setFormData] = useState({
    email:'',
    password:"",
})



// for navigating to landing page
const navigate = useNavigate()

// for dispatching actions
const dispatch = useDispatch();

const inputChange=(e)=>{
    setFormData({
        ...formData,
        [e.target.name]:e.target.value
    })
}

const handleSubmitForm=async(e)=>{
  e.preventDefault();
    const validation = validateUserDetailsForm(formData);
    if(Object.values(validation).length>0)
    {
      for(let x of Object.values(validation))
      {
        reactToastify.error(x,{className: "custom-toast",progressClassName: "custom-progress-bar"});
        return;
      }
    }
    try{
     const response = await loginUser(formData);
     toast.success(response.message);
     dispatch(UserLogin({name:response.userName}))
     dispatch(UserFirstLogin(response.isFirstLogin))
    }catch(error){
      if(error?.statusCode===403) return
      toast.error(error?.message || "Login failed. Please try again.");
    }
}

// login
const googleSignin = async()=>{
  try{
     const result =  await signInWithPopup(auth,googleProvider)
     const response = await loginWithGoogle(result?.user.displayName,result?.user.email)
      if(response.success)
      {
        navigate('/')
      }
      toast.success(response.message)
      dispatch(UserLogin({name:result?.user.displayName,email:result?.user.email}))
  }
  catch(err){
      toast.error(err.message)
  }
}


  return (
    <>
    <div className='flex justify-center items-center h-[100vh]'>
      <div className='p-5 border-black  inline-block'>
        <h4 className='text-center pb-8 font-bold'>Sign In</h4>
        <form>
            <div className='mb-5'>
                <label className='text-sm' htmlFor="email">Email address:</label><br />
                <input className='py-2 px-4 w-[300px] mt-1 border rounded-sm border-gray-200 auth-inputs' type="email" placeholder='example@gmail.com' name='email' onChange={inputChange} required/>
            </div>
            <div>
                <label className='text-sm' htmlFor="password">password:</label><br />
                <input className='py-2 px-4 w-[300px] mt-1 border rounded-sm border-gray-200 auth-inputs' type="password" name='password' onChange={inputChange} required/>
            </div>
            <p className='text-xs font-semibold text-right py-1'>Forgot pasword?</p>
            <Button onClick={handleSubmitForm}>Login</Button>
            <p onClick={()=>navigate('/signup')} className='text-[14px] font-[400] text-gray-500 mt-2 mb-10 cursor-pointer'>New user?<span className='hover:text-black font-semibold'>Sign up</span></p>
        </form>
            <div className='relative mb-8'>
            <hr />
            <p className='text-xs font-semibold text-center bg-white px-5 text-gray-500 absolute top-[-10px] left-[30%]'>Or Login with</p>
            </div>
            <div onClick={googleSignin} className='py-3 px-4 w-[100%] border rounded-md border-gray-200 text-xs text-center'><i class="fa-brands fa-google mr-2"></i><span className='font-semibold'>Google</span></div>
      </div>
    </div>
    </>
  )
}

export default Login
