'use client'

import { Ticket } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button';

export const CouponCardType1=({coupon})=>{
  const {couponCode,
    couponType,
    couponValue,
    description,
    maxRedeemable,
    minimumOrderAmount,
    maxUsableLimit,
    perUserLimit}=coupon;

  return (
    <div className="relative max-w-md mx-auto ">
      <Card className="relative bg-white overflow-hidden">
        {/* Decorative edges */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gray-700 flex flex-col justify-between py-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 w-4 bg-white rounded-full translate-x-2" />
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gray-700 flex flex-col justify-between py-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 w-4 bg-white rounded-full -translate-x-2" />
          ))}
        </div>
        
        {/* Content */}
        <div className="px-12 py-6">
          <div className="flex items-center justify-between mb-4">
            <Ticket className="h-6 w-6 text-black" />
            <div className="text-sm text-gray-500">Code: {couponCode}</div>
          </div>
          
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              SAVE {couponValue}
            </h2>
            <p className="text-gray-600">{description}</p>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600 border-t pt-4">
            <div className="flex justify-between gap-5">
              <span>Maximum Redeemable:</span>
              <span className="font-medium">Rs. {maxRedeemable}</span>
            </div>
            <div className="flex justify-between">
              <span>Minimum Purchase:</span>
              <span className="font-medium">Rs. {minimumOrderAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Usage Limit:</span>
              <span className="font-medium">{maxUsableLimit}</span>
            </div>
            <div className="flex justify-between">
              <span>Per User Limit:</span>
              <span className="font-medium">{perUserLimit}</span>
            </div>
          </div>
          
          <button 
            onClick={() => navigator.clipboard.writeText(couponCode)}
            className="mt-6 w-full bg-gray-700 text-white py-2 rounded-md  transition-colors"
          >
            Copy Code
          </button>
        </div>
      </Card>
    </div>
  )
}



export const CouponCardType2 = ({coupon})=>{
  return(
    <div className='bg-white  rounded-md border py-5 flex items-center'>
      

      {/*inner content  */}
      <div className='flex-1 px-5 flex flex-col'>
        <div className='flex flex-col gap-4 pb-4'>
          <div className='flex justify-between'>
            <div className='flex flex-col gap-2'>
            <Ticket/>
            <p className='font-bold border-2  py-2 px-3 border-dashed bg-slate-100 rounded-md text-lg text-muted-foreground'>{coupon?.couponCode}</p>
            </div>
          <Button className="w-fit  m-0">APPLY</Button>

          </div>
          <div className='flex'>
            <h2 className='flex-1 text-3xl font-bold font-serif'>SAVE 20</h2>
            <div className=' text-center font-medium'>{coupon?.description}</div>
          </div>
        </div>

      {
        
      }
        <div className='py-5 relative flex items-center'>
          <div className='absolute h-8 w-8 border-r-2 rounded-3xl -translate-x-10 bg-slate-100'></div>
           <div className='absolute right-0 bg-slate-100 border-l-2 h-8 w-8 rounded-3xl translate-x-10'>
           </div> 
           <div  className='h-[50%] w-full border-dashed border-2'></div>
        </div>

        <div className='grid gap-3'>
          <div className='grid gap-1'>
            <p className='flex justify-between'><span>Maximum Redeemable:</span> <span>{coupon?.maxRedeemable}</span></p>
            <p className='flex justify-between'><span>Minimum Purchase:</span> <span>{coupon?.minimumOrderAmount}</span></p>
            <p className='flex justify-between'><span>Usage Limit:</span> <span>{coupon?.maxUsableLimit}</span></p>
            <p className='flex justify-between'><span>Per User Limit:</span> <span>{coupon?.perUserLimit}</span></p>
          </div>
        </div>

      </div>

     
  </div>
  )
}