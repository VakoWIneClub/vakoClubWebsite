import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const WineryScoreDisplay = ({ score, className }) => {
  if (!score) return null;

  return (
    <div className={cn("flex items-center gap-1.5 text-amber-200 text-sm font-semibold", className)}>
      <Star className="h-5 w-5 text-purple-400" fill="currentColor" />
      <span className="font-bold">{Number(score).toFixed(1)}</span>
    </div>
  );
};

export default WineryScoreDisplay;