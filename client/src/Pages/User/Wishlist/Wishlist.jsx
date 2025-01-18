import { getWishlistProducts, removeFromWishlist } from '@/api/User/wishlistApi';
import NavBar from '@/components/UserComponent/NavBar/NavBar'
import React, { useEffect, useState } from 'react'
import { FaTrashAlt } from "react-icons/fa";
import './wishlist.css'
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FaCartShopping } from 'react-icons/fa6';
import WishlistDialog from '@/components/UserComponent/Dialog/WishlistDialog';

const Wishlist = () => {
  const [wishlistProducts,setWishlistProducts] = useState([]);
  const navigate = useNavigate()

  useEffect(()=>{

    const fetchWishlistProducts = async()=>{
      const onlyIdNeeded = false
      const wishlistProductsResult = await getWishlistProducts(onlyIdNeeded);
      setWishlistProducts(wishlistProductsResult?.wishlist?.items)
    }
    fetchWishlistProducts();
  },[])

  const handleRemoveFromWishlist = async(productId)=>{
    try{
      const removeFromWishlistResult = await removeFromWishlist(productId);
      toast.success(removeFromWishlistResult.message)
      setWishlistProducts((prev)=>{
        const updatedWishlistProducts=[...prev];
        return updatedWishlistProducts.filter(product=>product._id!==productId)
      })  
    }catch(error){

    }
  }


  return (
    <div className="min-h-screen  pt-28 bg-gray-50">
      <NavBar />
        <h1 className="text-3xl font-bold  ps-[8%]">Your Wishlist</h1>
        <div className='flex justify-center'>
            <div className='p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-5'>
                {
                  wishlistProducts.map((product)=>(
                    <div 
                    className={`flex flex-col wishlist-card wishlist-shadow hover:scale-105 cursor-pointer h-80 w-60 border-3 rounded-lg`}
                    style={{ backgroundImage: `url(${product?.images[0]?.url})`,backgroundPosition:"", backgroundSize:"contain" , }}
                    >
                      <div className='flex gap-2 me-2 mt-2'>
                        <div onClick={()=>navigate(`/products/${product?._id}`)} className='flex-1'></div>
                        <div className='flex flex-col gap-2'>
                          <div onClick={()=>{handleRemoveFromWishlist(product?._id)}} className='wishlist-trashBin text-xs  p-2 bg-white rounded-2xl opacity-0 transition-opacity duration-300 '>
                              <FaTrashAlt className='text-red-600'/>
                          </div>
                            <WishlistDialog product={product} dialogTriggerer={
                              <div  className='wishlist-trashBin text-xs  p-2 bg-white rounded-2xl opacity-0 transition-opacity duration-300 '>
                              <FaCartShopping className='text-red-600'/>
                              </div>
                            } dialogTitle="select size" dialogDescription="select the size that you want to add to cart"/>
                          
                        </div>
                      </div>
                      <div onClick={()=>navigate(`/products/${product?._id}`)} className='flex  items-end h-full '>
                        <p className=' text-white font-serif font-medium truncate mb-1 ms-2'>{product.name}</p>
                      </div>
                    </div>
                  ))
                }
            </div>
        </div>
    </div>
  )
}

export default Wishlist
