
import NavBar from '@/components/UserComponent/NavBar/NavBar'
import React, { useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Cart = () => {
  const [quantity, setQuantity] = useState(1)

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

  return (
    <div className="min-h-screen relative pt-24 bg-gray-50">
      <NavBar />
      <main className='p-5 max-w-7xl mx-auto'>
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className='grid grid-cols-12 gap-8'>
          <section className='col-span-12 lg:col-span-8'>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                <div className='flex gap-4 items-center'>
                  <img 
                    src="https://res.cloudinary.com/dt3ovlqp8/image/upload/v1733138117/secure-uploads/rtr70ck1ho0fqatb8qff.jpg" 
                    alt="Product" 
                    className='w-24 h-24 object-cover rounded'
                  />
                  <div>
                    <h2 className='font-semibold text-lg'>Product Name</h2>
                    <p className='text-gray-600'>Size: M</p>
                    <p className='font-medium mt-1'>$99.99</p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center border rounded'>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={decrementQuantity}
                      className='h-8 w-8'
                    >
                      <Minus className='h-4 w-4' />
                    </Button>
                    <span className='w-8 text-center'>{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={incrementQuantity}
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
            </div>
          </section>
          
          <section className='col-span-12 lg:col-span-4'>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
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

