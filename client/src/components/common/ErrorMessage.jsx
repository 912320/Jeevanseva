import React from 'react';
import { FaExclamationCircle, FaRedo } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const ErrorMessage = ({ message, onRetry }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md my-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FaExclamationCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-700 font-medium">{message}</p>
        </div>
        {onRetry && (
          <div className="ml-auto pl-3">
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-red-700 hover:text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-md transition-colors"
            >
              <FaRedo className="text-xs" />
              {t('common.retry')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
