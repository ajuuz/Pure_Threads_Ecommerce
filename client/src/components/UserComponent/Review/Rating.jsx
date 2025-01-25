import { StarIcon } from "lucide-react";
import React, { useState } from "react";

const Rating = ({rating,setRating}) => {
  

  const handleRatingChange = (newRating) => {
    setRating(newRating)
  }
  return (
    <div className="flex items-center space-x-1 mt-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <StarIcon
        key={star}
        className={`w-6 h-6 cursor-pointer ${
          star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
        onClick={() => handleRatingChange(star)}
      />
    ))}
  </div>
  );
};

export default Rating;
