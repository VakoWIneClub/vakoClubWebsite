
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import GrapeIcon from '@/components/ui/GrapeIcon';

const GrapeRating = ({ rating, size = 20, className, interactive = false, onRatingChange = () => {} }) => {
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
        const grapeIndex = i + 1;
        const full = grapeIndex <= Math.floor(displayRating);
        const partial = displayRating > i && displayRating < grapeIndex;
        const partialWidth = partial ? `${(displayRating - i) * 100}%` : '0%';

        return (
          <div
            key={grapeIndex}
            className="relative"
            onMouseMove={(e) => handleMouseMove(e, grapeIndex)}
            onClick={handleClick}
          >
            <GrapeIcon
              style={{ width: size, height: size }}
              className="text-gray-500/50"
            />
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: full ? '100%' : partialWidth }}
            >
              <GrapeIcon
                style={{ width: size, height: size }}
                className="text-violet-400"
                fill="currentColor"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GrapeRating;
