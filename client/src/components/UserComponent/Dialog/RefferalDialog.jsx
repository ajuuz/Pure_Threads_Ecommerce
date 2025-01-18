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


const RefferalDialog = ({dialogTriggerer,dialogTitle,dialogDescription}) => {
   const [open,setOpen] = useState(true)
   const [refferalCode,setRefferalCode]=useState("")

   const handleRefferalChange=(e)=>{
    setRefferalCode(e.target.value);
   }

   const handleRefferalSubmit=async()=>{
        try{
            const refferalSubmitResult=await refferalSubmit()
            toast.success(refferalSubmitResult.message);
        }catch(error)
        {
            toast.error(error.message);
        }
   }

   

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogDescription>
            {dialogDescription}
            <br/>
            Note: This Oppertunity only for this first login.
        </DialogDescription>
      </DialogHeader>
      <Input onChange={handleRefferalChange}/>
      <DialogFooter>
        <Button onClick={handleRefferalSubmit}>SUBMIT</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  )
}

export default RefferalDialog
