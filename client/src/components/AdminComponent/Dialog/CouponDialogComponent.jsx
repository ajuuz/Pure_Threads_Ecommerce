import { addNewCoupon } from "@/api/Admin/couponApi";
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
import { validateOtherForms } from "@/Utils/formValidation";
import { useState } from "react";
import { toast as reactToastify } from "react-toastify";
import { toast } from "sonner";

import { IoClose } from "react-icons/io5";

const  CouponDialogComponent=({dialogTriggerer,dialogHeader,dialogDescription})=> {

    const [open,setOpen] = useState(false);
    const [couponType,setCouponType] = useState("%");
    const [maxUsableLimitField,setMaxUsableLimitField] = useState(false)
    const [couponFormData,setCouponFormData] = useState({
        couponCode:"",
        couponValue:null,
        description:"",
        maxRedeemable:null,
        minimumOrderAmount:null,
        maxUsableLimit:"no limit",
        perUserLimit:null,
    })
    const handleCouponTypeClick=()=>setCouponType((prev)=>prev==="%"?"Rs":"%")
   
    const handleCouponFormData=(e)=>{
        setCouponFormData((prev)=>({...prev,[e.target.name]:e.target.value}));
    }

    const handleMaxUsableLimitField=()=>{
        setMaxUsableLimitField(prev=>!prev);
        setCouponFormData((prev)=>({...prev, maxUsableLimit:"no limit"}))
    }

    const handleCouponSubmit = async()=>{
        if(couponType==="Rs")
        {
            setCouponFormData((prev)=>({...prev,maxRedeemable:prev.couponValue}))
        }
        const validation = validateOtherForms(couponFormData)
        if(Object.values(validation).length>0)
        {
            for(let error in validation)
            {
                reactToastify.error(validation[error])
                return
            }
        }
        try{
            const addCouponResult = await addNewCoupon({...couponFormData,couponType});
            toast.success(addCouponResult?.message)
            setOpen(false)
        }
        catch(error){
            console.log(error)
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
        <div className="grid gap-6 py-4">
            <div className="relative grid grid-cols-4 items-center gap-4">
                <Input
                  id="couponValue"
                  type="number"
                  name="couponValue"
                  onChange={handleCouponFormData}
                  placeholder=" " // Empty placeholder for alignment
                  className="peer col-span-3 border-gray-200 placeholder-transparent focus:border-black focus:ring-2 focus:ring-black"
                />
                <label
                  htmlFor="couponValue"
                  className="absolute left-2 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black"
                >
                  Type Coupon Value
                </label>
                <Button onClick={handleCouponTypeClick} className="m-0">
                  {couponType}
                </Button>
            </div>
            <div className="grid gap-7 grid-cols-4">

                {couponType==="%" &&
                <div className="relative col-span-3">
                  <Input
                    id="maxRedeemable"
                    type="number"
                    name="maxRedeemable"
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
          <Button className="m-0" onClick={handleCouponSubmit} type="submit">{dialogTriggerer==="Add new Coupon"?"Add Coupon":"Update Coupon"}</Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}

export default CouponDialogComponent;