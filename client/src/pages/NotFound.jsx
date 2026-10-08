import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-9xl font-black text-gray-200 mb-4">404</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('errors.notFound')}</h2>
      <p className="text-gray-600 mb-8 max-w-md text-center">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
