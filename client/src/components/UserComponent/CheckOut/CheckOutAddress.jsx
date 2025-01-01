import React from 'react'

import { FaCircleCheck } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa"; 
import { Button } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

const CheckOutAddress = ({addresses,selectedAddressIndex,setSelectedAddressIndex}) => {

const navigate = useNavigate()

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Choose Delivery Point</h2>

    {/* Add New Address */}
            <div className='p-6 mb-5  shadow-[rgba(0,0,0,0.1)_0px_1px_30px_1px] rounded-xl flex flex-col gap-2 justify-center items-center'>
                <div onClick={()=>navigate('/address/add',{ state: { from: '/checkout'}})} className='bg-black text-white p-2 rounded-3xl '>
                    <FaPlus className='text-3xl'/>
                </div>
                <p className='text-muted-foreground font-semibold text-xs'>ADD NEW ADDRESS</p>
              </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Delivery Address Card */}
              {addresses.map((address, index) => (
                <div
                  key={address._id}
                  className={`border rounded-lg p-4 ${selectedAddressIndex===index ? "bg-black text-white" : ""}`}
                >
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">{address.name}</h3>
                    <button className="text-gray-500 hover:text-gray-700">
                      <span  onClick={()=>navigate(`/address/manage/${address._id}`,{ state: { from: '/checkout'}})} className="material-icons text-gray-400">Edit</span>
                    </button>
                  </div>
                  <p>{address?.buildingName?address.buildingName:""}</p>
                  <p className='truncate'>{`${address?.address?address?.address:""},${address?.district?address?.district:""}`}</p>
                  <p>{`${address?.landMark?address.landMark:""},${address?.city?address?.city:""}`}</p>
                  <p>{address?.pinCode?address.pinCode:null}</p>
                  <p>{address?.state?address.state:""}</p>
                  <Button onClick={()=>setSelectedAddressIndex(index)}  className={`w-full py-2 mt-4 rounded-md bg-black text-white`}>
                    {selectedAddressIndex===index ?<p className='flex items-center gap-2 justify-center'>Selected<FaCircleCheck/></p>:"Deliver Here"}
                  </Button>
                </div>
              ))}

              
            </div>
            
    </div>
  )
}

export default CheckOutAddress
