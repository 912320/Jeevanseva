import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaHospital, FaPhoneAlt, FaMapMarkerAlt, FaStar, FaDirections, FaAmbulance, FaSearch, FaCrosshairs, FaUserMd } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const HospitalSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlSearch);
  const [type, setType] = useState('all');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [radius, setRadius] = useState('200');
  const [userCoords, setUserCoords] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [syncingGoogle, setSyncingGoogle] = useState(false);

  // Sync state when URL params change (e.g. clicking AIIMS from home)
  useEffect(() => {
    const s = searchParams.get('search') || '';
    setSearch(s);
  }, [searchParams]);

  const fetchHospitals = async (coords = userCoords) => {
    setLoading(true);
    try {
      const activeSearch = search || searchParams.get('search') || '';
      const params = {};
      if (activeSearch) params.search = activeSearch;
      if (type !== 'all') params.type = type;
      if (emergencyOnly) params.emergency = 'true';
      if (coords) {
        params.lat = coords.latitude;
        params.lng = coords.longitude;
        params.radius = radius;
      }
      const res = await api.get('/hospitals', { params });
      let list = res.data.data || [];

      // Priority sort: hospitals matching the search name (e.g. AIIMS) ALWAYS appear first!
      const q = activeSearch.trim().toLowerCase();
      if (q) {
        list.sort((a, b) => {
          const aNameMatch = (a.name && a.name.toLowerCase().includes(q));
          const bNameMatch = (b.name && b.name.toLowerCase().includes(q));
          if (aNameMatch && !bNameMatch) return -1;
          if (!aNameMatch && bNameMatch) return 1;
          if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
          return (b.rating || 0) - (a.rating || 0);
        });
      }

      setHospitals(list);
    } catch (err) {
      console.error('Error loading hospitals:', err);
      toast.error('Failed to load hospitals. Please ensure backend server is running.');
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
          fetchHospitals(coords);
        },
        () => {
          fetchHospitals(null);
        },
        { timeout: 6000 }
      );
    } else {
      fetchHospitals(userCoords);
    }
  }, [searchParams, type, emergencyOnly, radius]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHospitals();
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
        toast.success('Location detected! Sorting by proximity.');
        fetchHospitals(coords);
      },
      (error) => {
        setDetectingLocation(false);
        toast.error('Unable to retrieve location. Please search by city name.');
      },
      { timeout: 10000 }
    );
  };

  const handleGoogleSync = async () => {
    if (!userCoords) return;
    setSyncingGoogle(true);
    try {
      const response = await api.post('/hospitals/sync-rapidapi-nearby', {
        lat: userCoords.latitude,
        lng: userCoords.longitude,
        radius_km: Number(radius)
      });
      toast.success(`${response.data.data.imported} nearby hospitals saved to the database.`);
      await fetchHospitals(userCoords);
    } catch (err) {
      console.error('Error syncing nearby hospitals:', err);
      toast.error(err.response?.data?.message || 'Could not refresh nearby hospitals.');
    } finally {
      setSyncingGoogle(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setType('all');
    setEmergencyOnly(false);
    // Clearing the location is important: otherwise the old radius filter can
    // hide every seeded hospital when the user is in a different city.
    setUserCoords(null);
    fetchHospitals(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl flex items-center justify-center gap-3">
            <FaHospital className="text-primary-600" />
            Find Hospitals & Healthcare Centres
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover verified government hospitals, private care centres, PHCs, and CHCs in your vicinity.
          </p>
        </div>

        {/* Search & Location Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hospital by name, city, or area..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
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

              {userCoords && (
                <button
                  type="button"
                  onClick={handleGoogleSync}
                  disabled={syncingGoogle}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  {syncingGoogle ? 'Refreshing live hospitals...' : 'Refresh nearby hospitals'}
                </button>
              )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Filters Row */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="text-sm font-semibold text-gray-700">Filter Type:</span>
              {[
                { label: 'All Types', value: 'all' },
                { label: 'Government', value: 'government' },
                { label: 'Private', value: 'private' },
                { label: 'PHC (Primary)', value: 'phc' },
                { label: 'CHC (Community)', value: 'chc' }
              ].map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    type === t.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {userCoords && (
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-gray-600 font-medium">Radius:</span>
                  <select
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm bg-white font-medium text-gray-700"
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

              <label className="flex items-center gap-2 text-sm font-medium text-red-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={emergencyOnly}
                  onChange={(e) => setEmergencyOnly(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
                />
                <FaAmbulance />
                24/7 Emergency Only
              </label>
            </div>
          </div>
        </div>

        {/* Hospital Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : hospitals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-8">
            <FaHospital className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">No Hospitals Found</h3>
            <p className="text-gray-600 mt-2">Try widening your search terms, changing the hospital type, or increasing the radius.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {userCoords && (
                <button
                  onClick={handleGoogleSync}
                  disabled={syncingGoogle}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-60"
                >
                  {syncingGoogle ? 'Loading nearby hospitals...' : 'Load real nearby hospitals'}
                </button>
              )}
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                      hospital.type === 'government' ? 'bg-blue-100 text-blue-800' :
                      hospital.type === 'phc' || hospital.type === 'chc' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {hospital.type === 'phc' ? 'Primary Health Centre' :
                       hospital.type === 'chc' ? 'Community Health Centre' :
                       hospital.type}
                    </span>

                    {hospital.has_emergency && (
                      <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
                        <FaAmbulance /> 24/7 Emergency
                      </span>
                    )}
                  </div>

                  {/* Hospital Name & Rating */}
                  <h3 className="text-lg font-bold text-gray-900 leading-snug hover:text-primary-600 transition-colors">
                    {hospital.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center text-amber-500 text-xs">
                      <FaStar className="mr-1" />
                      <span className="font-bold">{hospital.rating || '4.5'}</span>
                    </div>
                    <span className="text-xs text-gray-400">({hospital.total_reviews || 120} reviews)</span>

                    {hospital.distance !== null && hospital.distance !== undefined && (
                      <span className="ml-auto bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded font-medium">
                        📍 {hospital.distance} km away
                      </span>
                    )}
                  </div>

                  {/* Address */}
                  <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
                    <span>{hospital.address}, {hospital.city}, {hospital.state}</span>
                  </div>

                  {/* Contact Number */}
                  {hospital.phone && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <FaPhoneAlt className="text-primary-600 text-xs" />
                      <a href={`tel:${hospital.phone}`} className="hover:text-primary-600 underline">
                        {hospital.phone}
                      </a>
                    </div>
                  )}

                  {/* Departments */}
                  {hospital.HospitalDepartments && hospital.HospitalDepartments.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Departments:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {hospital.HospitalDepartments.slice(0, 4).map((d) => (
                          <span key={d.id} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                            {d.name}
                          </span>
                        ))}
                        {hospital.HospitalDepartments.length > 4 && (
                          <span className="text-xs text-gray-400 self-center">
                            +{hospital.HospitalDepartments.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="bg-gray-50 border-t border-gray-100 p-3.5 flex items-center justify-between gap-2">
                  <a
                    href={
                      hospital.latitude && hospital.longitude
                        ? `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}&dir_action=navigate`
                        : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent([hospital.name, hospital.address, hospital.city, hospital.state].filter(Boolean).join(', '))}&dir_action=navigate`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <FaDirections className="text-blue-600" />
                    Directions
                  </a>

                  {hospital.phone && (
                    <a
                      href={`tel:${hospital.phone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <FaPhoneAlt />
                      Call Now
                    </a>
                  )}

                  <Link
                    to={`/doctors?hospitalId=${hospital.id}&hospitalName=${encodeURIComponent(hospital.name || '')}&city=${encodeURIComponent(hospital.city || '')}&lat=${hospital.latitude || ''}&lng=${hospital.longitude || ''}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold transition-colors text-center"
                  >
                    <FaUserMd />
                    Doctors
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalSearch;
