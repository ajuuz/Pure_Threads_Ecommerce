// Card.jsx
import React, { useState } from "react";

const Card = ({image1,image2,title,category,price,withDescription,onCardClick}) => {
    const [currentImage,setCurrentImage] = useState(image1)
  return (
    <div onClick={onCardClick} 
     onMouseEnter={!withDescription?()=>setCurrentImage(image2):null} 
     onMouseLeave={!withDescription?()=>setCurrentImage(image1):null} 
     className={`${withDescription && "p-4"} flex-shrink-0 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300  bg-white`}>
      <img
        className="h-80  rounded-lg"
        src={currentImage||'https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500.jpg'}
        alt={title}
      />
      {withDescription &&
      <div className="p-2">
        <p className="font-semibold text-sm  text-gray-500 ">{title}</p>
        <p className="text-muted-foreground">{category}</p>
        <div className="flex font-medium">Rs. {price}</div>
        <div className="text-red-500">out of Stock</div>
      </div>
      }
    </div>
  );
};

export default Card;
