import { getParticulartOrder } from '@/api/User/orderApi';
import NavBar from '@/components/UserComponent/NavBar/NavBar'
import SideBar from '@/components/UserComponent/SideBar/SideBar'
import AdminSideBar from '@/components/AdminComponent/SideBar';
import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const OrderDetail=()=> {
    // useState
    const [order,setOrder] = useState({});

    // router dom
    const {orderId} = useParams();
    const location = useLocation()
    const {from} = location.state ||null;

    useEffect(()=>{
        const fetchOrder = async()=>{
            try{
                const orderResult = await getParticulartOrder(orderId)
                setOrder(orderResult.order)
            }catch(error){
            }
        }
        fetchOrder();
    },[])

    const formatOrderDate = (isoDate) => {
        const date = new Date(isoDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      };

      const statusColor={
        Pending:"text-yellow-400",
        Success:"text-green-600",
        Failed:"text-gray-600",
        Refunded:"text-blue-600",
        Cancelled:"text-red-600"
      }

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

  return (
    <div className={`md:ps-[340px] ps-5 ${from==="admin" ?"pt-10" :"pt-32"} `}>
    {from!=="admin" && <NavBar/>}
    {from!=="admin"?<SideBar current="orders"/>:<AdminSideBar/>}
    <div className="p-6  min-h-screen">
      
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Order Header */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            Ordered on <span className="font-medium">{formatOrderDate(order.deliveryDate)}</span>
          </p>
          <h2 className="text-lg font-semibold text-gray-800">
            Order ID <span className='text-muted-foreground'>{order.orderId}</span>
          </h2>
        </div>

        {/* Order Information */}
        <div className="grid  lg:grid-cols-3 gap-6">
          {/* Shipping Address */}
          <div className='p-4 shadow-lg text-center'>
            <h3 className="font-medium text-gray-800 mb-2">Shipping Address</h3>
            <h2 className='font-bold'>{order.deliveryAddress?.name||"John Doe"}</h2>
            <p>{order.deliveryAddress?.buildingName||""}</p>
            <p className='truncate'>{`${order.deliveryAddress?.address||""},${order.deliveryAddress?.district||""}`}</p>
            <p>{`${order.deliveryAddress?.landMark||""},${order.deliveryAddress?.city||""}`}</p>
            <p>{order.deliveryAddress?.pinCode||null}</p>
            <p>{order.deliveryAddress?.state||""}</p>
          </div>

          {/* Payment Method */}
          <div className='p-4 shadow-lg text-center'>
            <h3 className="font-medium text-gray-800 mb-2">Payment Method</h3>
            <p className="text-sm text-gray-600">
              {order?.paymentMethod?"Cash On Delivery":order?.paymentMethod} <br />
              Status: <span className={`${statusColor[order?.paymentStatus]} font-medium`}>{order?.paymentStatus}</span>
            </p>
          </div>

          {/* Order Summary */}
          <div className='p-4 shadow-lg text-center'>
            <h3 className="font-medium text-gray-800 mb-2">Order Summary</h3>
            <p className="text-sm text-gray-600">
              Items Total: ₹{order?.totalAmount} <br />
              Total Discount: ₹0 <br />
              Shipping Charge: ₹0
            </p>
            <p className="mt-2 text-lg font-semibold text-gray-800">
              Grand Total: ₹{order?.totalAmount}
            </p>
          </div>
        </div>

        <hr className="my-6" />

        {/* Order Items */}
        <h3 className="font-medium text-gray-800 mb-4">Order Items</h3>
        <div className='flex flex-col gap-3 relative'>
        {order?.items?.map((item)=>
            <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                <img
                  src={item?.product?.images[0].url}
                  alt="Product"
                  className="w-16 object-cover rounded"
                />
                <div className="ml-4 flex-1">
                  <h4 className="font-medium text-gray-800">
                    {item?.product?.name}
                  </h4>
                    <p className="text-sm text-gray-600">
                      Quantity: {item?.quantity} x ₹{item?.product?.salesPrice}
                      <div className='flex justify-between '>
                          <p>Size:{" "}
                          <span className="text-blue-800 font-bold">{item?.size}</span>
                          </p>
                        
                      </div>
                    </p>
                </div>

                <div className=" ml-auto flex flex-col  font-semibold gap-5">
                  <p className='absolute right-0 top-10 rounded-tl-xl text-white px-3 bg-black'>₹{item?.quantity*item?.productPrice}</p>
                  <Badge className={`${getStatusColor(item?.status)} absolute right-0 top-0 rounded-t-none rounded-ee-none  text-sm`}>{item?.status}</Badge>  
                </div>
                
            </div>)}
        </div>

      </div>
    </div>
    </div>
  )
}

export default OrderDetail;