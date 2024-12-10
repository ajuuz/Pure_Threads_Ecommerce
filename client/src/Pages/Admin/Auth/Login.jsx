import React from 'react'
// shadcn component
import { Button } from '@/components/ui/button';

// importing hooks
import { useState,useEffect } from 'react';

// importing api's function
import { adminLogin } from '@/api/Admin/authApi';

// implementing toast for messages
import { toast } from "sonner"
import {toast as reactToastify} from "react-toastify"


import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

// redux use
import { useDispatch } from 'react-redux';
import { AdminLogin } from '@/Redux/adminSlice';
import {  validateUserDetailsForm } from '@/Utils/formValidation';

const Login = () => {
  const [formData,setFormData] = useState({
    email:'',
    password:"",
})

const navigate = useNavigate()

const dispatch = useDispatch();

const inputChange=(e)=>{
    setFormData({
        ...formData,
        [e.target.name]:e.target.value
    })
}

const handleSubmitForm=async(e)=>{
  
  console.log(formData)
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
     const response = await adminLogin(formData);
     toast.success(response.message);
    dispatch(AdminLogin({name:response?.adminName}))
    }
    catch(error){
      console.log("login error",error)
      toast.error(error?.message || "Login failed. Please try again.");
    }
}
  return (
    <div className='flex justify-center items-center h-[100vh]'>
      <div className='p-5 border-black  inline-block'>
        <h4 className='text-center pb-8 font-bold'>Sign In</h4>
        <form>
            <div className='mb-5'>
                <label className='text-xs' htmlFor="email">Email address:</label><br />
                <input className='py-1 px-4 w-[300px] mt-1 border rounded-sm border-gray-200 auth-inputs' type="email" placeholder='example@gmail.com' name='email' onChange={inputChange} required/>
            </div>
            <div>
                <label className='text-xs' htmlFor="password">password:</label><br />
                <input className='py-1 px-4 w-[300px] mt-1 border rounded-sm border-gray-200 auth-inputs' type="password" name='password' onChange={inputChange} required/>
            </div>
            <Button onClick={handleSubmitForm}>Login</Button>
        </form>
            
      </div>
    </div>
  )
}

export default Login
