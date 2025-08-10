import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
  onClick?: () => void;
}

export default function Card({ 
  children, 
  variant = 'default', 
  className = '',
  onClick 
}: CardProps) {
  const baseClasses = 'rounded-xl overflow-hidden transition-all duration-200';
  
  const variants = {
    default: 'bg-white shadow-sm border border-gray-100',
    elevated: 'bg-white shadow-lg border border-gray-100 hover:shadow-xl',
    outlined: 'bg-white border-2 border-gray-200'
  };
  
  const interactiveClasses = onClick ? 'cursor-pointer hover:scale-[1.02]' : '';
  
  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
