import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const WineryScoreDisplay = ({ score, className }) => {
  if (!score) return null;

  return (
    <div className={cn("flex items-center gap-1.5 text-copa-ink text-sm font-semibold", className)}>
      <Star className="h-4 w-4 text-copa-gold" fill="currentColor" />
      <span className="font-bold">{Number(score).toFixed(1)}</span>
    </div>
  );
};

export default WineryScoreDisplay;