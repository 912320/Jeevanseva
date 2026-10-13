import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHospital, FaUserMd, FaPills, FaHeartbeat, FaAmbulance, FaSearch, FaMapMarkerAlt, FaStore } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim().toLowerCase();

    // Contextual routing based on search intent
    if (query.includes('child') || query.includes('pediatric') || query.includes('kid') || query.includes('baby') || query.includes('bachha')) {
      navigate(`/doctors?specialization=Pediatrics`);
    } else if (query.includes('heart') || query.includes('cardio')) {
      navigate(`/doctors?specialization=Cardiology`);
    } else if (query.includes('skin') || query.includes('derma')) {
      navigate(`/doctors?specialization=Dermatology`);
    } else if (query.includes('doctor') || query.includes('specialist') || query.includes('physician') || query.includes('dentist') || query.includes('cardiologist')) {
      navigate(`/doctors?search=${encodeURIComponent(searchQuery)}`);
    } else if (query.includes('fever') || query.includes('cough') || query.includes('pain') || query.includes('diabetes') || query.includes('dengue') || query.includes('asthma')) {
      navigate(`/diseases?search=${encodeURIComponent(searchQuery)}`);
    } else if (query.includes('medicine') || query.includes('tablet') || query.includes('syrup') || query.includes('paracetamol')) {
      navigate(`/medicines?search=${encodeURIComponent(searchQuery)}`);
    } else if (query.includes('pharmacy') || query.includes('chemist') || query.includes('medical store')) {
      navigate(`/pharmacies?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/hospitals?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const suggestions = [
    { label: 'Fever', route: '/diseases?search=Fever' },
    { label: 'Diabetes', route: '/diseases?search=Diabetes' },
    { label: 'Heart Specialist', route: '/doctors?specialization=Cardiology' },
    { label: 'Child Specialist', route: '/doctors?specialization=Pediatrics' },
    { label: 'Skin Problem', route: '/doctors?specialization=Dermatology' },
    { label: 'AIIMS Hospital', route: '/hospitals?search=AIIMS' },
    { label: 'Emergency Care', route: '/emergency' },
    { label: '24/7 Pharmacy', route: '/pharmacies' }
  ];

  return (
    <div className="flex-1 w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            {t('hero.title') || 'Find Healthcare Near You'}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            {t('hero.subtitle') || 'Discover nearby hospitals, doctors, pharmacies and healthcare services in your area.'}
          </p>

          <div className="bg-white p-2 rounded-full shadow-lg max-w-3xl mx-auto flex items-center border border-gray-100">
            <form onSubmit={handleSearch} className="flex-1 flex items-center px-4">
              <FaSearch className="text-gray-400 text-lg mr-3" />
              <input 
                type="text" 
                placeholder="Enter disease, symptom, hospital, or specialist doctor..."
                className="w-full py-3 focus:outline-none text-gray-700 text-base sm:text-lg bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <button
              type="button"
              onClick={() => navigate('/hospitals')}
              className="hidden sm:flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-full transition-colors mr-2 text-sm font-medium"
            >
              <FaMapMarkerAlt className="text-primary-600" />
              <span>Use My Location</span>
            </button>
            <button
              onClick={handleSearch}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 sm:px-8 py-3 rounded-full font-medium transition-colors"
            >
              Search
            </button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {suggestions.map((item, idx) => (
              <button 
                key={idx} 
                type="button"
                onClick={() => navigate(item.route)}
                className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs sm:text-sm text-gray-600 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-colors shadow-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          <Link to="/hospitals" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all block">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              <FaHospital />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nearby Hospitals & PHCs</h3>
            <p className="text-gray-600 text-sm">Locate government hospitals, rural PHCs, CHCs, and private multi-specialty centres near your location.</p>
          </Link>

          <Link to="/doctors" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all block">
            <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              <FaUserMd />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Find Doctors & Specialists</h3>
            <p className="text-gray-600 text-sm">Connect with verified doctors, view consultation timings, check fees, and schedule appointments.</p>
          </Link>

          <Link to="/medicines" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all block">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              <FaPills />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Medicine Information</h3>
            <p className="text-gray-600 text-sm">Search generic medicines, side effects, precautions, and safe usage guidelines with strict medical cautions.</p>
          </Link>

          <Link to="/diseases" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all block">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              <FaHeartbeat />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Health & Symptom Guide</h3>
            <p className="text-gray-600 text-sm">Recognize early health warnings, learn preventive healthcare tips, and know when to seek a doctor's care.</p>
          </Link>

          <Link to="/emergency" className="group bg-red-50 p-8 rounded-2xl shadow-sm border border-red-100 hover:shadow-md hover:border-red-200 transition-all block">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              <FaAmbulance />
            </div>
            <h3 className="text-xl font-bold text-red-700 mb-2">24/7 Emergency Care</h3>
            <p className="text-red-600/80 text-sm">Instant 1-tap call buttons for National Emergency 112, 108 Ambulance, and nearby trauma casualty hospitals.</p>
          </Link>
          
          <Link to="/pharmacies" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all block">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              <FaStore />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nearby Pharmacies</h3>
            <p className="text-gray-600 text-sm">Locate 24-hour medical stores, Jan Aushadhi Kendras, and chemists providing emergency home delivery.</p>
          </Link>

        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How JeevanSeva Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            <div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-xl font-bold text-primary-600 shadow-md mx-auto mb-6 border-4 border-gray-50">1</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Search or Enter Location</h4>
              <p className="text-gray-600 text-sm">Share your location or search by city, hospital name, disease, or medical symptom.</p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-xl font-bold text-primary-600 shadow-md mx-auto mb-6 border-4 border-gray-50">2</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Browse Verified Facilities</h4>
              <p className="text-gray-600 text-sm">Compare distances, emergency availability, government vs private care, and doctor fees.</p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-xl font-bold text-primary-600 shadow-md mx-auto mb-6 border-4 border-gray-50">3</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Connect & Book In Seconds</h4>
              <p className="text-gray-600 text-sm">Book convenient appointment slots, get driving directions, or directly call emergency contacts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <div className="bg-primary-900 text-primary-100 py-6 px-4 text-center text-sm">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <FaHeartbeat className="text-2xl text-primary-400 shrink-0" />
          <p>JeevanSeva is an educational discovery portal. We do not replace professional medical diagnosis or consultation. In critical health emergencies, please call 112 or visit the nearest trauma centre immediately.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
