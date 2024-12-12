import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import Card from '@/components/UserComponent/Card/Card';
import Footer from '@/components/UserComponent/Footer/Footer';
import { LensZoom } from '@/components/UserComponent/LensZoom/LensZoom';
import NavBar from '@/components/UserComponent/NavBar/NavBar'
import Rating from '@/components/UserComponent/Rating/Rating';

import { getParticularProduct, getRelatedProducts } from '@/api/User/productApi';

import { toast } from 'sonner';

import { addToCart, selectSizeOfProduct } from '@/api/User/cartApi';


const ProductDetailPage = () => {
    const [product,setProduct]=useState(null)
    const [images,setImages] = useState([]);
    const [selectedImageIndex,setSelectedImageIndex] = useState(0)
    const [relatedProducts,setRelatedProducts] = useState([])
    const [selectedSize,setSelectedSize] = useState(null)


    const {productId} = useParams()

    useEffect(()=>{
        let categoryId="";
        const fetchParticularProduct = async()=>{
            try{
                const productResult = await getParticularProduct(productId);
                categoryId = productResult?.product?.category
                setImages(productResult?.product?.images)
                setProduct(productResult?.product)

                const relatedProductResult = await getRelatedProducts(categoryId)
                setRelatedProducts(relatedProductResult?.products.filter((product)=>product._id!=productResult.product._id))
            }
            catch(error)
            {
                console.log("some other error occured")
            }
        } 
        fetchParticularProduct();
    },[])

    const handleAddToCart=async()=>{
        if(selectedSize===null) return toast.warning("select a size to continue")
        try{
            const addingToCartResult = await addToCart(productId,selectedSize);
            toast.success(addingToCartResult.message)
        }
        catch(error)
        {
            if(error.statusCode===422) return toast.info(error.message)
            toast.warning(error.message)
        }
    }

    const handleSelectSize=async(productId,index)=>{
        // if(stock>1){setSelectedSize(index)}
        try{
            await selectSizeOfProduct(productId,index)
            setSelectedSize(index)
        }catch(error){
            if(error.statusCode===422) return toast.info(error.message)
        }
    }

  return (
    <div className="h-[200vh] relative pt-24">
      <NavBar />
    <section className='flex gap-6 py-16  lg:px-60'>
        <div className='images w-[50%] flex gap-5'>
            <div className='flex flex-col gap-3'>
            {images.map((image,index)=>(
                <div key={image?.public_id} onClick={()=>setSelectedImageIndex(index)}  className={`w-[70px] rounded  ${selectedImageIndex===index && "border-2 border-gray-500  "}`}>
                    <img src={image.url} alt={`product Image${index}`} className='rounded'/>
                </div>
            ))}
           
            </div>
            <div className=''>
                <LensZoom imageURL={images[selectedImageIndex]?.url}/>
            </div>


        </div>
        <div className='details flex flex-col gap-9'>

            <h1 className='font-bold text-3xl'>{product?.name||"product name"}</h1>
            <p>Rs. {product?.salesPrice||0}</p>
            

            <div>
                <h3>Available Coupons</h3>
                    <div className='flex flex-wrap gap-4 w-[560px]'>
                    <div className='text-muted-foreground bg-gray-200 inline-block py-1 px-5 rounded-xl'>30% off for the first purchase</div>
                    <div className='text-muted-foreground bg-gray-200 inline-block py-1 px-5 rounded-xl'>30% off for the first purchase</div>
                    <div className='text-muted-foreground bg-gray-200 inline-block py-1 px-5 rounded-xl'>30% off for the first purchase</div>
                    <div className='text-muted-foreground bg-gray-200 inline-block py-1 px-5 rounded-xl'>30% off for the first purchase</div>
                </div>
            </div>

            <div>
                <p>Select Size</p>
                <div className='flex gap-4'>
                    {product?.size.map((size,index)=>(
                        <div onClick={()=>handleSelectSize(productId,index)} key={size?.size} className={`w-16 text-center py-2 border-2 rounded-md ${selectedSize===index && "bg-black text-white border-2 border-black"} ${size?.stock<1 && `bg-muted border-none text-muted-foreground`} `}>{size.size}</div>
                    ))}
                </div>
            </div>
            <div>
                <Button onClick={handleAddToCart} className="max-w-[510px]">Add to Cart</Button>
                <Button className="max-w-[510px]">Add to Wishlist</Button>
            </div>
        </div>
    </section>

    <section className=''>
      <div className='w-[50%] mx-auto border p-5'>
        <div className='flex mx-auto bg-slate-200  py-1 px-3'>
                <div className='flex-1 text-center bg-white rounded'>Product Details</div>
                <div className='flex-1 text-center'>Rating & Review</div>
        </div> 
        <div className='flex flex-col gap-5'>
            <div>
                <h2 className='text-lg font-semibold mt-5'>Customer Reviews</h2>
                <p>No review yet</p>
            </div>
            <div className='flex flex-col gap-3'>
                <h1 className='text-lg'>Write a Review</h1>
                <p>your Rating</p>
                <Rating/>
                <p>Your Review</p>
                <textarea className='border p-4 rounded-lg' name="" id="" placeholder='Write your rview here...'></textarea>
            </div>
            <Button>Submit</Button>
        </div>
       </div>
    </section>
    <section>
        <h3 className='text-center font-medium text-xl'>You may also like</h3>
        <div className="card-container flex gap-5 justify-center overflow-x-auto  pt-4 pb-10 rounded-xl">
              {relatedProducts.map((product) => (
              <Card key={product?._id} title={product?.name} price={product?.salesPrice} image1={product?.images[0].url} withDescription={true}  onClick={() => alert(`You clicked on `)} />
              ))}
           </div>
    </section>
    <Footer/>
    </div>
  )
}

export default ProductDetailPage;
