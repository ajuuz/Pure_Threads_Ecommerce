import React, { useEffect, useState } from 'react'

import { Minus, Plus, Ticket, Trash2,CheckIcon } from 'lucide-react'

//components
import NavBar from '@/components/UserComponent/NavBar/NavBar'
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CheckOutAddress from '@/components/UserComponent/CheckOut/CheckOutAddress';
import { PaymentMethods } from '@/components/UserComponent/CheckOut/PaymentMethods';
import OrderSuccess from '@/components/UserComponent/CheckOut/OrderSuccess';

import { toast } from 'sonner';
import { motion } from 'framer-motion';

//apis
import { fetchCartProducts } from '@/Utils/cart/productAvailableChecker';
import { decrementQuantity, handleRemoveProduct, incrementQuantity } from '@/Utils/cart/cartOperations';
import {  placeOrder } from '@/api/User/orderApi';
import { getCheckoutAvailableCoupons } from '@/api/User/couponApi';
import { getAddresses } from '@/api/User/addressApi'
import { CouponCardType2 } from '@/components/UserComponent/CouponCard/CouponCard';
import { Input } from '@/components/ui/input';
import { couponDiscountCalculator, totalAmountCalculator } from '@/Utils/cart/cartItemsTotalAmountCalculator';



const CheckOut = () => {
  
  //useStates
  const [addresses,setAddresses] = useState([])
  const [cartProducts,setCArtProducts] = useState([]);
  const [isAvailableProduct,setIsAvailableProduct] = useState([])
  const [selectedAddressIndex,setSelectedAddressIndex]= useState()
  const [isFirstPage,setIsFirstPage] = useState(true)
  const [paymentMethod,setPaymentMethod]=useState("cod")
  const [orderSuccess,setOrderSuccess] = useState(false);
  
  const [availableCoupons,setAvailableCoupons] = useState([]);
  const [showCoupons,setShowCoupons] = useState(false);
  const [selectedCoupon,setSelectedCoupon]=useState(null);
  
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

  const fetchProductAndValidate=async(fetchCartProductsResult)=>{
    try{
      fetchCartProductsResult=await fetchCartProducts();
      if(!orderSuccess && fetchCartProductsResult?.fetchedProductArray.length===0) return navigate('/shop')
      setCArtProducts(fetchCartProductsResult?.fetchedProductArray)
      setIsAvailableProduct(fetchCartProductsResult?.isAvailableReducer)
    }
    catch(error){
      console.log(error)
    }
  }

  const fetchCheckoutAvailableCoupons = async()=>{
    try{
      const getCheckoutAvailableCouponsResult =await getCheckoutAvailableCoupons()
      setAvailableCoupons(getCheckoutAvailableCouponsResult?.availableCoupons);
      console.log(getCheckoutAvailableCouponsResult?.availableCoupons)

      if(!getCheckoutAvailableCouponsResult?.availableCoupons.some(coupon=>coupon.couponCode===selectedCoupon))
      {
        setSelectedCoupon(null)
      }
    }
    catch(error)
    {
      toast.error(error.message)
    }
  } 

  

  useEffect(()=>{
    fetchAddresses();
    fetchProductAndValidate();
    fetchCheckoutAvailableCoupons();
  },[])


  

const handlePlaceOrder=async(amount,paymentDetails)=>{
  try{
    if(paymentMethod==="cod")
      {
        const fetchCartProductsResult = await fetchCartProducts();
        if(fetchCartProductsResult.isAvailableReducer.filter(Boolean).length!==0) {
          setIsAvailableProduct(fetchCartProductsResult.isAvailableReducer)
          return
        }
      }
      let couponDiscount=0;
      if(selectedCoupon) couponDiscount=couponDiscountCalculator(cartProducts,selectedCoupon);
        const deliveryAddress = addresses[selectedAddressIndex]
        const placeOrderResult = await placeOrder(paymentMethod,deliveryAddress,selectedCoupon,amount,couponDiscount,paymentDetails)
      if(placeOrderResult.success)
      {
        setOrderSuccess(placeOrderResult.orderData)
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
          
          <div className='col-span-2'>
              <OrderSummaryComponent 
              cartProducts={cartProducts}
              setCArtProducts={setCArtProducts} 
              isAvailableProduct={isAvailableProduct} 
              setIsAvailableProduct={setIsAvailableProduct} 
              fetchCheckoutAvailableCoupons={fetchCheckoutAvailableCoupons}
              selectedCoupon={selectedCoupon}
              />

              <div className='flex gap-5 mb-5'>
                <Input className="flex-1" placeHolder="Enter the coupon code..."/>
                <Button className="m-0 w-fit">Apply Coupon</Button>
              </div>

              <Button onClick={cartProducts.length===0?()=>navigate('/shop'):()=>setShowCoupons(true)} className="m-0 relative w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">
                <Badge className="bg-gray-400 rounded-2xl py-1 absolute top-[-10px] right-[-10px]">
                  {availableCoupons.length}
                </Badge>
                {cartProducts.length===0?"Back to shop":"View Coupon"}
              </Button>
              {showCoupons && <ViewCouponComponent showCoupons={showCoupons} availableCoupons={availableCoupons} selectedCoupon={selectedCoupon} setSelectedCoupon={setSelectedCoupon}/>}
          </div>


          {/* Delivery Points */}
          <div className="md:col-span-2">
            {isFirstPage
            ?<CheckOutAddress  addresses={addresses}  selectedAddressIndex={selectedAddressIndex}  setSelectedAddressIndex={setSelectedAddressIndex}/>
            :<PaymentMethods  isAvailableProduct={isAvailableProduct} setIsAvailableProduct={setIsAvailableProduct} cartProducts={cartProducts}  paymentMethod={paymentMethod}  setPaymentMethod={setPaymentMethod} amount={totalAmountCalculator(cartProducts,selectedCoupon)} handlePlaceOrder={handlePlaceOrder}/>
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


const ViewCouponComponent = ({showCoupons,availableCoupons,selectedCoupon,setSelectedCoupon})=>{
  return(
    <div>
      <motion.div
      className={`max-h-[450px] border mt-5 p-5 overflow-y-auto rounded-md bg-slate-100 grid gap-5 ${availableCoupons.length===0 && "hidden"}`}
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: showCoupons ? "auto" : 0,
        opacity: showCoupons ? 1 : 0,
      }}
      transition={{ duration: 0.8 }}
      >
        {availableCoupons.map(coupon=><CouponCardType2 key={coupon?._id} coupon={coupon} selectedCoupon={selectedCoupon} setSelectedCoupon={setSelectedCoupon}/>)}
      </motion.div>
      </div>
  )
}

const OrderSummaryComponent = ({cartProducts,setCArtProducts,isAvailableProduct,setIsAvailableProduct,fetchCheckoutAvailableCoupons,selectedCoupon})=>{
  return(
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
                        onClick={()=>decrementQuantity(index,cartProduct,cartProducts,setCArtProducts,setIsAvailableProduct,fetchCheckoutAvailableCoupons)}
                        className='h-8 w-8'
                      >
                        <Minus className='h-4 w-4' />
                      </Button>
                      <span className='w-8 text-center'>{cartProduct?.quantity}</span>
                      <Button 
                      disabled={isAvailableProduct[index]==="product is currently not available"}
                        variant="ghost" 
                        size="icon" 
                        onClick={()=>incrementQuantity(index,cartProduct,cartProducts,setCArtProducts,setIsAvailableProduct,fetchCheckoutAvailableCoupons)}
                        className='h-8 w-8'
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>}
                    
                    <Button   onClick={()=>handleRemoveProduct(index,cartProduct?.product?._id,cartProduct?.size,setCArtProducts,setIsAvailableProduct,fetchCheckoutAvailableCoupons)} variant="ghost" size="icon">
                      <Trash2 className='h-5 w-5 text-red-500' />
                    </Button>
                  </div>
                </div>
            )}
            </div>
            <div className='flex flex-col py-3 gap-2'>
              <p className=" flex items-center gap-2">
                <span className='text-lg font-bold text-muted-foreground'>
                  Total Amount : ₹{totalAmountCalculator(cartProducts,selectedCoupon)} 
                </span>
                {selectedCoupon 
                && 
                <div className='flex items-center gap-4'>
                  <span className='text-lg font-bold text-muted-foreground line-through'>₹{totalAmountCalculator(cartProducts)}</span>
                  <div className='bg-slate-200 font-semibold text-muted-foreground rounded-lg flex items-center gap-1 h-fit'>
                    <span className='ps-2 flex gap-1'>{selectedCoupon?.couponCode}<div className='bg-green-400 rounded-3xl'><CheckIcon className='text-white scale-50'/></div></span>
                    <Badge className="p-2">
                      {selectedCoupon?.couponValue +" "+selectedCoupon?.couponType} off
                    </Badge>
                  </div>
                </div>
                }
              </p>
            </div>
          </div>
  )
}