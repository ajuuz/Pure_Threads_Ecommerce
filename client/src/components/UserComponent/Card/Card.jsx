// Card.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { addToWishlist, removeFromWishlist } from "@/api/User/wishlistApi";
import { toast } from "sonner";

const Card = ({image1,image2,product,withDescription,onCardClick,isWishlisted,setWishlisted}) => {
    const [currentImage,setCurrentImage] = useState(image1)



    const handleWishlistClick = async(productId)=>{
      if(!isWishlisted)
      {
        try{
          const addToWishlistResult = await addToWishlist(productId);
          setWishlisted((prev)=>[...prev,productId])
          toast.success(addToWishlistResult?.message);
        }catch(error){
          toast.error(error.message);
        }
      }
      else
      {
          try{
            const removeFromWishlistResult = await removeFromWishlist(productId);
            toast.success(removeFromWishlistResult.message)
            setWishlisted((prev)=>{
              return prev.filter(existingProductId=>existingProductId!==productId)
            })        
          }catch(error){
            toast.error(error.message);
          }
      }
    }


    const stockCalculator=()=>{
       const stock = product?.sizes.reduce((acc,curr)=>acc+=curr.stock,0)
       if(stock===0) return "Out of Stock"
       if(stock<=5) return "Limited Stock"
       return null
    }

  return (
    <div  
     onMouseEnter={!withDescription?()=>setCurrentImage(image2):null} 
     onMouseLeave={!withDescription?()=>setCurrentImage(image1):null} 
     className={` ${withDescription && "p-4"} cursor-pointer flex-shrink-0 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 `}>
      
      <img
        onClick={onCardClick} 
        className=" h-25 sm:h-80 md:h-90 lg:h-110 xl:h-120 xxl:h-130  rounded-lg"
        src={currentImage||'https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500.jpg'}
        alt={product?.name}
      />
      {withDescription &&
      <div className="p-2 flex justify-between">
        <div onClick={onCardClick}>
          <p className="font-semibold text-sm  text-gray-500 ">{product?.name}</p>
          <p className="text-muted-foreground">{product?.categoryDetails?.name}</p>
          <div className="flex font-medium">Rs. {product?.salesPrice}</div>
          <div className="text-red-500">{stockCalculator()}</div>
        </div>
        <div>
          <motion.div 
          whileHover={{ scale: 1.2 }} // Slightly enlarge on hover
          whileTap={{ scale: 0.9 }} // Shrink slightly on click
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }} // Bounce effect
          transition={{
            type: "spring", // Natural bounce effect
            stiffness: 300, // Controls the tightness of the spring
            damping: 10, // Reduces the bounce over time
          }}
          className=" mt-[8px] inline-block cursor-pointer">
            <Heart onClick={()=>handleWishlistClick(product?._id)}  className="" fill={isWishlisted?"red":"white"} stroke={isWishlisted?"":"gray"}/>
          </motion.div>
        </div>
      </div>
      }
    </div>
  );
};

export default Card;
