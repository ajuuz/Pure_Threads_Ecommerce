import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';

import spinner from '../../../assets/Spin@1x-1.0s-200px-200px.svg'


// implementing toast for messages
import { toast } from "sonner"

import { resendOtp,verifyOtp } from '@/api/User/authApi.js';


const Otp = () => {

    const [timer,setTimer]=useState(()=>{
        const storedCount = localStorage.getItem('count');
    return storedCount ? parseInt(storedCount) : 60;
    });


    const [otpSend,setOtpSend]=useState(true)
    const [loading,setLoading] = useState(false)
    const [otp,setOtp] = useState(
        {
            '0':null,
            '1':null,
            '2':null,
            '3':null,
            '4':null,
        }
    )


    const location = useLocation()
    const email = location.state?.email || null;//accessing the passed email
    const navigate = useNavigate()

    // TIMER RUNNING FOR RESEND OTP
        useEffect(()=>{
          const timerInterval =  setInterval(()=>{
            setTimer((prev)=>{
                if(prev<=1)
                {
                    clearInterval(timerInterval);
                    return 0;
                }
                return prev-1;
            })
           },1000)
           return () => clearInterval(timerInterval); // Cleanup interval on unmount
        },[otpSend])

        useEffect(()=>{
            localStorage.setItem('count',timer)
        },[timer])

        useEffect(()=>{
                if(!email)navigate('/signup')
        },[])
    
    // function for seting otp value in state and change foucus of input for each input field
    const OtpInputChange=(e)=>{
              
        if(e.target.value && e.target.name < 4)
            {
                document.getElementById(`${Number(e.target.name)+1}`).focus()
            }
            else{
                document.getElementById(`${Number(e.target.name)-1}`).focus()
        }
            setOtp({
                ...otp,
                [e.target.name]:e.target.value
            })
        }

    // SUBMIT BUTTON FOR OTP VERIFICATION
    const handleOtpSubmit=async()=>{
        try{
            setLoading(true)
            const response = await verifyOtp({email:email,otp:`${otp[0]+otp[1]+otp[2]+otp[3]+otp[4]}`})
            console.log(response)
            if(response.success)
            {
                toast.success(response.message);
                localStorage.removeItem('count')
                navigate('/login')
            }
            setLoading(false)
        }
        catch(error)
        {
            if(error.sessionExpires)
                {
                    console.log("session expires not verified",error.message)
                    toast.error(error.message)
                    navigate('/signup')
                }
                else
                {    
            console.log("verifiying otp error",error.message)
            toast.error(error.message)
                }
                setLoading(false)
        }
    }

    // RESEND FUNCTION FOR RESENDING OTP
    const handleResendOtp=async()=>{
        
        try{
            setLoading(true)
            const response = await resendOtp({email:email});
            console.log(response)
            toast.success(response.message)
            setOtp({
            '0':null,
            '1':null,
            '2':null,
            '3':null,
            '4':null,})
            setOtpSend(!otpSend)
            setTimer(60)
            setLoading(false)
        }
        catch(error){
            if(error.sessionExpires)
                {
                    console.log("session expires no resend",error.message)
                toast.error(error.message)
                navigate('/signup')
            }
            else{
                console.log("resend otp error",error.message)
                toast.error(error.message)
            }
            setLoading(false)
        }
    }



  return (
    <div className='h-[100vh] flex justify-center items-center'>
      <div className=''>
        <h2 className='text-2xl text-center mb-6 font-extrabold'>Verify OTP</h2>
        <p>We've sent an email with an activation <br /> code to your phone email</p>
        <div className='flex gap-3 py-5'>
        <input className='auth-otp' type="text" name="0" onChange={OtpInputChange}  onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, ''); }} inputMode="numeric" pattern="[0-9]*"  maxLength={1} id='0'/>
        <input className='auth-otp' type="text" name="1" onChange={OtpInputChange}  onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, '');  }} inputMode="numeric" pattern="[0-9]*" maxLength={1} id='1'/>
        <input className='auth-otp' type="text" name="2" onChange={OtpInputChange}  onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, '');  }} inputMode="numeric" pattern="[0-9]*" maxLength={1} id='2'/>
        <input className='auth-otp' type="text" name="3" onChange={OtpInputChange}  onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, '');  }} inputMode="numeric" pattern="[0-9]*" maxLength={1} id='3'/>
        <input className='auth-otp' type="text" name="4" onChange={OtpInputChange}  onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, '');  }} inputMode="numeric" pattern="[0-9]*" maxLength={1} id='4'/>
        </div>
        {timer===0
        ?<p className='text-sm'>I didn't recieve a code . <span onClick={handleResendOtp}  className='text-slate-700 font-bold cursor-pointer'>Resend</span></p>
        :<p className='text-sm'>Your OTP expires in : <span className='text-slate-700 font-bold cursor-pointer'>{timer}</span></p>
        }
        <Button disabled={loading} onClick={handleOtpSubmit}>{loading?<img className='scale-50' src={spinner} alt="Loading..." />:"Verify"}</Button>
      </div>
    </div>
  
  )
}

export default Otp
