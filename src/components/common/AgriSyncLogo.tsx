import React from 'react';

interface AgriSyncLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'on-dark' | 'navbar';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const AgriSyncLogo: React.FC<AgriSyncLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md'
}) => {
  // If navbar specific variant, render perfectly scaled for headers
  if (variant === 'navbar') {
    return (
      <div className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}>
        <img
          src="/logo.png"
          alt="AgriSync Logo"
          className="h-9 sm:h-10 md:h-11 w-auto object-contain select-none"
          loading="eager"
        />
      </div>
    );
  }

  const sizeClasses = {
    xs: variant === 'icon' ? 'w-6 h-6' : 'h-6',
    sm: variant === 'icon' ? 'w-8 h-8' : 'h-8 sm:h-9',
    md: variant === 'icon' ? 'w-10 h-10' : 'h-10 sm:h-11',
    lg: variant === 'icon' ? 'w-14 h-14' : 'h-13 sm:h-15',
    xl: variant === 'icon' ? 'w-18 h-18' : 'h-16 sm:h-20'
  };

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}>
        <img
          src="/icon.png"
          alt="AgriSync Emblem"
          className={`${sizeClasses[size]} w-auto object-contain rounded-md select-none`}
          loading="eager"
        />
      </div>
    );
  }

  if (variant === 'on-dark') {
    return (
      <div className={`inline-flex items-center justify-center bg-white px-2.5 py-1.5 rounded-lg shadow-xs ${className}`}>
        <img
          src="/logo.png"
          alt="AgriSync Logo"
          className={`${sizeClasses[size]} w-auto object-contain select-none`}
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <img
        src="/logo.png"
        alt="AgriSync Logo"
        className={`${sizeClasses[size]} w-auto object-contain select-none`}
        loading="eager"
      />
    </div>
  );
};
