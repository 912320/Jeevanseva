import React from 'react';
import { classNames } from '../../utils/helpers';

const LoadingSpinner = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div 
        className={classNames(
          'animate-spin rounded-full border-gray-200 border-t-primary-600',
          sizeClasses[size]
        )}
      ></div>
      {message && <p className="mt-3 text-sm text-gray-600 font-medium">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
