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

const  CouponDialogComponent=({dialogTriggerer,dialogHeader,dialogDescription})=> {

    const [open,setOpen] = useState(false);
    const [couponType,setCouponType] = useState("%");
    const [couponValue,setCouponValue] = useState(null)
    const [maxRedeemable,setMaxRedeemable] = useState(null)
    const [couponCode,setCouponCode] = useState("")
    const [minimumAmount,setMinimumAmount] = useState(null)

    const handleCouponValueChange=(e)=>setCouponValue(e.target.value)
    const handleCouponTypeClick=()=>setCouponType((prev)=>prev==="%"?"Rs":"%")
    const handleMaxRedeemableChange=(e)=>setMaxRedeemable(e.target.value)
    const handleCouponCodeChange=(e)=>setCouponCode(e.target.value)
    const handleMinimumAmountChange=(e)=>setMinimumAmount(e.target.value);

    const handleCouponSubmit = async()=>{
        
        const validation = validateOtherForms({couponValue,maxRedeemable,couponCode,minimumAmount})
        if(Object.values(validation).length>0)
        {
            for(let error in validation)
            {
                reactToastify.error(validation[error])
                return
            }
        }
        try{
            const addCouponResult = await addNewCoupon(couponValue,couponType,maxRedeemable,couponCode,minimumAmount);
            toast.success(addCouponResult?.message)
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
        <div className="grid gap-6 py-4">
            <div className="relative grid grid-cols-4 items-center gap-4">
                <Input
                  id="couponValue"
                  type="number"
                  name="couponValue"
                  onChange={handleCouponValueChange}
                  placeholder=" " // Empty placeholder for alignment
                  className="peer col-span-3 border-gray-500 placeholder-transparent focus:border-black focus:ring-2 focus:ring-black"
                />
                <label
                  htmlFor="couponValue"
                  className="absolute left-2 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black"
                >
                  Type Offer Value
                </label>
                <Button onClick={handleCouponTypeClick} className="m-0">
                  {couponType}
                </Button>
            </div>
            <div className="grid gap-7 grid-cols-4">
                <div className="relative col-span-3">
                  <Input
                    id="maxRedeemable"
                    type="number"
                    name="maxRedeemable"
                    onChange={handleMaxRedeemableChange}
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

                <div className="relative col-span-3">
                  <Input
                    id="couponCode"
                    name="couponCode"
                    onChange={handleCouponCodeChange}
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
                    id="TotalOrderAmount"
                    type="number"
                    name="TotalOrderAmount"
                    onChange={handleMinimumAmountChange}
                    placeholder=" " // Empty placeholder for alignment
                    className="peer w-full placeholder-transparent focus:border-black focus:ring-2 focus:ring-black"
                    />
                  <label
                    htmlFor="TotalOrderAmount"
                    className="absolute left-2 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black"
                  >
                    Enter Minimum Order Amount
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