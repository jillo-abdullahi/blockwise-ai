import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "w-7 h-7", 
  size 
}) => {
  const sizeProps = size ? { width: size, height: size } : {};
  
  return (
    <svg 
      className={className}
      fill="currentColor" 
      viewBox="0 0 24 24"
      {...sizeProps}
    >
      {/* Bar chart bars */}
      <rect x="4" y="16" width="2.5" height="6" rx="0.5" />
      <rect x="7.5" y="12" width="2.5" height="10" rx="0.5" />
      <rect x="11" y="8" width="2.5" height="14" rx="0.5" />
      <rect x="14.5" y="14" width="2.5" height="8" rx="0.5" />
      <rect x="18" y="10" width="2.5" height="12" rx="0.5" />
      
      {/* AI sparkle on top of highest bar */}
      <g fill="currentColor" stroke="none">
        <circle cx="12.25" cy="6" r="0.5" />
        <path d="M12.25 4.5l0.3 0.9h0.9l-0.7 0.5 0.3 0.9-0.8-0.6-0.8 0.6 0.3-0.9-0.7-0.5h0.9z" />
      </g>
    </svg>
  );
};

export default Logo;
