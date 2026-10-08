import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaUserMd, FaPhoneAlt, FaStar, FaCheckCircle, FaHospital, FaSearch, FaCalendarCheck, FaLanguage, FaGraduationCap, FaCrosshairs, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const DoctorSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('all');
  const [maxFee, setMaxFee] = useState('');
  const [minExp, setMinExp] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [radius, setRadius] = useState('200');

  const hospitalIdParam = searchParams.get('hospitalId');
  const hospitalNameParam = searchParams.get('hospitalName');
  const cityParam = searchParams.get('city');
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');

  const specializationsList = [
    'All Specializations',
    'General Medicine',
    'Cardiology',
    'Pediatrics',
    'Gynecology',
    'Orthopedics',
    'Dermatology',
    'Endocrinology',
    'Neurology',
    'Dentistry',
    'Ophthalmology'
  ];

  const fetchDoctors = async (coords = userCoords) => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (specialization !== 'all' && specialization !== 'All Specializations') {
        params.specialization = specialization;
      }
      if (maxFee) params.maxFee = maxFee;
      if (minExp) params.minExp = minExp;

      // Active coordinates from user geolocation or hospital query params
      const activeLat = coords?.latitude || (latParam ? parseFloat(latParam) : null);
      const activeLng = coords?.longitude || (lngParam ? parseFloat(lngParam) : null);

      if (activeLat && activeLng) {
        params.lat = activeLat;
        params.lng = activeLng;
        params.radius = radius;
      }

      if (hospitalIdParam) {
        params.hospitalId = hospitalIdParam;
      }

      if (cityParam && !activeLat) {
        params.city = cityParam;
      }

      const res = await api.get('/doctors', { params });
      setDoctors(res.data.data || []);
    } catch (err) {
      console.error('Error loading doctors:', err);
      toast.error('Failed to load doctors list. Please ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (latParam && lngParam) {
      const initialCoords = { latitude: parseFloat(latParam), longitude: parseFloat(lngParam) };
      setUserCoords(initialCoords);
      fetchDoctors(initialCoords);
    } else if (!userCoords && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setUserCoords(coords);
          fetchDoctors(coords);
        },
        () => {
          fetchDoctors(null);
        },
        { timeout: 6000 }
      );
    } else {
      fetchDoctors(userCoords);
    }
  }, [searchParams, specialization, maxFee, minExp, radius]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors(userCoords);
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
        toast.success('Location detected! Sorting doctors by proximity.');
        fetchDoctors(coords);
      },
      (error) => {
        setDetectingLocation(false);
        toast.error('Unable to retrieve location. Please search by name or city.');
      },
      { timeout: 10000 }
    );
  };

  const handleResetFilters = () => {
    setSearch('');
    setSpecialization('all');
    setMaxFee('');
    setMinExp('');
    setUserCoords(null);
    setSearchParams({});
    // fetch all doctors without restrictions
    api.get('/doctors').then(res => setDoctors(res.data.data || [])).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl flex items-center justify-center gap-3">
            <FaUserMd className="text-primary-600" />
            Find Verified Doctors Near You
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with experienced medical specialists, general physicians, and community doctors for consultations.
          </p>
        </div>

        {/* Active Hospital or Location Banner */}
        {(hospitalNameParam || cityParam || userCoords) && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FaMapMarkerAlt className="text-emerald-600 text-base" />
              <span>
                {hospitalNameParam ? (
                  <>Showing doctors affiliated with or near <strong>{hospitalNameParam}</strong> {cityParam ? `(${cityParam})` : ''}</>
                ) : userCoords ? (
                  <>Showing doctors sorted by proximity to <strong>Your Current Location</strong></>
                ) : (
                  <>Showing doctors in <strong>{cityParam}</strong></>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-300 transition-colors"
            >
              <FaTimes /> Show All Doctors
            </button>
          </div>
        )}

        {/* Search & Location Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctor by name, specialty, or clinic..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
            >
              {specializationsList.map((spec) => (
                <option key={spec} value={spec === 'All Specializations' ? 'all' : spec}>
                  {spec}
                </option>
              ))}
            </select>

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
              Search Doctors
            </button>
          </form>

          {/* Quick Filter Chips & Radius */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee Range:</span>
              {[
                { label: 'Any Fee', value: '' },
                { label: 'Under ₹300', value: '300' },
                { label: 'Under ₹500', value: '500' },
                { label: 'Under ₹1000', value: '1000' }
              ].map(f => (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => setMaxFee(f.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    maxFee === f.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {(userCoords || latParam) && (
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

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Experience:</span>
                {[
                  { label: 'All', value: '' },
                  { label: '5+ Yrs', value: '5' },
                  { label: '10+ Yrs', value: '10' }
                ].map(exp => (
                  <button
                    key={exp.label}
                    type="button"
                    onClick={() => setMinExp(exp.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      minExp === exp.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-8">
            <FaUserMd className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">No Doctors Found</h3>
            <p className="text-gray-600 mt-2">Try adjusting your filters, increasing your radius, or resetting all filters.</p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => {
              const specName = doctor.DoctorSpecializations?.[0]?.specialization || 'General Specialist';
              const hospitalAffil = doctor.Hospitals?.[0];
              const docUser = doctor.User || {};

              return (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5">
                    {/* Top Row: Avatar & Basic Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-primary-700 flex items-center justify-center font-bold text-2xl flex-shrink-0 border-2 border-primary-200">
                        {docUser.avatar ? (
                          <img src={docUser.avatar} alt={docUser.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          docUser.name?.charAt(0) || 'D'
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-lg font-bold text-gray-900 truncate">
                            {docUser.name || 'Doctor'}
                          </h3>
                          {doctor.is_verified && (
                            <span className="text-blue-500 text-sm" title="Verified Doctor">
                              <FaCheckCircle />
                            </span>
                          )}
                        </div>

                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {specName}
                        </span>

                        <div className="flex items-center gap-1 mt-1 text-amber-500 text-xs">
                          <FaStar />
                          <span className="font-bold text-gray-800">{doctor.rating || '4.8'}</span>
                          <span className="text-gray-400">({doctor.total_reviews || 80} reviews)</span>

                          {doctor.distance !== null && doctor.distance !== undefined && (
                            <span className="ml-auto bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-semibold border border-emerald-200 flex items-center gap-1">
                              <FaMapMarkerAlt className="text-emerald-600 text-xs" />
                              {doctor.distance === 0 ? 'At this Hospital' : `${doctor.distance} km away`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Qualifications & Experience */}
                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaGraduationCap className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{doctor.qualification || 'MBBS'}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-gray-500">Experience:</span>
                        <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded font-semibold">
                          {doctor.experience_years || 5} Years
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-gray-500">Consultation Fee:</span>
                        <span className="text-emerald-700 font-bold text-sm">
                          ₹{doctor.consultation_fee || 300}
                        </span>
                      </div>

                      {hospitalAffil && (
                        <div className="flex items-start gap-2 text-xs text-gray-600 pt-1">
                          <FaHospital className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{hospitalAffil.name}, {hospitalAffil.city}</span>
                        </div>
                      )}

                      {doctor.languages_spoken && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FaLanguage className="text-gray-400 flex-shrink-0" />
                          <span>{doctor.languages_spoken}</span>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    {doctor.bio && (
                      <p className="mt-3 text-xs text-gray-500 line-clamp-2 italic">
                        "{doctor.bio}"
                      </p>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="bg-gray-50 border-t border-gray-100 p-3.5 flex items-center justify-between gap-3">
                    {docUser.phone && (
                      <a
                        href={`tel:${docUser.phone}`}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <FaPhoneAlt className="text-emerald-600" />
                        Call
                      </a>
                    )}

                    <Link
                      to={`/book-appointment/${doctor.id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold transition-colors text-center shadow-sm"
                    >
                      <FaCalendarCheck />
                      Book Appointment
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;
