import React, { useState } from "react";

const Rating = () => {
  const [rating, setRating] = useState(0); // Store the selected rating
  const [hover, setHover] = useState(0); // Track hover state

  return (
    <div className="flex items-center space-x-2">
      {[...Array(5)].map((_, index) => {
        const starIndex = index + 1;
        return (
          <svg
            key={index}
            onClick={() => setRating(starIndex)}
            onMouseEnter={() => setHover(starIndex)}
            onMouseLeave={() => setHover(0)}
            className={`w-8 h-8 cursor-pointer ${
              starIndex <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      })}
    </div>
  );
};

export default Rating;
