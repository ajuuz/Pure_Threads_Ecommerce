import React, { useEffect, useState } from 'react'
import SideBar from '@/components/UserComponent/SideBar/SideBar'
import NavBar from '@/components/UserComponent/NavBar/NavBar'
import InputComponent from '@/components/AdminComponent/Input/InputComponent'
import { Button } from '@/components/ui/button'


// icons
import { FaRegEdit } from "react-icons/fa";

// toast
import { toast } from 'sonner'
import {toast as reactToastify} from "react-toastify"

// apis
import {  getUserProfile, updateUserProfile } from '@/api/User/profileApi'
import { validateUserDetailsForm } from '@/Utils/formValidation'

const Account = () => {

    const [formData,setFormData] = useState({
        name:"",
        email:"",
        phone:null,
        disabled:true
    })

    useEffect(()=>{
        const fetchUserProfile = async()=>{
            try{
                const userDetailsResult = await getUserProfile();
                console.log(userDetailsResult.userDetails)
                setFormData((prev)=>({...prev,...userDetailsResult?.userDetails}))
            }
            catch(error)
            {
                console.log(error.message)
            }
        }
        fetchUserProfile();
    },[])

    const handleEditButton=()=>{
        setFormData((prev)=>(
            {...prev,
            disabled:!prev.disabled
            }))
            toast.success(`Edit mode ${formData.disabled?"ON":"OFF"}`)
    }

    const handleInputChange = (arg1,e,arg2,arg3)=>{
        setFormData((prev)=>(
            {...prev,
                [e.target.name]:e.target.value
            }
        ))
    }

    const handleUpdate =async()=>{
        const {email,disabled,...rest} = formData
        const validation = validateUserDetailsForm(rest)
        if(Object.values(validation).length>0)
        {
            for(let x of Object.values(validation))
            {
                reactToastify.error(x,{className: "custom-toast",progressClassName: "custom-progress-bar"});
            }
            return 
        }
        try{
            
            const updateResult = await updateUserProfile(rest);
            toast.success(updateResult.message)
            setFormData((prev)=>({...prev,disabled:true}))
        }
        catch(error)
        {
            toast.error(error.message);
        }
    }

    const InputFields = [{label:"Name",type:"text",id:"name",name:"name",disabled:formData.disabled,value:formData.name,style:`h-9 block w-full lg:w-96 ${formData.disabled && "border-none"}`},{label:"Email",type:"text",id:"email",name:"email",disabled:true,value:formData.email,style:"border-none w-full"},{label:"mobile Number",type:"text",id:"phone",name:"phone",disabled:formData.disabled,value:formData.phone,style:`block w-full lg:w-96 ${formData.disabled && "border-none"}`}]

  return (
    <div className='ps-[340px]  pt-32'>
      <NavBar/>
      <SideBar current="profile"/>
      <div className=' flex justify-center'>
        <div className='p-10 shadow-[rgba(0,0,0,0.1)_0px_1px_30px_1px] rounded-xl w-[70%]'>
            <div className='flex justify-end text-lg'><FaRegEdit onClick={handleEditButton}/></div>
            <InputComponent InputFields={InputFields} handleInputChange={handleInputChange}/>
            {!formData.disabled && <Button onClick={handleUpdate}>UPDATE</Button>}
        </div>
      </div>
    </div>
  )
}

export default Account
