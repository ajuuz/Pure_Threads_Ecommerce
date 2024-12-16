import React, { useEffect, useState } from 'react'
import NavBar from '@/components/UserComponent/NavBar/NavBar'
import { getAddresses } from '@/api/User/addressApi'

import { Minus, Plus, Trash2 } from 'lucide-react'

import { useNavigate } from 'react-router-dom';
import { fetchCartProducts } from '@/Utils/productAvailableChecker';
import { Button } from '@/components/ui/button';
import { decrementQuantity, handleRemoveProduct, incrementQuantity } from '@/Utils/cartOperations';
import CheckOutAddress from '@/components/UserComponent/CheckOut/CheckOutAddress';
import { PaymentMethods } from '@/components/UserComponent/CheckOut/PaymentMethods';
import { placeOrder } from '@/api/User/orderApi';
import { toast } from 'sonner';
import OrderSuccess from '@/components/UserComponent/CheckOut/OrderSuccess';

const CheckOut = () => {

  const [addresses,setAddresses] = useState([])
  const [cartProducts,setCArtProducts] = useState([]);
  const [isAvailableProduct,setIsAvailableProduct] = useState([])
  const [selectedAddressIndex,setSelectedAddressIndex]= useState()
  const [isFirstPage,setIsFirstPage] = useState(true)
  const [paymentMethod,setPaymentMethod]=useState("cod")
  const [orderSuccess,setOrderSuccess] = useState(false);

  const navigate = useNavigate()

  const fetchAddresses=async()=>{
    try{
      const getAddressResult = await getAddresses();
      const isDefaultAddressIndex = getAddressResult.addresses.findIndex(x=>x.isDefault)
      setAddresses(getAddressResult.addresses);
      setSelectedAddressIndex(isDefaultAddressIndex);
    }
    catch(error)
    {
        if(error?.statusCode===403) return
        toast.error(error.message)
    }
}
  useEffect(()=>{

    fetchAddresses();

    const fetchProductAndValidate=async()=>{
      try{
        const fetchCartProductsResult=await fetchCartProducts();
        if(!orderSuccess && fetchCartProductsResult.fetchedProductArray.length===0) return navigate('/shop')
        setCArtProducts(fetchCartProductsResult.fetchedProductArray)
        setIsAvailableProduct(fetchCartProductsResult.isAvailableReducer)
      }
      catch(error){
        console.log(error)
      }
    }
    fetchProductAndValidate()

  },[])


const handlePlaceOrder=async()=>{
  try{
    const fetchCartProductsResult = await fetchCartProducts();
      
    if(fetchCartProductsResult.isAvailableReducer.filter(Boolean).length!==0) {
      setIsAvailableProduct(fetchCartProductsResult.isAvailableReducer)
      return
    }

    if(paymentMethod==="cod")
    {
      const deliveryAddress = addresses[selectedAddressIndex]
      const placeOrderResult = await placeOrder(paymentMethod,deliveryAddress)
      if(placeOrderResult.success)
      {
        setOrderSuccess(placeOrderResult.orderData)
        console.log(placeOrderResult.orderData)
      }
    }
    else{
      toast.info("other payment methods are currently on work. will release soon")
    }
  
  }
  catch(error)
  {
    console.log(error.message)
    toast.error(error.message);
  }
}

  return (
    <div className="min-h-screen  relative pt-32">
  <NavBar/>
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
        {orderSuccess && <OrderSuccess  orderData={orderSuccess}/>}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 p-8">
          {/* Order Summary */}
          <div className=" md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Order summary &#x2022; {cartProducts.length} items</h2>
           
            <div className="mt-6 flex flex-col gap-2">
            {cartProducts?.map((cartProduct,index)=>

                <div key={cartProduct?._id} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4  rounded-lg p-2 px-4 ${isAvailableProduct[index] ? "shadow-[rgba(200,0,0,0.2)_0px_0px_6px_1px] border-2 border-red-100":"shadow-[rgba(0,0,0,0.1)_0px_0px_10px_1px]"}`}  initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                  <div className='flex gap-4 items-center'>
                    <img 
                      src={cartProduct?.product?.images[0]?.url||"https://res.cloudinary.com/dt3ovlqp8/image/upload/v1733138117/secure-uploads/rtr70ck1ho0fqatb8qff.jpg"} 
                      alt={cartProduct?.product?.name} 
                      className='w-10  object-cover rounded-lg'
                    />
                    <div>
                      <h2 className='font-semibold text-'>{cartProduct?.product?.name||"Product Name"}</h2>
                      <p className='text-gray-600'>Size:{cartProduct?.size ||"M"}</p>
                      <p className='font-medium mt-1 flex items-baseline gap-4'> Rs.{cartProduct?.product?.salesPrice * cartProduct?.quantity || "$99.99"} <span className='text-xs text-muted-foreground'>{cartProduct?.product?.salesPrice} &#215; {cartProduct.quantity}</span></p>
                      {isAvailableProduct[index] && <p className='text-red-700 font-semibold'>{isAvailableProduct[index]}</p>}
                    </div>
                  </div>
                  <div className='flex items-center gap-4'>
                    {isAvailableProduct[index]==="product is currently not available" ?<></>:!isAvailableProduct[index]?<></> : <div className='flex items-center border rounded'>
                      <Button
                        disabled={isAvailableProduct[index]==="product is currently not available"}
                        variant="ghost" 
                        size="icon" 
                        onClick={()=>decrementQuantity(index,cartProduct,cartProduct?.product?._id , cartProduct?.size , cartProduct?.quantity,cartProducts,setCArtProducts,setIsAvailableProduct)}
                        className='h-8 w-8'
                      >
                        <Minus className='h-4 w-4' />
                      </Button>
                      <span className='w-8 text-center'>{cartProduct?.quantity}</span>
                      <Button 
                      disabled={isAvailableProduct[index]==="product is currently not available"}
                        variant="ghost" 
                        size="icon" 
                        onClick={()=>incrementQuantity(index,cartProduct,cartProduct?.product?._id , cartProduct?.size , cartProduct?.quantity,cartProducts,setCArtProducts,setIsAvailableProduct)}
                        className='h-8 w-8'
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>}
                    
                    <Button   onClick={()=>handleRemoveProduct(index,cartProduct?.product?._id,cartProduct?.size,cartProducts,setCArtProducts,isAvailableProduct,setIsAvailableProduct)} variant="ghost" size="icon">
                      <Trash2 className='h-5 w-5 text-red-500' />
                    </Button>
                  </div>
                </div>
            )}
            </div>
            <div className='flex flex-col py-3 gap-2'>
            <p className="text-lg font-bold text-muted-foreground">Total Amout : ₹{cartProducts.reduce((acc,curr)=>acc+=(curr?.product?.salesPrice * curr?.quantity),0)}</p>
            </div>
            <button onClick={cartProducts.length===0?()=>navigate('/shop'):()=>console.log(paymentMethod,isFirstPage)} className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">{cartProducts.length===0?"Back to shop":"Apply Coupon"}</button>
          </div>


          {/* Delivery Points */}
          <div className="md:col-span-2">
            {isFirstPage
            ?<CheckOutAddress addresses={addresses} selectedAddressIndex={selectedAddressIndex} setSelectedAddressIndex={setSelectedAddressIndex}/>
            :<PaymentMethods isAvailableProduct={isAvailableProduct} cartProducts={cartProducts} setPaymentMethod={setPaymentMethod} handlePlaceOrder={handlePlaceOrder}/>
            }
              {/* next side div */}
              <div className='flex gap-5'>
                <Button onClick={()=>setIsFirstPage(!isFirstPage)} className="bg-gray-300 text-black w-[50%] hover:text-white hover:bg-gray-400">{isFirstPage?"Next":"Back"}</Button>
              </div>

          </div>

        </div>
      </div>
      </div>
  )
}


export default CheckOut
