
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



