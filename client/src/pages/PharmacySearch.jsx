import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaStore, FaPhoneAlt, FaMapMarkerAlt, FaDirections, FaSearch, FaClock, FaTruck, FaCrosshairs } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PharmacySearch = () => {
  const [searchParams] = useSearchParams();
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [is24Hours, setIs24Hours] = useState(false);
  const [homeDelivery, setHomeDelivery] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [radius, setRadius] = useState('200');

  const fetchPharmacies = async (coords = userCoords) => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (is24Hours) params.is_24_hours = 'true';
      if (homeDelivery) params.home_delivery = 'true';
      if (coords) {
        params.lat = coords.latitude;
        params.lng = coords.longitude;
        params.radius = radius;
      }
      const res = await api.get('/pharmacies', { params });
      setPharmacies(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load pharmacies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userCoords && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setUserCoords(coords);
          fetchPharmacies(coords);
        },
        () => {
          fetchPharmacies(null);
        },
        { timeout: 6000 }
      );
    } else {
      fetchPharmacies(userCoords);
    }
  }, [is24Hours, homeDelivery, radius, searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPharmacies(userCoords);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setUserCoords(coords);
        setDetectingLocation(false);
        toast.success('Location active! Sorting pharmacies by proximity.');
        fetchPharmacies(coords);
      },
      (error) => {
        setDetectingLocation(false);
        toast.error('Unable to retrieve location. Please search by area or city.');
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl flex items-center justify-center gap-3">
            <FaStore className="text-primary-600" />
            Find Pharmacies & Medical Stores
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Locate 24/7 chemists, Jan Aushadhi Kendras, and local pharmacies with home delivery.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pharmacy by name, medicine, area, or city..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={detectingLocation}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition-colors border border-blue-200 whitespace-nowrap"
            >
              <FaCrosshairs className={detectingLocation ? 'animate-spin' : ''} />
              {detectingLocation ? 'Detecting...' : userCoords ? 'Location Active ✓' : 'Use My Location'}
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap shadow-sm"
            >
              Search Stores
            </button>
          </form>

          {/* Filters */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={is24Hours}
                  onChange={(e) => setIs24Hours(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <FaClock className="text-primary-600" />
                Open 24/7 Only
              </label>

              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={homeDelivery}
                  onChange={(e) => setHomeDelivery(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <FaTruck className="text-blue-600" />
                Home Delivery Available
              </label>
            </div>

            {userCoords && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-gray-600 font-semibold">Radius:</span>
                <select
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs bg-white text-gray-700 font-medium"
                >
                  <option value="10">10 km</option>
                  <option value="25">25 km</option>
                  <option value="50">50 km</option>
                  <option value="100">100 km</option>
                  <option value="150">150 km</option>
                  <option value="200">200 km (Regional)</option>
                  <option value="">All Distances</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Pharmacy Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : pharmacies.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-8">
            <FaStore className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">No Pharmacies Found</h3>
            <p className="text-gray-600 mt-2">Try changing your search terms, increasing radius, or clearing 24/7 filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pharmacies.map((pharmacy) => (
              <div
                key={pharmacy.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    {pharmacy.is_24_hours ? (
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                        <FaClock /> 24 Hours Open
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                        {pharmacy.opening_hours || 'Standard Hours'}
                      </span>
                    )}

                    {pharmacy.distance !== null && pharmacy.distance !== undefined && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-0.5 rounded font-bold">
                        📍 {pharmacy.distance} km away
                      </span>
                    )}

                    {pharmacy.home_delivery && (
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                        <FaTruck /> Delivery
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 leading-snug">
                    {pharmacy.name}
                  </h3>

                  <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
                    <span>{pharmacy.address}, {pharmacy.city}, {pharmacy.state}</span>
                  </div>

                  {pharmacy.phone && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <FaPhoneAlt className="text-primary-600 text-xs" />
                      <a href={`tel:${pharmacy.phone}`} className="hover:text-primary-600 underline">
                        {pharmacy.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2">
                  <a
                    href={
                      pharmacy.latitude && pharmacy.longitude
                        ? `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}&dir_action=navigate`
                        : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent([pharmacy.name, pharmacy.address, pharmacy.city, pharmacy.state].filter(Boolean).join(', '))}&dir_action=navigate`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <FaDirections className="text-blue-600" />
                    Directions
                  </a>

                  {pharmacy.phone && (
                    <a
                      href={`tel:${pharmacy.phone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      <FaPhoneAlt />
                      Call Store
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacySearch;
