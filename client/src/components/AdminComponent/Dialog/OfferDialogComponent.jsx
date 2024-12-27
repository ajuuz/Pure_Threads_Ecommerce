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
import { updateProductOffer } from '@/api/Admin/productApi'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { updateCategoryOffer } from '@/api/Admin/categoryApi'
const OfferDialogComponent = ({content,offerScope,dialogTriggerer}) => {
    const [offerValue,setOfferValue] = useState(content?.offer?.offerValue);
    const [offerPrice,setOfferPrice] = useState(content?.regularPrice)
    const [priceError,setPriceError] = useState(null)
    const [offerType,setOfferType] = useState("%")
    const [open,setOpen] = useState(false);

    const handleOfferInputChange=(e)=>{
        setOfferValue(e.target.value)

        let calculatedOfferPrice=content?.regularPrice
        if(offerType==="Rs"){
            calculatedOfferPrice = content?.regularPrice - e.target.value;
            setOfferPrice(calculatedOfferPrice)
        }else{
            calculatedOfferPrice = content.regularPrice-content.regularPrice*e.target.value/100
            setOfferPrice(calculatedOfferPrice)
        }

        if(calculatedOfferPrice<0 && !priceError){
            setPriceError("price cannot be negative")
        }else{
            setPriceError(null)
        }
    }

    const handleOfferTypeClick=()=>{
      if(offerScope==="Product")
        {
          setOfferType((prev)=>prev==="%"?"Rs":"%")
        setOfferValue(0)
        setOfferPrice(content?.regularPrice)
        }
    }

    const handleSubmitButton=async()=>{
        try{
          let updateProductOfferResult;
          if(offerScope==="Product") updateProductOfferResult = await updateProductOffer(content?._id,offerValue,offerType,offerPrice);
          else updateProductOfferResult = await updateCategoryOffer(content?._id,offerValue,offerType);

          toast.success(updateProductOfferResult.message)
          setOpen(false)

           }catch(error){
            toast.error(error.message);
           }
    }

   

  return (
    <Dialog open={open} onOpenChange={setOpen}>
            
                    <DialogTrigger  asChild>{dialogTriggerer}</DialogTrigger>
                  
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update {offerScope} Offer</DialogTitle>
                <DialogDescription>
                  Make changes to your offer. Click the toggle button to change between flat off and percentage value
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="name"
                    onChange={handleOfferInputChange}
                    value={offerValue}
                    className="col-span-3 border-gray-500"
                  />
                    <Button onClick={handleOfferTypeClick} className="m-0">{offerType}</Button>
                </div>
                { offerScope==="Product" &&
                <>
                  <p className=' text-center max-w-fit bg-green-300 rounded-r-lg  text-sm font-semibold  p-2'>Offer Price :{offerPrice}</p>
                  {priceError
                    &&
                    <motion.div initial={{ x: "-3vw" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100vw" }}
                    transition={{ type: "spring", stiffness: 50 }}>
                    <p className=' text-center max-w-fit bg-red-300 rounded-r-lg  text-sm font-semibold  p-2'>{priceError}</p>
                    </motion.div>
                  }
                </>
                }
              </div>
              <DialogFooter>
                <Button onClick={handleSubmitButton} type="submit">Save Offer</Button>
              </DialogFooter>
            </DialogContent>
    </Dialog>
  )
}

export default OfferDialogComponent
