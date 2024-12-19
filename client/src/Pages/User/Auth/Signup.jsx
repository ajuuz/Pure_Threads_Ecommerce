import React from 'react'
import './auth.css'
import { Button } from '@/components/ui/button';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '@/api/User/authApi.js';


// implementing toast for messages
import { toast } from "sonner"
import {toast as reactToastify } from "react-toastify"
import spinner from '../../../assets/Spin@1x-1.0s-200px-200px.svg'
import {  validateUserDetailsForm } from '@/Utils/formValidation';
const Signup = () => {

    const [formData,setFormData] = useState({
        name:"",
        email:'',
        phone:null,
        password:"",
        confirmPwd:""
    })


    const [loading,setLoading] = useState(false)

    const navigate = useNavigate()

    // function for setting  sign up datas to the state 
    const inputChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    // handling the submiting of form.
    const handleSubmitForm=async (e)=>{
        e.preventDefault();
        const validation = validateUserDetailsForm(formData)
        if(Object.values(validation).length>0){
            for(let x of Object.values(validation))
            {
                reactToastify.error(x,{className: "custom-toast",progressClassName: "custom-progress-bar"});
            }
            setTimeout(()=>{
                setErrors({})
            },3000)
        } 

        else
        {
            try{
                setLoading(true)
                const response = await signupUser(formData)
                console.log(response)
                if(response.success)
                {
                    console.log(formData.email)
                    toast.success(response.message)
                    localStorage.removeItem('count')
                    navigate('/otp',{state:{email:formData.email,from:"signup"}})
                    setLoading(false)
                }
            }
            catch(error){
                console.error("Error during signup:", error);
                toast.error(error.message)
                setLoading(false)
            }
        }
    }
  return (
    <div className='flex justify-center items-center h-[100vh]'>
    <div className='p-5 border-black  inline-block'>
      <h4 className='text-center pb-8 font-bold'>Sign Up</h4>
      <form>
          <div className=''>
              <label className='text-sm' htmlFor="email">Full Name:</label><br />
              <input className='py-2 px-4 w-[300px] mt-1 border rounded-sm border-gray-200 auth-inputs' type="text" placeholder='Ajmal EA' name='name' required onChange={inputChange}/>
          </div>
          <div className=''>
              <label className='text-sm' htmlFor="email">Email address:</label><br />
              <input className='py-2 px-4 w-[300px] mt-1 border rounded-sm border-gray-200 auth-inputs' type="email" placeholder='example@gmail.com' name='email' required onChange={inputChange}/>
          </div>
          <div className=''>
              <label className='text-sm' htmlFor="email">Mobile Number:</label><br />
              <input className='py-2 px-4 w-[300px] mt-1 border rounded-sm border-gray-200 auth-inputs' type="tel" placeholder='9876543210' name='phone' required onChange={inputChange}/>
          </div>
          <div className=''>
              <label className='text-sm' htmlFor="password">password:</label><br />
              <input className='py-2 px-4 w-[300px] mt-1 border rounded-sm border-gray-200 auth-inputs' type="password" name='password' required onChange={inputChange}/>
          </div>
          <div className=''>
              <label className='text-sm' htmlFor="password">Confirm Password:</label><br />
              <input className='py-2 px-4 w-[300px] mt-1 border rounded-sm border-gray-200 auth-inputs' type="password" name='confirmPwd' required onChange={inputChange}/>
          </div>
          {/* <p className='text-xs font-semibold text-right py-1'>Forgot pasword?</p> */}
          <Button disabled={loading} onClick={handleSubmitForm}>{loading?<img className='scale-50' src={spinner} alt="Loading..." />:"Sign UP"}</Button>
          <p onClick={()=>navigate('/login')} className='text-[14px] font-[400] text-gray-500 text-center'>Already have an account?<span className='hover:text-black font-semibold cursor-pointer'>Login</span></p>
      </form>
    </div>
  </div>
  )
}

export default Signup;
