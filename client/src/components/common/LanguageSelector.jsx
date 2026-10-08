import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block p-1.5 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
    >
      <option value="en">🇺🇸 EN</option>
      <option value="hi">🇮🇳 HI</option>
    </select>
  );
};

export default LanguageSelector;
