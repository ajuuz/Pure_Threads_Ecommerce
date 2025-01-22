
import NavBar from '@/components/UserComponent/NavBar/NavBar'
import { useEffect, useState } from 'react'
import SideBar from '@/components/UserComponent/SideBar/SideBar'
import { cancelOrder, getOrders, returnOrder } from '@/api/User/orderApi'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Modal from '@/components/AdminComponent/Modal/Modal'
import { useLocation, useNavigate } from 'react-router-dom'
import PaginationComponent from '@/components/CommonComponent/PaginationComponent'
import {OrderCard} from '@/components/UserComponent/OrderCard/OrderCard'
import { getFailedOrders } from '@/api/User/failedOrderApi'
import { Badge } from '@/components/ui/badge'


const Orders = () => {

  const location = useLocation();
  const {orderStatus}=location.state||"success"
 
  const [orders,setOrders] = useState([])
  const [sort,setSort] = useState({createdAt:-1})
  const [currentPage,setCurrentPage]=useState(1);
  const [numberOfPages,setNumberOfPages]=useState(1);
  const [failedOrdersCount,setFailedOrdersCount]=useState(0);
  const [ordersCount,setOrdersCount]=useState(0);
  const [status,setStatus]=useState(orderStatus)
  const navigate = useNavigate()


  useEffect(()=>{
    const fetchOrders = async ()=>{
      const limit=5;
      const sortCriteria=JSON.stringify(sort)
      
      let ordersResult;
      ordersResult = await getOrders(sortCriteria,currentPage,limit,status);
      console.log(ordersResult?.failedOrdersCount)
      setOrders(ordersResult.orders)
      setFailedOrdersCount(ordersResult?.failedOrdersCount)
      setOrdersCount(ordersResult?.ordersCount)
      setNumberOfPages(ordersResult?.numberOfPages)
    }
    fetchOrders();
  },[currentPage,status])


  const handleCancelOrder=async(index,orderId,paymentMethod,totalAmount)=>{
    try{
      let isPaymentDone=false;
      if(["razorpay","wallet"].includes(paymentMethod)){
        isPaymentDone=true;
      }
      const cancelOrderResult = await cancelOrder(orderId,isPaymentDone,totalAmount);
      const updatedOrderArray = [...orders];
      updatedOrderArray[index].status="Cancelled";
      updatedOrderArray[index].deliveryDate=new Date()
      setOrders(updatedOrderArray)
      toast.success(cancelOrderResult.message)
    }
    catch(error){
      toast.error(error.message)
    }
  }

  const handleReturnOrder=async(index,orderId)=>{
    try{
      const retrunOrderResult = await returnOrder(orderId);
      const updatedOrderArray = [...orders];
      updatedOrderArray[index].status="Return Requested";
      setOrders(updatedOrderArray)
      toast.success(retrunOrderResult.message)
    }
    catch(error){
      toast.error(error.message)
    }
  }



  return (
    <div className='md:ps-[340px] ps-5  pt-32'>
    <NavBar/>
    <SideBar current="order"/>
    <div className="min-h-screen pe-8">
      <div className="max-w-3xl mx-auto">
        <div className='flex justify-between'>
          <h1 onClick={()=>console.log(orderStatus)} className="text-3xl text-nowrap font-bold text-gray-900 mb-8">{status==="success"?`My Orders (${ordersCount})`:`Payment Failed Orders (${failedOrdersCount})`}</h1>
          <Button 
            onClick={status!=="failed"?()=>setStatus("failed"):()=>setStatus("success")} 
            className="m-0 w-fit relative">
              {status!=="failed" && <Badge className="absolute -top-3 -right-3 rounded-3xl py-1 bg-slate-500">{failedOrdersCount}</Badge>}
            {status!=="failed"?"Go to your Payment Failed Orders":"Go Back to Orders"}
          </Button>
        </div>
        <div className="space-y-6  ">
          {orders.map((order,index) => (
              <OrderCard order={order} orders={orders} setOrders={setOrders} index={index} handleCancelOrder={handleCancelOrder} handleReturnOrder={handleReturnOrder}/>
          ))}
        </div>
        
      </div>
       <PaginationComponent currentPage={currentPage} numberOfPages={numberOfPages} setCurrentPage={setCurrentPage}/>
    </div>
    </div>
  )
}

export default Orders



// <Card  key={order.orderId} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 ">
            //   <CardContent className="p-6">
            //     <div className="flex justify-between items-center mb-4">
            //       <div>
            //         <h2 className="text-lg font-semibold">{order.orderId}</h2>
            //         <p className="text-sm text-gray-500">Ordered Date : {formatDate(order.createdAt)}</p>
            //       </div>
            //       <Badge  className={`${getStatusColor(order.status)} hover:${getStatusColor(order.status)}  text-white`}>{order.status}</Badge>
            //     </div>
            //     <div onClick={()=>navigate(`/orders/${order?.orderId}`,{state:{from:"user"}})} className="flex items-center mb-4">
            //       {order.items.slice(0, 3).map((item, index) => (
            //         <div className='relative'>
            //           <div key={item?.product} className={`relative rounded-full overflow-hidden border-2 border-white w-16 h-16 ${index !== 0 ? '-ml-4' : ''}`} style={{zIndex: 3 - index}}>
            //             <img
            //               src={item?.productDetails?.images[0]?.url}
            //               alt={item?.product?.name}
            //               layout="fill"
            //               objectFit="cover"
            //             />
            //           </div>
            //             <div className='absolute top-[-2px] right-[-2px] bg-gray-900  h-6 w-6 flex justify-center items-center text-xs rounded-3xl' style={{zIndex:4,color:"white"}}>
            //               {item?.size}
            //             </div>
            //         </div>  
            //       ))}
        
            //       {order?.items?.length > 3 && (
            //         <div className="relative -ml-4 rounded-full bg-gray-200 w-16 h-16 flex items-center justify-center text-gray-600 font-semibold" style={{zIndex: 0}}>
            //           +{order?.items?.length - 3}
            //         </div>
            //       )}
            //     </div>
            //     <div className="flex justify-between items-center text-sm">
            //       <div className="flex items-center gap-2">
            //         <CreditCard className="w-4 h-4 text-gray-500" />
            //         <span>{order?.paymentMethod==="cod"?"Cash On Delivery":order?.paymentMethod}</span>
            //       </div>
            //       <div className="font-semibold">
            //         Total: Rs{order.totalAmount.toFixed(2)}
            //       </div>
            //     </div>
            //     <div className='flex justify-between'>
            //       <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            //         <Truck className="w-4 h-4" />
            //         <span>{deliveryDateCalculator(order)}</span>
            //       </div>
            //       <div>
            //       {
            //       !["Shipped","Cancelled","Delivered","Return Requested","Returned"].includes(order?.status)
            //       ?<Modal handleClick={()=>handleCancelOrder(index,order?.orderId,order?.paymentMethod,order?.totalAmount)} type="button"   dialogTitle="Are you sure? Do you want to Cancel" dialogDescription="you cant revert this again" alertDialogTriggerrer={ <Button  className="bg-[#DC3545] hover:bg-[#DC3545] h-8">Cancel</Button> }/>
            //       :order?.status==="Delivered"
            //       ?<Modal handleClick={()=>handleReturnOrder(index,order?.orderId)} type="button"   dialogTitle="Are you sure? Do you want to Return" dialogDescription="you cant revert this again" alertDialogTriggerrer={ <Button  className="bg-blue-500 hover:bg-blue-600 h-8">Return</Button> }/>
            //       :""
            //       }
            //       </div>
            //     </div>
            //   </CardContent>
            // </Card>