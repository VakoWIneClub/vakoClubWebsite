import React from 'react';
import { cn } from '@/lib/utils';

const GrapeIcon = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(className)}
    {...props}
  >
    <path d="M22 5V2l-5.3 5.3" />
    <path d="M15.4 12.3c.8-1.5.5-3.5-.9-4.7s-3.2-1.7-4.7-.9" />
    <path d="M10.1 16.2c.8-1.5.5-3.5-.9-4.7s-3.2-1.7-4.7-.9" />
    <path d="M15.6 19.8c.8-1.5.5-3.5-.9-4.7s-3.2-1.7-4.7-.9" />
    <path d="M6.4 12.8c.8-1.5.5-3.5-.9-4.7s-3.2-1.7-4.7-.9" />
    <circle cx="12" cy="8" r="2" />
    <circle cx="7" cy="13" r="2" />
    <circle cx="12" cy="18" r="2" />
    <circle cx="17" cy="13" r="2" />
    <circle cx="7" cy="3" r="1" />
  </svg>
);

export default GrapeIcon;