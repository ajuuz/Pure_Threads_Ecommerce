import React, { useEffect, useState } from 'react'

//icons
import { CiSearch } from 'react-icons/ci'

//components
import TableComponent from '@/components/AdminComponent/Table/TableCompnent';
import SideBar from '@/components/AdminComponent/SideBar'

// toaster
import { toast } from 'sonner';

// apis
import { confirmReturnOrder, getAllOrders, updateOrderStatus } from '@/api/Admin/orderApi';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Modal from '@/components/AdminComponent/Modal/Modal';
import PaginationComponent from '@/components/CommonComponent/PaginationComponent';


const Orders = () => {
    // useState
    const [orders,setOrders] = useState([]);
    const [currentPage,setCurrentPage]=useState(1);
    const [numberOfPages,setNumberOfPages] = useState(1)
    const [sort,setSort] = useState({createdAt:-1})
    const [tab,setTab]=useState("successOrders")
    // router dom
    const navigate = useNavigate()

    const formatOrderDate = (isoDate) => {
        const date = new Date(isoDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      };
      
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

      const statusButton = (status)=>{
        switch (status) {
          case 'Pending': return "Mark as Confirmed"
          case 'Confirmed': return 'Mark as Packed'
          case 'Packed': return 'Mark as Shipped'
          case 'Shipped': return 'Mark as Delivered'
          case 'Cancelled':return 'Cancelled'
          case 'Delivered':return 'Delivered'
          case 'Return Requested':return 'Return Requested'
          case 'Returned' :return 'Returned'
        }
      }

      const nextStatus = {
        "Pending":"Confirmed",
        "Confirmed":"Packed",
        "Packed":"Shipped",
        "Shipped":"Delivered",
      }

      const handleUpdateStatus=async(index,order)=>{
            const nextStatusValue = nextStatus[order.status];
            const orderId=order?.orderId
            const userId=null; //since same updateOrderStatus function for both cancelling and updating other status. userId only required when cancelling to fetch the users wallet to give money back
        try{

            const updateOrderStatusResult =await updateOrderStatus(orderId,userId,nextStatusValue)
            toast.success(updateOrderStatusResult.message);
            order.status=nextStatusValue;
            setOrders((prev)=>{
              const updatedOrders=[...prev];
                  updatedOrders[index][1][6].value=<Badge  className={`${getStatusColor(nextStatusValue)} hover:${getStatusColor(nextStatusValue)}  text-white`}>{`${nextStatusValue}`}</Badge>
                  updatedOrders[index][1][7].value=
                  order.status==="Delivered"
                  ?<Button disabled className="m-0 bg-green-700 w-fit">Delivered</Button>
                  :<div className='flex gap-2 justify-center'><Modal handleClick={()=>handleUpdateStatus(index,order)} dialogTitle={`Is Order ${nextStatus[order.status]}`} dialogDescription="Are you sure? By clicking continue you are gonna change the status of the order" alertDialogTriggerrer={<Button disabled={order.status==="Delivered"}  className={`m-0 ${order.status==="Delivered" && "bg-green-700"}`}>{`${order.status==="Delivered"?"Delivered":statusButton(nextStatusValue)}`}</Button>}/>
                        <Modal handleClick={()=>handleCancelOrder(index,order,"Cancelled")} dialogTitle="Cancel Order" dialogDescription="Are you Sure?  By clicking continue you are gonna Cancel this order." alertDialogTriggerrer={<Button disabled={["Delivered","Cancelled"].includes(order.status)} className="m-0 bg-red-700">Cancel</Button>}/>
                  </div>
                  return updatedOrders
            })
        }
        catch(error){
            toast.error(error?.message)
        }
      }

      const handleCancelOrder=async(index,order,status)=>{
        try{

          const orderId=order?.orderId
          const userId = order?.userId
          const totalAmount=order?.totalAmount
          let isPaymentDone = false;
          if(["razorpay","wallet"].includes(order?.paymentMethod)) isPaymentDone=true;

          const updateOrderStatusResult =await updateOrderStatus(orderId,userId,status,isPaymentDone,totalAmount);
          toast.success(updateOrderStatusResult.message);
          order.status="Cancelled";
          setOrders((prev)=>{
            const updatedOrders=[...prev];
                updatedOrders[index][1][6].value=<Badge  className={`${getStatusColor(status)} hover:${getStatusColor(status)}  text-white`}>{`${status}`}</Badge>
                updatedOrders[index][1][7].value=<Button disabled onClick={()=>handleUpdateStatus(index,order)} className="m-0 bg-red-700 w-fit">Cancelled</Button>
                return updatedOrders;
          })
      }
      catch(error){
          console.log(error)
          toast.error(error?.message)
      }
      }

      const handleReturnRequest=async(index,order,returnConfirmation,decision)=>{
        try{
          const orderId=order?.orderId
          const userId = order?.userId
          const totalAmount=order?.totalAmount
          const confirmReturnResult = await confirmReturnOrder(orderId,userId,totalAmount,returnConfirmation,decision)
          console.log(confirmReturnResult)
        }
        catch(error)
        {
          toast.error(error.message)
        }
      }

    useEffect(()=>{

        const fetchOrders = async()=>{

          const limit=10;
          const sortCriteria=JSON.stringify(sort)
            try{
                const ordersResult = await getAllOrders(sortCriteria,currentPage,limit,tab);

                const transformedOrders = ordersResult?.orders.map((order,index)=>{
                    return [order._id,[{name:"Order ID",value:order?.orderId},
                                       {name:"products",value:<div onClick={()=>navigate(`/orders/${order?.orderId}`,{state:{from:"admin"}})} className='flex justify-center'>
                                        {order.items.slice(0, 3).map((item, index) => (
                                        <div className='relative'>
                                          <div key={item?.product} className={`relative rounded-full overflow-hidden border-2 border-white w-10 h-10 ${index !== 0 ? '-ml-4' : ''}`} style={{zIndex: 3 - index}}>
                                            <img
                                              src={item?.productDetails?.images[0]?.url}
                                              alt={item?.productDetails?.name}
                                              layout="fill"
                                              // objectFit="cover"
                                            />
                                          </div>
                                            <div className='absolute top-[-2px] right-[-2px] bg-gray-900  h-4 w-4 flex justify-center items-center text-[10px] rounded-3xl' style={{zIndex:4,color:"white"}}>
                                              {item?.size}
                                            </div>
                                        </div>  
                                            ))}
                                       {order?.items?.length > 3 && (
                                          <div className="relative -ml-3 rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center text-gray-600 font-semibold" style={{zIndex: 0}}>
                                            +{order?.items?.length - 3}
                                          </div>
                                        )}
                                      </div>},
                                      {name:"date",value:formatOrderDate(order?.createdAt)},
                                      {name:"customer",value:order?.user[0]?.name},
                                      {name:"total",value:order?.totalAmount},
                                      {name:"payment",value:order?.paymentMethod==="cod"?"Cash On Delivery":order?.paymentMethod==="razorpay"?"Online":"Wallet"},
                                      {name:"status",value:<Badge  className={`${getStatusColor(order.status)} hover:${getStatusColor(order.status)}  text-white`}>{order.status}</Badge>},
                                      {name:"updateStatus",value:
                                      ["Delivered","Cancelled","Returned"].includes(order.status)
                                      ?<Button disabled className={`m-0 w-fit ${order.status==="Delivered"?"bg-green-700":order.status==="Cancelled"?"bg-red-700":""}`}>{statusButton(order.status)}</Button>
                                      :order?.status==="Return Requested"
                                      ?<div className='flex gap-2 justify-center'>
                                        <Modal handleClick={()=>handleReturnRequest(index,order,true,true)} dialogTitle="Do you Want to Confirm" dialogDescription="Are you sure? By clicking continue you are gonna confirm returning order" alertDialogTriggerrer={<Button className={`m-0`}>Approve</Button>}/>
                                        <Modal handleClick={()=>handleReturnRequest(index,order,true,false)} dialogTitle="Do you Want to Deny" dialogDescription="Are you Sure?  By clicking continue you are gonna Deny this request." alertDialogTriggerrer={<Button disabled={["Delivered","Cancelled"].includes(order.status)} className="m-0 bg-red-700">Deny</Button>}/>    
                                      </div>
                                      :<div className='flex gap-2 justify-center'>
                                        <Modal handleClick={()=>handleUpdateStatus(index,order)} dialogTitle={`Is Order ${nextStatus[order.status]}`} dialogDescription="Are you sure? By clicking continue you are gonna change the status of the order" alertDialogTriggerrer={<Button disabled={["Delivered","Cancelled"].includes(order.status)} className={`m-0 ${order.status==="Delivered"?"bg-green-700":order.status==="Cancelled"?"bg-red-700":""}`}>{order.status==="Delivered"?"Delivered":order.status==="Cancelled"?"Cancelled":statusButton(order.status)}</Button>}/>
                                        <Modal handleClick={()=>handleCancelOrder(index,order,"Cancelled")} dialogTitle="Cancel Order" dialogDescription="Are you Sure?  By clicking continue you are gonna Cancel this order." alertDialogTriggerrer={<Button disabled={["Delivered","Cancelled"].includes(order.status)} className="m-0 bg-red-700">Cancel</Button>}/>    
                                      </div>},
                                     ]]
                })
                setOrders(transformedOrders);

                setNumberOfPages(ordersResult.numberOfPages)
            }catch(error){
              console.log(error)
            }
        }
        fetchOrders()
    },[currentPage,tab])

   

    const headers = ["ORDER ID","PRODUCTS","DATE","CUSTOMERS","TOTAL","PAYMENT","STATUS","UPDATE STATUS"]

  return (
    <div className="AdminProduct relative ps-5 md:ps-[300px] pe-5 pt-16">
      <SideBar />
      
       {/*  first div */}
       <div className=" flex items-center justify-around gap-7">
          <h1 className="text-xl font-bold">Orders</h1>
          <div className="flex-1 flex items-center">
            <div className="text-white bg-black p-2 rounded-s-md">search</div>
            <input className="border w-[100%] py-2" type="text" />
            <div className="text-white bg-black p-3 rounded-e-md">
              <CiSearch />
            </div>
          </div>
          <div onClick={tab==="successOrders"?()=>setTab("returnOrders"):()=>setTab("successOrders")} className="cursor-pointer bg-black text-white px-4 py-2 rounded-lg">
            <span>Return Requested</span>
          </div>
        </div>

    <TableComponent headers={headers} body={orders}/>
    <PaginationComponent currentPage={currentPage} setCurrentPage={setCurrentPage} numberOfPages={numberOfPages}/>
    </div>
  )
}

export default Orders


