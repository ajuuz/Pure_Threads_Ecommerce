
import NavBar from '@/components/UserComponent/NavBar/NavBar'
import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, CreditCard } from 'lucide-react'
import SideBar from '@/components/UserComponent/SideBar/SideBar'
import { cancelOrder, getOrders } from '@/api/User/orderApi'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Modal from '@/components/AdminComponent/Modal/Modal'
import { useNavigate } from 'react-router-dom'


const Orders = () => {

  const [orders,setOrders] = useState([])
  const navigate = useNavigate()


  useEffect(()=>{

    const fetchOrders = async ()=>{
      const ordersResult = await getOrders();
      setOrders(ordersResult.orders);
      console.log(ordersResult.orders)
    }
    fetchOrders();
  },[])


  const handleCancelOrder=async(index,orderId)=>{
    try{
      console.log(orderId)
      const cancelOrderResult = await cancelOrder(orderId);
      const updatedOrderArray = [...orders];
      updatedOrderArray[index].status="cancelled";
      setOrders(updatedOrderArray)
      toast.success(cancelOrderResult.message)
    }
    catch(error){
      toast.error(error.message)
    }
  }


  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-[#FFA600]'
      case 'shipped': return 'bg-[#28A745]'
      case 'delivered': return 'bg-[#007BFF]'
      case 'cancelled': return 'bg-[#DC3545]'
      default: return 'bg-gray-500'
    }
  }



  const deliveryDateCalculator = (deliveryDate) => {
    // Ensure deliveryDate is a Date object
    const delivery = new Date(deliveryDate);
    const currentDate = new Date();

    // Calculate the difference in time (milliseconds)
    const timeDifference = delivery - currentDate;

    // Convert milliseconds to days (1 day = 86400000 ms)
    const daysLeftToDelivery = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysLeftToDelivery;
};

const formatOrderDate = (isoDate) => {
  const date = new Date(isoDate);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};


  return (
    <div className='md:ps-[340px] ps-5  pt-32'>
    <NavBar/>
    <SideBar current="order"/>
    <div className="min-h-screen pe-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        <div className="space-y-6  ">
          {orders.map((order,index) => (
            <Card  key={order.orderId} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 ">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">{order.orderId}</h2>
                    <p className="text-sm text-gray-500">Ordered Date : {formatOrderDate(order.createdAt)}</p>
                  </div>
                  <Badge  className={`${getStatusColor(order.status)} hover:${getStatusColor(order.status)}  text-white`}>{order.status}</Badge>
                </div>
                <div onClick={()=>navigate(`/orders/${order?.orderId}`,{state:{from:"user"}})} className="flex items-center mb-4">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div className='relative'>
                      <div key={item?._id} className={`relative rounded-full overflow-hidden border-2 border-white w-16 h-16 ${index !== 0 ? '-ml-4' : ''}`} style={{zIndex: 3 - index}}>
                        <img
                          src={item?.product?.images[0]?.url}
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
                    <span>{order?.paymentMethod==="cod"?"Cash On Delivery":order?.paymentMethod}</span>
                  </div>
                  <div className="font-semibold">
                    Total: Rs{order.totalAmount.toFixed(2)}
                  </div>
                </div>
                <div className='flex justify-between'>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <Truck className="w-4 h-4" />
                    <span>Estimated delivery in {deliveryDateCalculator(order?.deliveryDate)} days</span>
                  </div>
                  {order?.status!=="cancelled"
                   &&
                  <div>
                     <Modal handleClick={()=>handleCancelOrder(index,order?.orderId)} type="button"   dialogTitle="are you sure" dialogDescription="you can list again" alertDialogTriggerrer={ <Button  className="bg-[#DC3545] hover:bg-[#DC3545] h-8">Cancel</Button> }/>
                    
                  </div>
                  }
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}

export default Orders
