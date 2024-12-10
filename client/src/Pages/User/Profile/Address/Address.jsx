import NavBar from '@/components/UserComponent/NavBar/NavBar'
import SideBar from '@/components/UserComponent/SideBar/SideBar'
import React, { useEffect, useState } from 'react'

import { deleteAddress, getAddresses, setDefaultAddress } from '@/api/User/addressApi';
//icons
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

import { toast } from 'sonner';
import Modal from '@/components/AdminComponent/Modal/Modal';

const Address = () => {

    // states
    const [addresses,setAddresses] = useState([])

    //navigate
    const navigate = useNavigate()


    useEffect(()=>{
        const fetchAddresses=async()=>{
            try{
              const getAddressResult = await getAddresses();
              setAddresses(getAddressResult.addresses);
            }
            catch(error)
            {
                toast.error(error.message)
            }
        }
        fetchAddresses();
    },[])


    // functions
    const handleSetDefaultAddress=async(id)=>{
        try{
            const setDefaultResult = await setDefaultAddress(id);
            toast.success(setDefaultResult.message); 
            setAddresses(setDefaultResult.addresses)
        }catch(error)
        {
            toast.error(error.message)
        }
    }


    const hanldeDeleteAddressClick=async(id)=>{
        try{
            const deleteAddressResult=await deleteAddress(id);
            setAddresses(deleteAddressResult.addresses)
            toast.success(deleteAddressResult.message)
        }
        catch(error)
        {
            toast.error(error.message)
        }
    }

  return (
    <div className='md:ps-[340px]  pt-32'>
    <NavBar/>
    <SideBar current="address"/>
    <div className='p-10 shadow-[rgba(0,0,0,0.1)_0px_1px_30px_1px] rounded-xl w-[90%] grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        
        <div className='p-6  shadow-[rgba(0,0,0,0.1)_0px_1px_30px_1px] rounded-xl flex flex-col gap-2 justify-center items-center'>
            <div onClick={()=>navigate('/address/add')} className='bg-black text-white p-2 rounded-3xl'>
                <FaPlus className='text-3xl'/>
            </div>
            <p className='text-muted-foreground font-semibold text-xs'>ADD NEW ADDRESS</p>
        </div>

        {addresses.map((address)=>
        <div key={address._id}  className='p-6 shadow-[rgba(0,0,0,0.1)_0px_1px_30px_1px] rounded-xl'>
            <div onClick={()=>navigate(`/address/manage/${address._id}`)}>
            <h2 className='font-bold'>{address?.name?address.name:"John Doe"}</h2>
            <p>{address?.buildingName?address.buildingName:""}</p>
            <p className='truncate'>{`${address?.address?address?.address:""},${address?.district?address?.district:""}`}</p>
            <p>{`${address?.landMark?address.landMark:""},${address?.city?address?.city:""}`}</p>
            <p>{address?.pinCode?address.pinCode:null}</p>
            <p>{address?.state?address.state:""}</p>
            </div>
            <div className='flex justify-between mt-3'>
            <span className='text-muted-foreground'>{address.isDefault ? "default":<button onClick={()=>handleSetDefaultAddress(address._id)} className='bg-black  text-white py-1 px-2 rounded-md'>Set Default</button>}</span>
                <Modal id={address._id} handleClick={hanldeDeleteAddressClick} type="button"    dialogTitle="are you sure" dialogDescription="you can list again" alertDialogTriggerrer={ <button className='bg-black text-white py-1 px-2 rounded-md'>Delete</button> }/>
            </div>
        </div>
        )}
        
        
    </div>
    </div>
  )
}

export default Address
