
import NavBar from '@/components/UserComponent/NavBar/NavBar'
import React, { useEffect, useState } from 'react'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { fetchCartProducts } from '@/Utils/cart/productAvailableChecker'
import { decrementQuantity, handleRemoveProduct, incrementQuantity } from '@/Utils/cart/cartOperations'
import { toast } from 'sonner'
import { totalAmountCalculator } from '@/Utils/cart/cartItemsTotalAmountCalculator'

const Cart = () => {
  const [cartProducts,setCArtProducts] = useState([])
  const [isAvailableProduct,setIsAvailableProduct] = useState()

  const navigate = useNavigate()



  useEffect(()=>{
    const fetchProductAndValidate=async()=>{
      try{
        const fetchCartProductsResult=await fetchCartProducts();
        setCArtProducts(fetchCartProductsResult.fetchedProductArray)
        setIsAvailableProduct(fetchCartProductsResult.isAvailableReducer)
      }
      catch(error){
        console.log(error)
      }
    }
    fetchProductAndValidate()
  },[])




  const handleProceedToChechout=async()=>{
    
    try{
      const fetchCartProductsResult = await fetchCartProducts();
      if(fetchCartProductsResult.isAvailableReducer.filter(Boolean).length!==0) {
        setIsAvailableProduct(fetchCartProductsResult.isAvailableReducer)
        return
      }
      navigate('/checkout')
    }
    catch(error)
    {
      console.log(error.message)
      toast.error(error.message); 
    }
  }

  return (
    <div className="min-h-screen relative pt-24 bg-gray-50">
      <NavBar />
      <main className='p-5 max-w-7xl mx-auto'>
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className='grid grid-cols-12 gap-8'>
          <section className=' col-span-12 lg:col-span-8 bg-white p-6 rounded-lg shadow-[rgba(0,0,0,0.1)_0px_0px_5px_1px] flex flex-col gap-4'>

            {/* one product */}
            {cartProducts.length===0
            ?<div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg  max-w-sm mx-auto">
            <ShoppingCart className="w-12 h-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 text-center mb-4">Looks like you haven't added any items to your cart yet.</p>
            <button onClick={()=>navigate('/shop')} className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200">
              Start Shopping
            </button>
          </div>
            : <>{cartProducts?.map((cartProduct,index)=>
              // < className="grid mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-5 md:gap-5 lg:gap-4 xl:gap-4">

                <motion.div key={cartProduct?._id} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4  rounded-lg p-2 px-4 ${isAvailableProduct[index] ? "shadow-[rgba(200,0,0,0.2)_0px_0px_6px_1px] border-2 border-red-100":"shadow-[rgba(0,0,0,0.1)_0px_0px_10px_1px]"}`}  initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                  <div className='flex gap-4 items-center'>
                    <img 
                      src={cartProduct?.product?.images[0]?.url||"https://res.cloudinary.com/dt3ovlqp8/image/upload/v1733138117/secure-uploads/rtr70ck1ho0fqatb8qff.jpg"} 
                      alt={cartProduct?.product?.name} 
                      className='w-24 h-25 object-cover rounded-lg'
                    />
                    <div>
                      <h2 className='font-semibold text-lg'>{cartProduct?.product?.name||"Product Name"}</h2>
                      <p className='text-gray-600'>Size:{cartProduct?.size ||"M"}</p>
                      <p className='font-medium mt-1'>Rs. {cartProduct?.product?.salesPrice * cartProduct?.quantity || "$99.99"}</p>
                      {isAvailableProduct[index] && <p className='text-red-700 font-semibold'>{isAvailableProduct[index]}</p>}
                    </div>
                  </div>
                  <div className='flex items-center gap-4'>
                    <div className='flex items-center border rounded'>
                      <Button 
                        disabled={isAvailableProduct[index]==="product is currently not available"}
                        variant="ghost" 
                        size="icon" 
                        onClick={()=>decrementQuantity(index,cartProduct,cartProducts,setCArtProducts,setIsAvailableProduct)}
                        className='h-8 w-8'
                      >
                        <Minus className='h-4 w-4' />
                      </Button>
                      <span className='w-8 text-center'>{cartProduct?.quantity}</span>
                      <Button 
                      disabled={isAvailableProduct[index]==="product is currently not available"}
                        variant="ghost" 
                        size="icon" 
                        onClick={()=>incrementQuantity(index,cartProduct,cartProducts,setCArtProducts,setIsAvailableProduct)}
                        className='h-8 w-8'
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>
                    <Button onClick={()=>handleRemoveProduct(index,cartProduct?.product?._id,cartProduct?.size,setCArtProducts,setIsAvailableProduct)} variant="ghost" size="icon">
                      <Trash2 className='h-5 w-5 text-red-500' />
                    </Button>
                  </div>
                </motion.div>
            )}</>}
           
            {/* one product */}

            {/* </div> */}
          </section>
          {cartProducts.length>0 
          &&<section className='col-span-12 lg:col-span-4'>
          <div className='bg-white p-6 rounded-lg shadow-[rgba(0,0,0,0.1)_0px_0px_5px_1px]'>
            <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
            
            <div className='border-t pt-2'>
              <div className='flex justify-between font-semibold'>
                <span>Total</span>
                <span>₹{totalAmountCalculator(cartProducts)}</span>
              </div>
            </div>
            <Button disabled={isAvailableProduct.filter(Boolean).length!==0} onClick={handleProceedToChechout} className='w-full mt-6'>Proceed to Checkout</Button>
          </div>
        </section>
           }
          
        </div>
      </main>
    </div>
  )
}

export default Cart

