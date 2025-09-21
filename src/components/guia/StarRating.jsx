import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const StarRating = ({ rating, size = 20, className, interactive = false, onRatingChange = () => {} }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseMove = (e, index) => {
    if (!interactive) return;
    const starElement = e.currentTarget;
    const rect = starElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newHover = index - 1 + Math.max(0.1, Math.min(1, Math.round(percentage * 10) / 10));
    setHoverRating(newHover);
  };
  
  const handleClick = () => {
    if (!interactive) return;
    onRatingChange(hoverRating);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };
  
  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className={cn("flex items-center gap-1", className)} onMouseLeave={handleMouseLeave}>
      {[...Array(5)].map((_, i) => {
        const starIndex = i + 1;
        const full = starIndex <= Math.floor(displayRating);
        const partial = displayRating > i && displayRating < starIndex;
        const partialWidth = partial ? `${(displayRating - i) * 100}%` : '0%';

        return (
          <div
            key={starIndex}
            className="relative"
            onMouseMove={(e) => handleMouseMove(e, starIndex)}
            onClick={handleClick}
          >
            <Star
              style={{ width: size, height: size }}
              className="text-gray-500/50"
            />
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: full ? '100%' : partialWidth }}
            >
              <Star
                style={{ width: size, height: size }}
                className="text-amber-400"
                fill="currentColor"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;