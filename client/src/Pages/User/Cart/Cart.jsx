
import NavBar from '@/components/UserComponent/NavBar/NavBar'
import React, { useEffect, useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCartProducts,updateQuantity } from '@/api/User/cartApi'


const Cart = () => {
  const [quantity, setQuantity] = useState(1)
  const [cartProducts,setCArtProducts] = useState([])
    const [refresh,setRefresh] = useState(true)



  useEffect(()=>{
    const fetchCartProducts = async ()=>{
        try{
            const fetchCartProductsResult = await getCartProducts();
            const fetchedProductArray = fetchCartProductsResult?.cartProducts || []
            setCArtProducts(fetchedProductArray)
            console.log(fetchedProductArray)
        }catch(error){
            console.log(error.message)
        }
    }
    fetchCartProducts();
  },[])


  
  const incrementQuantity =async (index,productId,size,quantity) =>{
    if(quantity>=5) return
    try{
        const updatedCount = quantity+1
        const updateQuantityResult =  await updateQuantity(productId,size,updatedCount)
        const updatedArray = [...cartProducts]
        updatedArray[index].quantity = quantity+1;
        setCArtProducts(updatedArray)
        
        return
        setCArtProducts((prev)=>{
            const updatedArray = [...prev];
            updatedArray[index]={
                ...prev[index],
                quantity:quantity+1
            }
        })
    }
    catch(error){
        console.log(error)
    }
  }
  
  const decrementQuantity =async(index,productId,size,quantity) => {
    if(quantity<=1) return
    try{
        const updatedCount = quantity-1
        const updateQuantityResult =  await updateQuantity(productId,size,updatedCount)
        const updatedArray = [...cartProducts]
        updatedArray[index].quantity = quantity-1;
        setCArtProducts(updatedArray)
        return
        setCArtProducts((prev)=>{
            const updatedArray = [...prev];
            updatedArray[index]={
                ...prev[index],
                quantity:quantity-1
            }
        })
    }
    catch(error){
        console.log(error)
    } 
  }


  return (
    <div className="min-h-screen relative pt-24 bg-gray-50">
      <NavBar />
      <main className='p-5 max-w-7xl mx-auto'>
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className='grid grid-cols-12 gap-8'>
          <section className=' col-span-12 lg:col-span-8 bg-white p-6 rounded-lg shadow-[rgba(0,0,0,0.1)_0px_0px_5px_1px] flex flex-col gap-4'>
            {/* <div className='border '> */}

            {/* one product */}
            {cartProducts?.map((cartProduct,index)=>
              <div key={cartProduct?._id} className=' flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[rgba(0,0,0,0.1)_0px_0px_10px_1px] rounded-lg p-2 px-4'>
                <div className='flex gap-4 items-center'>
                  <img 
                    src={cartProduct?.product?.images[0]?.url||"https://res.cloudinary.com/dt3ovlqp8/image/upload/v1733138117/secure-uploads/rtr70ck1ho0fqatb8qff.jpg"} 
                    alt={cartProduct?.product?.name} 
                    className='w-24 h-25 object-cover rounded-lg'
                  />
                  <div>
                    <h2 className='font-semibold text-lg'>{cartProduct?.product?.name||"Product Name"}</h2>
                    <p className='text-gray-600'>Size:{cartProduct?.size ||"M"}</p>
                    <p className='font-medium mt-1'>{cartProduct?.product?.salesPrice || "$99.99"}</p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center border rounded'>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={()=>decrementQuantity(index,cartProduct?.product?._id , cartProduct?.size , cartProduct?.quantity)}
                      className='h-8 w-8'
                    >
                      <Minus className='h-4 w-4' />
                    </Button>
                    <span className='w-8 text-center'>{cartProduct?.quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={()=>incrementQuantity(index,cartProduct?.product?._id , cartProduct?.size , cartProduct?.quantity)}
                      className='h-8 w-8'
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Trash2 className='h-5 w-5 text-red-500' />
                  </Button>
                </div>
              </div>
              )}
            {/* one product */}

            {/* </div> */}
          </section>

          <section className='col-span-12 lg:col-span-4'>
            <div className='bg-white p-6 rounded-lg shadow-[rgba(0,0,0,0.1)_0px_0px_5px_1px]'>
              <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
              <div className='space-y-2 mb-4'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>$99.99</span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipping</span>
                  <span>$5.00</span>
                </div>
                <div className='flex justify-between'>
                  <span>Tax</span>
                  <span>$10.00</span>
                </div>
              </div>
              <div className='border-t pt-2'>
                <div className='flex justify-between font-semibold'>
                  <span>Total</span>
                  <span>$114.99</span>
                </div>
              </div>
              <Button className='w-full mt-6'>Proceed to Checkout</Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Cart

