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
const SalesChartDialog = ({dialogTriggerer,criteria,setYear,setCriteria}) => {
    const [open,setOpen]=useState(false)
    const handleSelectYear=(year)=>{
        setCriteria(criteria)
        setYear(year)
        setOpen(false)
    }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        {dialogTriggerer}
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Select Year</DialogTitle>
        <DialogDescription>
            Select the year to continue
        </DialogDescription>
      </DialogHeader>

        <div className='grid grid-cols-2 gap-3'>
            <Button onClick={()=>handleSelectYear("2022")} type="submit">2022</Button>
            <Button onClick={()=>handleSelectYear("2023")} type="submit">2023</Button>
            <Button onClick={()=>handleSelectYear("2024")} type="submit">2024</Button>
            <Button onClick={()=>handleSelectYear("2025")} type="submit">2025</Button>
        </div>
    </DialogContent>
  </Dialog>
  )
}

export default SalesChartDialog
