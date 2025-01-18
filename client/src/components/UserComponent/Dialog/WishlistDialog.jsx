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
import { toast } from 'sonner'
import { addMoneyToWallet } from '@/api/User/walletApi'
import { addToCart } from '@/api/User/cartApi'


const WishlistDialog = ({product,dialogTriggerer,dialogTitle,dialogDescription,setRefresh}) => {
   const [selectedSize,setSelectedSize]= useState(null)

     const handleAddToCart=async()=>{
            if(selectedSize===null) return toast.warning("select a size to continue")
            try{
                const addingToCartResult = await addToCart(product?._id,selectedSize);
                toast.success(addingToCartResult.message)
            }
            catch(error)
            {
                if(error.statusCode===422) return toast.info(error.message)
                toast.warning(error.message)
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
      <div className='flex gap-4'>
                    {product?.sizes.map((size,index)=>(
                        <div onClick={()=>setSelectedSize(index)} key={size?.size} className={`w-16 text-center py-2 border-2 rounded-md ${selectedSize===index && "bg-black text-white border-2 border-black"} ${size?.stock<1 && `bg-muted border-none text-muted-foreground`} `}>{size.size}</div>
                    ))}
      </div>
      <DialogFooter>
        <Button onClick={handleAddToCart}>ADD TO CART</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  )
}

export default WishlistDialog
