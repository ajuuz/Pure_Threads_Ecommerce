import { addNewCoupon, editCoupon } from "@/api/Admin/couponApi";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast as reactToastify } from "react-toastify";
import { toast } from "sonner";

import { IoClose } from "react-icons/io5";

const  CouponDialogComponent=({dialogTriggerer,dialogHeader,dialogDescription,coupon})=> {
    const [open,setOpen] = useState(false);
    const [maxUsableLimitField,setMaxUsableLimitField] = useState(coupon?.maxUsableLimit)
    
    const couponDetails=coupon||{
      couponCode:"",
      couponValue:null,
      description:"",
      minimumOrderAmount:null,
      perUserLimit:null,
    }
    const type=coupon?.couponType||"%"
    
    const [couponFormData,setCouponFormData] = useState(couponDetails)
    const [couponType,setCouponType] = useState(type);

    const handleCouponTypeClick=()=>setCouponType((prev)=>prev==="%"?"Rs":"%")
   
    const handleMaxUsableLimitField=()=>{
        setMaxUsableLimitField(prev=>!prev);
        setCouponFormData((prev)=>{
            const {maxUsableLimit,...rest} = prev;
            return rest;
        })
    }

    const handleCouponFormData=(e)=>{
      if(e.target.name==="maxUsableLimit") setCouponFormData((prev)=>({...prev,maxUsableLimit:{isLimited:true,limit:e.target.value}}))
      else  setCouponFormData((prev)=>({...prev,[e.target.name]:e.target.value}));
  }

    //validation
    const couponValidation=()=>{
      const {couponCode,maxRedeemable,couponValue,description,minimumOrderAmount,perUserLimit,maxUsableLimit} = couponFormData;
      const couponErrors={}

      if (!couponValue || couponValue <= 0) couponErrors.couponValue = "Coupon Value must be greater than zero.";
      else if(couponType==="%" && couponValue>100) couponErrors.couponValue="Coupon Value in percentage must be between 0-100%"
      
      if (!maxRedeemable || maxRedeemable <= 0) couponErrors.maxRedeemable = "Max Redeemable Value must be greater than zero.";

       // Validate description
      if (!description.trim() ||description.length<=5) couponErrors.description = "Description must be more than 5 character long.";
        
      
      if(!couponCode.trim()) couponErrors.couponCode="CouponCode is required";
      else if(couponCode.length>10) couponErrors.couponCode="CouponCode must be less than 10 character allowed"
        
      if (!minimumOrderAmount || minimumOrderAmount <= 0) couponErrors.minimumOrderAmount = "Minimum Order Amount must be greater than zero.";

      if(maxUsableLimitField && !maxUsableLimit ||  maxUsableLimit<=0) couponErrors.maxUsableLimit="Max Usable Limit must be greated than zero."

      if (!perUserLimit || perUserLimit <= 0) couponErrors.perUserLimit = "Per user limit must be greater than zero.";
     
      return couponErrors;
    }

    const handleAddCoupon = async()=>{
        let newCoupon = couponFormData;
        if(couponType==="Rs")
        {
            newCoupon.maxRedeemable=couponFormData.couponValue;
        }
        const validationErrors = Object.values(couponValidation(newCoupon))
        if(validationErrors.length>0){
          for(let error of validationErrors)
          {
            reactToastify.error(error)
            return 
          }
        }

        try{
            const addCouponResult = await addNewCoupon({...newCoupon,couponType});
            toast.success(addCouponResult?.message)
            setOpen(false)
        }
        catch(error){
            toast.error(error.message);
        }
    }

    const handleUpdateCoupon=async()=>{
      let newCoupon = couponFormData;
        if(couponType==="Rs") newCoupon.maxRedeemable=couponFormData.couponValue;

        const validationErrors = Object.values(couponValidation(newCoupon))
        if(validationErrors.length>0){
          for(let error of validationErrors){
            reactToastify.error(error)
            return 
          }}
        newCoupon.couponType=couponType
        try{
          const editCouponResult = await editCoupon({...newCoupon});
          toast.success(editCouponResult?.message)
          setOpen(false)
      }
      catch(error){
          toast.error(error.message);
      }
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="m-0 bg-black text-white hover:bg-black hover:text-white h-10" variant="outline">{dialogTriggerer}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogHeader}</DialogTitle>
          <DialogDescription>
           {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="relative grid grid-cols-4  gap-4">
                <Input
                  id="couponValue"
                  type="number"
                  name="couponValue"
                  value={couponFormData.couponValue}
                  onChange={handleCouponFormData}
                  placeholder=" " // Empty placeholder for alignment
                  className="peer col-span-3 border-gray-200 placeholder-transparent focus:border-black focus:ring-2 focus:ring-black"
                  />
                <label
                  htmlFor="couponValue"
                  className="text-gray-500 peer-placeholder-shown:text-gray-400 absolute left-2 -top-3.5  text-sm transition-all peer-placeholder-shown:top-2  peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black"
                  >
                  Enter Coupon Value
                </label>
                <Button onClick={handleCouponTypeClick} className="m-0">
                  {couponType}
                </Button>
            </div>
            <div className="grid gap-4 grid-cols-4">

                {couponType==="%" &&
                <div className="relative col-span-3">
                  <Input
                    id="maxRedeemable"
                    type="number"
                    name="maxRedeemable"
                    value={couponFormData.maxRedeemable}
                    onChange={handleCouponFormData}
                    placeholder=" " // Empty placeholder for alignment
                    className="peer w-full placeholder-transparent focus:border-black focus:ring-2 focus:ring-black"
                    />
                  <label
                    htmlFor="maxRedeemable"
                    className="absolute left-2 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black"
                    >
                    Max Redeemable Amount
                  </label>
                </div>
                }

                <div className="relative col-span-3">
                  <textarea
                    id="description"
                    type="number"
                    name="description"
                    value={couponFormData.description}
                    onChange={handleCouponFormData}
                    placeholder=" " // Empty placeholder for alignment
                    className="peer w-full border border-gray-200 rounded placeholder-transparent focus:border-black focus:ring-2 focus:ring-black"
                  />
                  <label
                    htmlFor="description"
                    className="absolute left-2 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black"
                    >
                    write about the coupon
                  </label>
                </div>

                <div className="relative col-span-3">
                  <Input
                    id="couponCode"
                    name="couponCode"
                    value={couponFormData.couponCode}
                    onChange={handleCouponFormData}
                    placeholder=" " // Empty placeholder for alignment
                    className="peer w-full placeholder-transparent focus:border-black focus:ring-2 focus:ring-black"
                  />
                  <label
                    htmlFor="couponCode"
                    className="absolute left-2 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black"
                    >
                    Type Coupon Code
                  </label>
                </div>

                <div className="relative col-span-3">
                  <Input
                    id="minimumOrderAmount"
                    type="number"
                    name="minimumOrderAmount"
                    value={couponFormData.minimumOrderAmount}
                    onChange={handleCouponFormData}
                    placeholder=" " // Empty placeholder for alignment
                    className="peer w-full placeholder-transparent focus:border-black focus:ring-2 focus:ring-black"
                    />
                  <label
                    htmlFor="minimumOrderAmount"
                    className="absolute left-2 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black"
                  >
                    Enter Minimum Order Amount
                  </label>
                </div>

                { !maxUsableLimitField &&
                    <Button onClick={handleMaxUsableLimitField} className="col-span-3 m-0">add a max usable limit for coupon</Button>
                }

                {maxUsableLimitField &&
                    <>
                    <div className="relative col-span-3">
                      <Input
                        id="maxUsableLimit"
                        type="number"
                        name="maxUsableLimit"
                        value={couponFormData?.maxUsableLimit?.limit}
                        onChange={handleCouponFormData}
                        placeholder=" " // Empty placeholder for alignment
                        className="peer w-full placeholder-transparent focus:border-black focus:ring-2 focus:ring-black"
                        />
                      <label
                        htmlFor="maxUsableLimit"
                        className="absolute left-2 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black"
                      >
                        Enter the Max usable limit
                      </label>
                    </div>
                    <div className="flex items-center">
                    <div className="flex items-center bg-black text-white w-fit h-fit p-1  rounded-3xl">
                        <IoClose onClick={handleMaxUsableLimitField} className="font-bold"/>
                    </div>
                    </div>
                    </>
                }

                <div className="relative col-span-3">
                  <Input
                    id="perUserLimit"
                    type="number"
                    name="perUserLimit"
                    value={couponFormData.perUserLimit}
                    onChange={handleCouponFormData}
                    placeholder=" " // Empty placeholder for alignment
                    className="peer w-full placeholder-transparent focus:border-black focus:ring-2 focus:ring-black"
                    />
                  <label
                    htmlFor="perUserLimit"
                    className="absolute left-2 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black"
                  >
                    Enter the per User usable limit
                  </label>
                </div>
            </div>
         </div>
        <DialogFooter>
          <Button className="m-0" onClick={dialogTriggerer==="Add new Coupon"?()=>handleAddCoupon():()=>handleUpdateCoupon()} type="submit">{dialogTriggerer==="Add new Coupon"?"Add Coupon":"Update Coupon"}</Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}

export default CouponDialogComponent;