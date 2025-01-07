import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaIndianRupeeSign } from 'react-icons/fa6'
import { toast } from 'sonner'
import { addMoneyToWallet } from '@/api/User/walletApi'
import RazorPayButton from '@/components/CommonComponent/RazorPay/RazorPayButton'


const WalletDialog = ({dialogTriggerer,dialogTitle,dialogDescription,setRefresh}) => {
    const [amount,setAmount] = useState("1000");
    const [description,setDescription] = useState("")
    const [error,setError] = useState({amount:"",description:""})

    const selectAmountDivStyle="h-10 rounded-lg border-2 col-span-2 flex items-center justify-center font-semibold text-xs bg-gradient-to-r hover:from-gray-800 hover:text-white  hover:via-black hover:to-gray-800 focus:ring-2 focus:ring-gray-600 shadow-lg transition-transform transform hover:scale-105 active:scale-95"


    const handleAmountChange=(e)=>{
        if((e.target.value).trim()==="")
        {
            setError((prev)=>({...prev,amount:""}))
        }
        setAmount(e.target.value)
    }

    const handleDescriptionChange=(e)=>{
        if(e.target.value!==null && e.target.value!=="")
            {
                setError((prev)=>({...prev,description:""}))
            }
        setDescription(e.target.value)
    }

    const handleAddMoneyToWallet=async()=>{
       
        try{
            const addMoneyToWalletResult = await addMoneyToWallet(amount,description);
            setRefresh(true)
            toast.success(addMoneyToWalletResult?.message)
        }
        catch(error)
        {
            toast.error(error.message)
        }
    }

    const preValidationFunction=()=>{
        if(!amount.trim()){
             setError((prev)=>({...prev,amount:"enter Amount to add"}))
             return true
        }
        else if(!description.trim()){
             setError((prev)=>({...prev,description:"enter a description for your transaction"}))
             return true
        }
    }

  return (
    <Dialog>
    <DialogTrigger asChild>
      {dialogTriggerer}
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogDescription>
            {dialogDescription}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">

        <div>
            <p className='text-center text-red-700 font-semibold text-sm'>{error?.amount && error?.amount}</p>
            <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-nowrap col-span-1">
                    Enter Amount
                  </Label>
                  <div className='col-span-3 relative'>
                  <FaIndianRupeeSign className='absolute top-[11px] left-2 scale-[0.89]'/>
                    <Input
                      id="amount"
                      onChange={handleAmountChange}
                      value={amount}
                      className={`ps-6 w-full font-semibold ${error.amount?"border-red-600 bg-red-50":"border-black"} border-2`}
                      />
                </div>
            </div>
        </div>

        <div className='grid gap-2  grid-cols-4'>
            <div onClick={()=>setAmount("500")} className={selectAmountDivStyle}><FaIndianRupeeSign/><span className='text-[15px]'>500</span></div>
            <div onClick={()=>setAmount("1000")} className={selectAmountDivStyle}><FaIndianRupeeSign/><span className='text-[15px]'>1000</span></div>
            <div onClick={()=>setAmount("2000")} className={selectAmountDivStyle}><FaIndianRupeeSign/><span className='text-[15px]'>2000</span></div>
            <div onClick={()=>setAmount("5000")} className={selectAmountDivStyle}><FaIndianRupeeSign/><span className='text-[15px]'>5000</span></div>
            <div onClick={()=>setAmount("10000")} className={`${selectAmountDivStyle} col-span-4`}><FaIndianRupeeSign/><span className='text-[15px]'>10000</span></div>
        </div>
        <div>
            <p className=' text-red-700 font-semibold text-sm'>{error?.description && error?.description}</p>
            <textarea onChange={handleDescriptionChange} className={`w-full border-2 rounded-lg text-xs p-2 font-semibold' ${error?.description?"border-red-600 bg-red-50":""}`} placeholder='give a description...'/>
        </div>
      </div>
      <DialogFooter>
        <RazorPayButton amount={amount} functionAfterPayment={handleAddMoneyToWallet} buttonContent="ADD AMOUNT" preValidationFunction={preValidationFunction}/>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  )
}

export default WalletDialog
