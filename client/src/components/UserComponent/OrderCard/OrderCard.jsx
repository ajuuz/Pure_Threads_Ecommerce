import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { CreditCard, Truck } from 'lucide-react'
import Modal from '@/components/AdminComponent/Modal/Modal'
import { Button } from '@/components/ui/button'
import { IoCash } from 'react-icons/io5'
import RazorPayButton from '@/components/CommonComponent/RazorPay/RazorPayButton'
import { toast } from 'sonner'
import { downloadInvoice, orderRepayment } from '@/api/User/orderApi'

const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': return 'bg-[#FFA600]'
        case 'Confirmed': return 'bg-[#007BFF]'
        case 'Shipped': return 'bg-[#28A745]'
        case 'Delivered': return 'bg-[#2dd251]'
        case 'Cancelled': return 'bg-[#b30009]'
      default: return 'bg-gray-500'
    }
  }

  const deliveryDateCalculator = (order) => {
    const deliveryDate=new Date(order?.deliveryDate);
    const orderStatus=order?.status;

    if(orderStatus==="Cancelled") return `Order Cancelled on ${formatDate(deliveryDate)}`
    else if(orderStatus==="Delivered") return `Order Delivered on ${formatDate(deliveryDate)}`
    // Ensure deliveryDate is a Date object
    const delivery = new Date(deliveryDate);
    const currentDate = new Date();

    // Calculate the difference in time (milliseconds)
    const timeDifference = delivery - currentDate;

    // Convert milliseconds to days (1 day = 86400000 ms)
    const daysLeftToDelivery = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return `Expected delivery in ${daysLeftToDelivery} days`;
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};





export const OrderCard = ({order,setOrders,index,handleCancelOrder,handleReturnOrder}) => {


    const isFailedOrder=order?.paymentStatus==="Failed"?true:false;
    const navigate=useNavigate()

    const handleRepayPayment=async(_,paymentDetails)=>{
        try{
            console.log(_,paymentDetails)
            const orderId=order?.orderId;
            let selectedCoupon=null;
            if(order.couponUsed.couponCode!=="No Coupon Used")
            {
               selectedCoupon={
                couponCode:order.couponUsed.couponCode,
                couponValue:order.couponUsed.couponValue,
                couponType:order.couponUsed.couponType
              }
            }
            const repaymentResult=await orderRepayment(orderId,selectedCoupon,paymentDetails);
            setOrders((prev)=>prev.filter((order)=>order.orderId!==orderId))
            toast.success(repaymentResult.message)
        }
        catch(error)
        {
            toast.error(error.message)
        }
    }

    const handleDownloadInvoice=async()=>{
      try{
        const orderId=order?.orderId;
        const response = await downloadInvoice(orderId)
      
            if (!response.ok) {
              throw new Error('Failed to download invoice');
            }
      
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'invoice.pdf'; // The file name
            document.body.appendChild(a);
            a.click();
            a.remove();
      }
      catch(error)
      {
        toast.error(error.message)
      }
    }

  return (
    <Card  key={order.orderId} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 ">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">{order.orderId}</h2>
                    <p className="text-sm text-gray-500">Ordered Date : {formatDate(order.createdAt)}</p>
                  </div>
                  <Badge  className={`${getStatusColor(order.status)} hover:${getStatusColor(order.status)}  text-white`}>{order.status}</Badge>
                  
                </div>
                <div onClick={()=>navigate(`/orders/${order?.orderId}`,{state:{from:"user"}})} className="flex items-center mb-4">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div className='relative'>
                      <div key={item?.product} className={`relative rounded-full overflow-hidden border-2 border-white w-16 h-16 ${index !== 0 ? '-ml-4' : ''}`} style={{zIndex: 3 - index}}>
                        <img
                          src={item?.productDetails?.images[0]?.url}
                          alt={item?.product?.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                        <div className='absolute top-[-2px] right-[-2px] bg-gray-900  h-6 w-6 flex justify-center items-center text-xs rounded-3xl' style={{zIndex:4,color:"white"}}>
                          {item?.size}
                        </div>
                    </div>  
                  ))}
        
                  {order?.items?.length > 3 && (
                    <div className="relative -ml-4 rounded-full bg-gray-200 w-16 h-16 flex items-center justify-center text-gray-600 font-semibold" style={{zIndex: 0}}>
                      +{order?.items?.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span>{order?.paymentMethod==="cod"?"Cash On Delivery":order?.paymentMethod==="razorpay"?"Online":"Wallet"}</span>
                  </div>
                  <div className="font-semibold">
                    Total: Rs{order.totalAmount.toFixed(2)}
                  </div>
                </div>
                <div className='flex justify-between'>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                        {!isFailedOrder?<Truck className="w-4 h-4" />:<IoCash className="w-4 h-4" />}
                        <span>{!isFailedOrder?deliveryDateCalculator(order):<span className='text-red-700'>Payment Failed</span>}</span>
                  </div>
                  <div>
                  {
                    !isFailedOrder
                    ?(
                        !["Shipped","Cancelled","Delivered","Return Requested","Returned"].includes(order?.status)
                        ?<div className='flex gap-4 items-center'>
                          <Button onClick={handleDownloadInvoice}>Download Invoice</Button>
                          <Modal handleClick={()=>handleCancelOrder(index,order?.orderId,order?.paymentMethod,order?.totalAmount)} type="button"   dialogTitle="Are you sure? Do you want to Cancel" dialogDescription="you cant revert this again" alertDialogTriggerrer={ <Button  className="bg-[#DC3545] hover:bg-[#DC3545] h-8">Cancel</Button> }/>
                        </div>
                        :order?.status==="Delivered"
                        ?
                        <div>
                          <Button onClick={handleDownloadInvoice}>Download Invoice</Button>
                          <Modal handleClick={()=>handleReturnOrder(index,order?.orderId)} type="button"   dialogTitle="Are you sure? Do you want to Return" dialogDescription="you cant revert this again" alertDialogTriggerrer={ <Button  className="bg-blue-500 hover:bg-blue-600 h-8">Return</Button> }/>
                        </div>
                        :""
                      )
                    :<RazorPayButton amount={order?.totalAmount} buttonContent="RePay Now"  functionAfterPayment={handleRepayPayment}/>
                  }
                  </div>
                </div>
              </CardContent>
            </Card>
  )
}

