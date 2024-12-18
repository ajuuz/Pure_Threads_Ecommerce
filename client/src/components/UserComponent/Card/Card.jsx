// Card.jsx
import React, { useState } from "react";

const Card = ({image1,image2,product,withDescription,onCardClick}) => {
    const [currentImage,setCurrentImage] = useState(image1)



    const stockCalculator=()=>{
       const stock = product?.size.reduce((acc,curr)=>acc+=curr.stock,0)
       if(stock===0) return "Out of Stock"
       if(stock<=5) return "Limited Stock"
       return null
    }

  return (
    <div onClick={onCardClick} 
     onMouseEnter={!withDescription?()=>setCurrentImage(image2):null} 
     onMouseLeave={!withDescription?()=>setCurrentImage(image1):null} 
     className={`${withDescription && "p-4"} flex-shrink-0 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300  bg-white`}>
      <img
        className="h-80  rounded-lg"
        src={currentImage||'https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500.jpg'}
        alt={product?.name}
      />
      {withDescription &&
      <div className="p-2">
        <p className="font-semibold text-sm  text-gray-500 ">{product?.name}</p>
        <p className="text-muted-foreground">{product?.categoryDetails?.name}</p>
        <div className="flex font-medium">Rs. {product?.salesPrice}</div>
        <div className="text-muted-foreground">{product?.fit}</div>
        <div className="text-muted-foreground">{product?.sleeves}</div>
        <div className="text-red-500">{stockCalculator()}</div>
      </div>
      }
    </div>
  );
};

export default Card;
