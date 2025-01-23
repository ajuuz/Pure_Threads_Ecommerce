import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { applyRefferal, closeReferralDialog } from '@/api/User/refferalApi'
import spinner from '../../../assets/Spin@1x-1.0s-200px-200px.svg'


const RefferalDialog = () => {
  const [loading,setLoading] = useState(false)
   const [open,setOpen] = useState(true)
   const [refferalCode,setRefferalCode]=useState("")


   const handleRefferalChange=(e)=>{
    setRefferalCode(e.target.value);
   }

const handleApplyRefferal=async()=>{
  try{
      setLoading(true);
      const applyRefferalResult=await applyRefferal(refferalCode);
      toast.success(applyRefferalResult.message);
      setOpen(false)
      setLoading(false)
    }catch(error){
      setLoading(false)
      toast.error(error.message)
  }
}

const handleCloseReferralDialog=async()=>{
  await closeReferralDialog();
  console.log("working")
  setOpen(false)
}
   

  return (
    <Dialog  open={open}>
    <DialogContent closeDialog={handleCloseReferralDialog} className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Claim Your Welcome Bonus!</DialogTitle>
        <DialogDescription>
        Have a referral code from your friend? Enter it below to instantly receive a reward of ₹200 in your wallet. 
        <br />
        <strong>Note:</strong> This exclusive offer is available only on your first login. Don't miss out!
        </DialogDescription>
      </DialogHeader>
      <Input placeHolder="xxxxxx" onChange={handleRefferalChange}/>
      <DialogFooter>
        <Button disabled={loading} onClick={handleApplyRefferal}>{loading?<img className='scale-50' src={spinner} alt="Loading..." />:"CLAIM NOW"}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  )
}

export default RefferalDialog
