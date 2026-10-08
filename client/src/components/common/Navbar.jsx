import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaHospital, FaUserMd, FaPills, FaHeartbeat, FaAmbulance, FaBars, FaTimes, FaUser, FaBell, FaPlusSquare } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';
import { classNames } from '../../utils/helpers';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    closeMenu();
  };

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: null },
    { to: '/hospitals', label: t('nav.findHospital'), icon: FaHospital },
    { to: '/doctors', label: t('nav.findDoctor'), icon: FaUserMd },
    { to: '/medicines', label: t('nav.medicines'), icon: FaPills },
    { to: '/diseases', label: t('nav.healthInfo'), icon: FaHeartbeat },
    { to: '/emergency', label: t('nav.emergency'), icon: FaAmbulance, isEmergency: true },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
              <FaPlusSquare className="text-primary-600 text-3xl" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">JeevanSeva</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  classNames(
                    'flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors',
                    link.isEmergency 
                      ? 'text-emergency-600 hover:text-emergency-700 font-bold' 
                      : isActive 
                        ? 'text-primary-600' 
                        : 'text-gray-600 hover:text-primary-600'
                  )
                }
              >
                {link.icon && <link.icon className="text-lg" />}
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            
            {isAuthenticated ? (
              <>
                <button className="text-gray-500 hover:text-primary-600 relative">
                  <FaBell className="text-xl" />
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      {user?.name?.charAt(0).toUpperCase() || <FaUser />}
                    </div>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100">
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>{t('nav.dashboard')}</Link>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>{t('nav.profile')}</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('nav.logout')}</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium text-sm">{t('nav.login')}</Link>
                <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-primary-700 transition-colors">{t('nav.register')}</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-4">
            <LanguageSelector />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full z-40">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  classNames(
                    'flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium',
                    link.isEmergency 
                      ? 'text-emergency-600 bg-emergency-50' 
                      : isActive 
                        ? 'text-primary-700 bg-primary-50' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                  )
                }
              >
                {link.icon && <link.icon className="text-xl" />}
                {link.label}
              </NavLink>
            ))}
            
            <div className="pt-4 pb-2 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500 uppercase">{user?.name}</div>
                  <Link to="/dashboard" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">{t('nav.dashboard')}</Link>
                  <Link to="/profile" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">{t('nav.profile')}</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">{t('nav.logout')}</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 px-3 mt-4">
                  <Link to="/login" onClick={closeMenu} className="w-full flex justify-center py-2 px-4 border border-primary-600 rounded-md text-primary-600 font-medium hover:bg-primary-50">{t('nav.login')}</Link>
                  <Link to="/register" onClick={closeMenu} className="w-full flex justify-center py-2 px-4 bg-primary-600 rounded-md text-white font-medium hover:bg-primary-700">{t('nav.register')}</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
