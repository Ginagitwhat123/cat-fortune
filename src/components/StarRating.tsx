import React from 'react';

interface StarRatingProps {
  stars: number;
  maxStars?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ stars, maxStars = 5 }) => {
  return (
    <div className="flex justify-center gap-1">
      {Array.from({ length: maxStars }).map((_, index) => (
        <span
          key={index}
          className={`text-sm md:text-xl lg:text-3xl ${
            index < stars ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

