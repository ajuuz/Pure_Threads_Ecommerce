import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import Card from '@/components/UserComponent/Card/Card';
import Footer from '@/components/UserComponent/Footer/Footer';
import { LensZoom } from '@/components/UserComponent/LensZoom/LensZoom';
import NavBar from '@/components/UserComponent/NavBar/NavBar'

import { getParticularProduct, getRelatedProducts } from '@/api/User/productApi';

import { toast } from 'sonner';

import { addToCart, selectSizeOfProduct } from '@/api/User/cartApi';

import { motion } from 'framer-motion';
import { getAllCoupons } from '@/api/User/couponApi';
import { CrossIcon, Star } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FaImage, FaPlus } from 'react-icons/fa';
import { GiClick } from 'react-icons/gi';
import { FaClosedCaptioning } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import CropperComponent from '@/components/AdminComponent/CropperComponent';
import { getCroppedImg } from '@/Utils/cropImage';
import { formDatasubmission } from '@/Utils/formDataSubmission';
import Rating from '@/components/UserComponent/Review/Rating';
import { ReviewTab } from '@/components/UserComponent/Review/ReviewTab';

const ProductDetailPage = () => {
    const [product,setProduct]=useState(null)
    const [images,setImages] = useState([]);
    const [selectedImageIndex,setSelectedImageIndex] = useState(0)
    const [relatedProducts,setRelatedProducts] = useState([])
    const [selectedSize,setSelectedSize] = useState(null)
    const [coupons,setCoupons] = useState([])

    const [activeTab,setActiveTab]=useState(0)
  

    const {productId} = useParams()

    const fetchCoupons = async()=>{
        try{
          const getAllCouponsResult =await getAllCoupons()
          setCoupons(getAllCouponsResult.coupons);
        }
        catch(error)
        {
          toast.error(error.message)
        }
      } 

      const fetchParticularProduct = async()=>{
          try{
                let categoryId="";
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

    useEffect(()=>{
        
        fetchParticularProduct();
        fetchCoupons()
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
        try{
            await selectSizeOfProduct(productId,index)
            setSelectedSize(index)
        }catch(error){
            if(error.statusCode===422) return toast.info(error.message)
        }
    }

    const tabPositions = ['translate-x-0', 'translate-x-[90%] md:translate-x-[95%]'];
  return (
    <div className=" relative pt-16">
      <NavBar />
    <section className='grid md:grid-cols-2 justify-center gap-12 py-16'>
        <div className='images flex justify-center md:justify-end gap-5'>
            <div className='flex flex-col gap-3'>
            {images.map((image,index)=>(
                <div key={image?.public_id} onClick={()=>setSelectedImageIndex(index)}  className={`w-[70px] rounded  ${selectedImageIndex===index && "border-2 border-black  rounded-md"}`}>
                    <img src={image.url} alt={`product Image${index}`} className='rounded'/>
                </div>
            ))}
           
            </div>
            <div>
                <LensZoom imageURL={images[selectedImageIndex]?.url}/>
            </div>
        </div>

        <div className='details'>
            <div className=' flex flex-col gap-9'>
                <h1 className='font-bold text-3xl'>{product?.name||"product name"}</h1>

                <div className='flex'>
                  <p className='flex items-end gap-5'><span className='font-semibold text-3xl'>Rs. {product?.salesPrice||0}</span>  <span className='text-xl text-muted-foreground font-semibold'>Rs.<span className='line-through text-2xl text-muted-foreground ms-1'>{product?.regularPrice}</span></span> <span className='text-xl text-green-700 font-bold'></span></p>
                    {product?.takenOffer?.offerValue!==0 &&
                    <motion.div className="flex items-center px-2 w-fit bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-center rounded-lg shadow-lg" animate={{   scale: [1, 1.1, 1],   y: [0, -10, 0],   boxShadow: [     "0px 5px 15px rgba(0, 0, 0, 0.2)",     "0px 10px 25px rgba(0, 0, 0, 0.3)",     "0px 5px 15px rgba(0, 0, 0, 0.2)",   ], }} transition={{   duration: 3,   repeat: Infinity,   repeatType: "loop", }} >
                        {product?.takenOffer?.offerValue} {product?.takenOffer?.offerType} off
                    </motion.div>
                    }
                </div>

                <div>
                    <h3>Available Coupons</h3>
                        <div className='grid grid-cols-2  gap-4 w-[70%] font-semibold'>
                    {coupons?.slice(0,4).map((coupon)=><div className='text-muted-foreground w-fit bg-gray-200  py-1 px-5 rounded-xl'>{`${coupon?.couponCode} - SAVE ${coupon.couponValue} ${coupon?.couponType}`}</div>)}
                    </div>
                </div>

                <div>
                    <p>Select Size</p>
                    <div className='flex gap-4'>
                        {product?.sizes.map((size,index)=>(
                            <div onClick={()=>handleSelectSize(productId,index)} key={size?.size} className={`w-16 text-center py-2 border-2 rounded-md ${selectedSize===index && "bg-black text-white border-2 border-black"} ${size?.stock<1 && `bg-muted border-none text-muted-foreground`} `}>{size.size}</div>
                        ))}
                    </div>
                </div>
                <div className='pe-24 sm:pe-5'>
                    <Button onClick={handleAddToCart} className="max-w-[510px]">Add to Cart</Button>
                    <Button className="max-w-[510px]">Add to Wishlist</Button>
                </div>
            </div>
        </div>
    </section>

    <section className='mb-10'>
      <div className='w-[90%] lg:w-[70%] md:w-[90%] mx-auto border p-5 '>
        <div className='flex mx-auto font-semibold bg-slate-200 relative  py-2 items-center cursor-pointer'>
                <div className={`flex-1 text-center absolute  bg-white rounded h-[70%] w-1/2 transition-all mx-3 duration-300 ${tabPositions[activeTab]}`}></div>
                <div onClick={()=>setActiveTab(0)} className='flex-1 text-center  rounded z-10'>Product Details</div>
                <div onClick={()=>setActiveTab(1)} className='flex-1 text-center rounded z-10'>Rating & Review</div>
        </div> 
        {activeTab===1
        ?<ReviewTab productId={productId}/>
        :<ProductSpecTab product={product}/>
        }
       </div>
    </section>
    <section>
        <h3 className='text-center font-medium text-xl'>You may also like</h3>
        <div className="card-container flex gap-5 justify-center overflow-x-auto  pt-4 pb-10 rounded-xl">
              {relatedProducts.map((product) => (
              <Card key={product?._id} product={product} image1={product?.images[0].url} withDescription={true}  onClick={() => alert(`You clicked on `)} />
              ))}
           </div>
    </section>
    <Footer/>
    </div>
  )
}

export default ProductDetailPage;


const ProductSpecTab=({product})=>{

    return(
        <div className='flex flex-col gap-4'>
        <div>
            <h2 className=' font-semibold mt-5'>Description</h2>
            <p className='font-serif text-sm'>{product?.description}</p>
        </div>
        <div>
            <h1 className='text-md font-medium'>size & fit</h1>
            <p className='font-serif text-sm'>Fit - {product?.fit.split('').map((alphabet,index)=>index===0?alphabet.toUpperCase():alphabet).join('')} fit</p>
            <p className='font-serif text-sm'>Size - {product?.sizeOfModel} Shirt</p>
        </div>
        <div>
            <h1 className='text-md font-medium'>Wash Care</h1>
            <p className='font-serif text-sm'>{product?.washCare}</p>
        </div>
        <div>
            <h1 className='text-md font-medium'>Specifications</h1>
            <p className='font-serif text-sm'>Color - {product?.color} color</p>
            <p className='font-serif text-sm'>Sleeves - {product?.sleeves} Shirt</p>
        </div>
        <div>
            <h1 className='text-md font-medium'>Addtional Info</h1>
            {product?.additionalInfo.map((info)=><p className='font-serif text-sm'>{info}</p>)}

        </div>
    </div>
    )    
}

// const ReviewTab=({productId})=>{
//     const [tab,setTab]=useState("displayReview")
//     return(
//         <div>
//             {tab==="addReview"
//             ?<AddReview productId={productId}/>
//             :<DiplayReview/>
//             }
//             <Button onClick={()=>setTab("addReview")}>ADD A REVIEW</Button>
//         </div>
//     )
// }

// const AddReview=({productId})=>{

//     const [review,setReview]=useState("")
//     const [rating, setRating] = useState(0)

//     const [images,setImages]=useState([])
//     const [croppedImage,setCroppedImage]=useState([])
//     const [showCropper,setShowCropper]=useState(null)
   
//     const handleAddImageInputField=()=>{
//         if(images.length>=3) return;
//         setImages((prev)=>[...prev,null])
//         setCroppedImage((prev)=>[...prev,null])
//     }

//     const handleRemoveImageInput=(index)=>{
//         setImages((prev)=>prev.filter((_,ind)=>index!==ind))
//         setCroppedImage((prev)=>prev.filter((_,ind)=>index!==ind))
//     }

//     const handleImageInputChange=(index,e)=>{
//         console.log(index)
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload=()=>{
//                 const updatedImages = [...images];
//                 updatedImages[index] = reader.result;
//                 setImages(updatedImages);
//                 setShowCropper(index);
//           }
//           reader.readAsDataURL(file);
//         }
//     }

//     const handleCropDone = async (croppedAreaPixels,zoom,image,index) => {
//         const croppedImg = await getCroppedImg(image, croppedAreaPixels, zoom);
//         setCroppedImage((prev) => {
//           const updated = [...prev]; // Make a shallow copy of the array
//           updated[index] = croppedImg; // Replace the value at the specific index
//           return updated; // Return the updated array
//         });
//         setShowCropper(null);
//       };
      
//       const handleCancel = () => {
//         setShowCropper(null);
//       };

//       const handleAddReview=async()=>{
//         try{
//             const formData = {productId,rating,review}
//              const addREviewResult=await formDatasubmission(croppedImage,formData,"review")
//              toast.success(addREviewResult.message)
//         }
//         catch(error)
//         {
//             toast.error(error.message)
//         }
//       }

//     return(
//         <div className='flex flex-col gap-5'>
//             <div className='flex flex-col gap-3'>
//                 <h1 className='text-lg font-semibold mt-5 text-center'>Write a Review</h1>
//                 <div className='space-y-4'>
//                     <div>
//                         <Label htmlFor="rating">Rating</Label>
//                         <Rating rating={rating} setRating={setRating}/>
//                     </div>
//                     <div>
//                         <Label htmlFor="review">Your Review</Label>
//                         <Textarea
//                           id="review"
//                           value={review}
//                           onChange={(e) => setReview(e.target.value)}
//                         placeholder="Write your review here"
//                         required
//                         />
//                     </div>
//                 </div>

//                 <div>
//                     <Label>Add Images (optional) <span className='text-xs text-muted-foreground'>Click the below to add Images</span></Label>
//                     <div className='flex gap-4'>
//                         {
//                             images.map((image,index)=>(
//                             <div className='cursor-pointer'>
//                                 {showCropper==index && <CropperComponent image={image} onCropDone={handleCropDone} onCancel={handleCancel} index={index} isProductImage={true}/>}
//                                 <div  className=' border-2 mt-3 border-dashed rounded-md w-fit flex flex-col gap-4 justify-center p-4 relative'>
//                                     <div onClick={()=>handleRemoveImageInput(index)} className='bg-black w-fit rounded-lg text-white font-semibold absolute top-2 right-2'><IoClose/></div>
//                                     <div className='bg-slate-200 rounded-md px-7 py-5 '>
//                                         {croppedImage[index]
//                                         ?<img src={URL.createObjectURL(croppedImage[index])} alt="Cropped" className="w-16 rounded-md"/>
//                                         :<FaImage className="mx-auto" />
//                                         }
//                                     </div>
//                                     <Input  id={`images-${index}`} type="file"  accept="image/*" onChange={(e)=>handleImageInputChange(index,e)} multiple className={`mt-1 hidden`} />

//                                    <Button variant="outline" className="m-0 h-7 relative">
//                                         <Label htmlFor={`images-${index}`} >
//                                         Add
//                                         <GiClick className='absolute -right-0 -bottom-1'/>
//                                         </Label>
//                                    </Button>
//                                 </div>
//                             </div>
//                             ))
//                         }

//                         {images.length<3 &&
//                         <div onClick={handleAddImageInputField} className='cursor-pointer border-2 mt-3 border-dashed rounded-md w-fit flex justify-center items-center py-4 px-12'>
//                             <FaPlus className=''/>
//                         </div>
//                         }
//                     </div>
//                 </div>
                
                
//             </div>
//             <Button onClick={handleAddReview}>Submit</Button>
//         </div>
//     )
// }

// const DiplayReview=()=>{
//     return(
//         <div className='flex flex-col gap-5'>
//             <h2 className='text-lg font-semibold mt-5 text-center'>Customer Reviews</h2>
//             <ScrollArea className=" h-[1000px]">
//             <div className=' flex flex-col gap-5'>
                
//             <div>
//                 <div className='border rounded-md p-4 flex flex-col gap-5'>
//                     <div className='flex items-center gap-4'>
//                         <span className='inline-block bg-black rounded-3xl py-[6px] px-[13px] text-white font-semibold'>A</span>
//                         <div>
//                             <p>Ajmal EA</p>
//                             <div className='flex gap-2'>
//                                 <div className='flex items-center'>
//                                 {[...Array(5)].map((_, i) => (
//                                     <Star
//                                     key={i}
//                                     className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
//                                     />
//                                 ))}
//                                 </div>                           
//                                   {new Date().toUTCString()}
//                             </div>
//                         </div>
//                     </div>

//                     <div>
//                         <p>Absolutely love this product! It exceeded all my expectations.
//                              The quality is top-notch,and it has
//                               made my daily routine so much easier.
//                         </p>
//                     </div>
//                     <div>
//                         <div className='flex gap-5'>
//                                 <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" className='w-14  rounded' alt="" />
//                                 <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" className='w-14  rounded' alt="" />
//                         </div>
//                     </div>

//                     <div className='flex items-center gap-5'>
//                         <p>Was this review Helpful</p>
//                         <div>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className={`mr-2 `}
//                               //   onClick={() => handleVote(index, "helpful")}
//                               >
//                               Yes 
//                             </Button>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className={`mr-2 `}
//                               //   onClick={() => handleVote(index, "helpful")}
//                               >
//                               No 
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div>
//                 <div className='border rounded-md p-4 flex flex-col gap-5'>
//                     <div className='flex items-center gap-4'>
//                         <span className='inline-block bg-black rounded-3xl py-[6px] px-[13px] text-white font-semibold'>A</span>
//                         <div>
//                             <p>Ajmal EA</p>
//                             <div className='flex gap-2'>
//                                 <div className='flex items-center'>
//                                 {[...Array(5)].map((_, i) => (
//                                     <Star
//                                     key={i}
//                                     className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
//                                     />
//                                 ))}
//                                 </div>                           
//                                   {new Date().toUTCString()}
//                             </div>
//                         </div>
//                     </div>

//                     <div>
//                         <p>Absolutely love this product! It exceeded all my expectations.
//                              The quality is top-notch,and it has
//                               made my daily routine so much easier.
//                         </p>
//                     </div>
//                     <div>
//                         <div className='flex gap-5'>
//                                 <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" className='w-14  rounded' alt="" />
//                                 <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" className='w-14  rounded' alt="" />
//                         </div>
//                     </div>

//                     <div className='flex items-center gap-5'>
//                         <p>Was this review Helpful</p>
//                         <div>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className={`mr-2 `}
//                               //   onClick={() => handleVote(index, "helpful")}
//                               >
//                               Yes 
//                             </Button>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className={`mr-2 `}
//                               //   onClick={() => handleVote(index, "helpful")}
//                               >
//                               No 
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div>
//                 <div className='border rounded-md p-4 flex flex-col gap-5'>
//                     <div className='flex items-center gap-4'>
//                         <span className='inline-block bg-black rounded-3xl py-[6px] px-[13px] text-white font-semibold'>A</span>
//                         <div>
//                             <p>Ajmal EA</p>
//                             <div className='flex gap-2'>
//                                 <div className='flex items-center'>
//                                 {[...Array(5)].map((_, i) => (
//                                     <Star
//                                     key={i}
//                                     className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
//                                     />
//                                 ))}
//                                 </div>                           
//                                   {new Date().toUTCString()}
//                             </div>
//                         </div>
//                     </div>

//                     <div>
//                         <p>Absolutely love this product! It exceeded all my expectations.
//                              The quality is top-notch,and it has
//                               made my daily routine so much easier.
//                         </p>
//                     </div>
//                     <div>
//                         <div className='flex gap-5'>
//                                 <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" className='w-14  rounded' alt="" />
//                                 <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" className='w-14  rounded' alt="" />
//                         </div>
//                     </div>

//                     <div className='flex items-center gap-5'>
//                         <p>Was this review Helpful</p>
//                         <div>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className={`mr-2 `}
//                               //   onClick={() => handleVote(index, "helpful")}
//                               >
//                               Yes 
//                             </Button>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className={`mr-2 `}
//                               //   onClick={() => handleVote(index, "helpful")}
//                               >
//                               No 
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div>
//                 <div className='border rounded-md p-4 flex flex-col gap-5'>
//                     <div className='flex items-center gap-4'>
//                         <span className='inline-block bg-black rounded-3xl py-[6px] px-[13px] text-white font-semibold'>A</span>
//                         <div>
//                             <p>Ajmal EA</p>
//                             <div className='flex gap-2'>
//                                 <div className='flex items-center'>
//                                 {[...Array(5)].map((_, i) => (
//                                     <Star
//                                     key={i}
//                                     className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
//                                     />
//                                 ))}
//                                 </div>                           
//                                   {new Date().toUTCString()}
//                             </div>
//                         </div>
//                     </div>

//                     <div>
//                         <p>Absolutely love this product! It exceeded all my expectations.
//                              The quality is top-notch,and it has
//                               made my daily routine so much easier.
//                         </p>
//                     </div>
//                     <div>
//                         <div className='flex gap-5'>
//                                 <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" className='w-14  rounded' alt="" />
//                                 <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" className='w-14  rounded' alt="" />
//                         </div>
//                     </div>

//                     <div className='flex items-center gap-5'>
//                         <p>Was this review Helpful</p>
//                         <div>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className={`mr-2 `}
//                               //   onClick={() => handleVote(index, "helpful")}
//                               >
//                               Yes 
//                             </Button>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className={`mr-2 `}
//                               //   onClick={() => handleVote(index, "helpful")}
//                               >
//                               No 
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div>
//                 <div className='border rounded-md p-4 flex flex-col gap-5'>
//                     <div className='flex items-center gap-4'>
//                         <span className='inline-block bg-black rounded-3xl py-[6px] px-[13px] text-white font-semibold'>A</span>
//                         <div>
//                             <p>Ajmal EA</p>
//                             <div className='flex gap-2'>
//                                 <div className='flex items-center'>
//                                 {[...Array(5)].map((_, i) => (
//                                     <Star
//                                     key={i}
//                                     className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
//                                     />
//                                 ))}
//                                 </div>                           
//                                   {new Date().toUTCString()}
//                             </div>
//                         </div>
//                     </div>

//                     <div>
//                         <p>Absolutely love this product! It exceeded all my expectations.
//                              The quality is top-notch,and it has
//                               made my daily routine so much easier.
//                         </p>
//                     </div>
//                     <div>
//                         <div className='flex gap-5'>
//                                 <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" className='w-14  rounded' alt="" />
//                                 <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" className='w-14  rounded' alt="" />
//                         </div>
//                     </div>

//                     <div className='flex items-center gap-5'>
//                         <p>Was this review Helpful</p>
//                         <div>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className={`mr-2 `}
//                               //   onClick={() => handleVote(index, "helpful")}
//                               >
//                               Yes 
//                             </Button>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className={`mr-2 `}
//                               //   onClick={() => handleVote(index, "helpful")}
//                               >
//                               No 
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             </div>

//             </ScrollArea>
//         </div>
//     )
// }