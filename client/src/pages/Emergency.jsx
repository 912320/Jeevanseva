import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaAmbulance, FaPhoneAlt, FaHospital, FaDirections, FaExclamationTriangle, FaHeartbeat, FaCrosshairs, FaMapMarkerAlt, FaShareAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Emergency = () => {
  const [data, setData] = useState({ nationalHelplines: [], emergencyHospitals: [] });
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const fetchEmergency = async (coords = userCoords) => {
    setLoading(true);
    try {
      const params = {};
      if (coords) {
        params.lat = coords.latitude;
        params.lng = coords.longitude;
        params.radius = 200;
      }
      const res = await api.get('/emergency', { params });
      setData(res.data.data || { nationalHelplines: [], emergencyHospitals: [] });
    } catch (err) {
      toast.error('Unable to fetch emergency data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Attempt auto-detection of location for fast emergency assistance
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setUserCoords(coords);
          fetchEmergency(coords);
        },
        () => {
          // If denied or timed out, load default national list
          fetchEmergency(null);
        },
        { timeout: 6000 }
      );
    } else {
      fetchEmergency(null);
    }
  }, []);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your device.');
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
        toast.success('Location active! Closest trauma centers sorted.');
        fetchEmergency(coords);
      },
      (error) => {
        setDetectingLocation(false);
        toast.error('Unable to get GPS location. Please check browser permissions.');
      },
      { timeout: 10000 }
    );
  };

  const handleShareLocation = () => {
    if (!userCoords) {
      toast.error('Please detect location first.');
      return;
    }
    const mapUrl = `https://www.google.com/maps?q=${userCoords.latitude},${userCoords.longitude}`;
    const text = encodeURIComponent(`EMERGENCY: I need urgent medical assistance. My live location: ${mapUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const emergencyNumbers = [
    { title: 'National Emergency Helpline', number: '112', desc: 'Police, Fire, Ambulance 24/7 all-in-one helpline', color: 'bg-red-600 hover:bg-red-700' },
    { title: 'Free Medical Ambulance', number: '108', desc: 'Government emergency ambulance dispatch across India', color: 'bg-emerald-600 hover:bg-emerald-700' },
    { title: 'Maternal & Neonatal Transport', number: '102', desc: 'Free emergency ambulance for pregnant women and newborns', color: 'bg-purple-600 hover:bg-purple-700' },
    { title: 'National Health Helpline', number: '1075', desc: 'Ministry of Health 24/7 medical queries & alerts', color: 'bg-blue-600 hover:bg-blue-700' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Big Urgent Alert */}
        <div className="bg-red-600 text-white p-6 rounded-2xl shadow-lg mb-8 text-center">
          <FaExclamationTriangle className="text-4xl mx-auto mb-2 text-yellow-300 animate-bounce" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            EMERGENCY MEDICAL ASSISTANCE
          </h1>
          <p className="text-red-100 text-base sm:text-lg mt-1 max-w-2xl mx-auto">
            If a patient is unconscious, experiencing severe chest pain, major trauma, or difficulty breathing, call emergency services immediately.
          </p>
        </div>

        {/* 1-Tap Emergency Dials */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaPhoneAlt className="text-red-600" />
            1-Tap Emergency Helpline Numbers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergencyNumbers.map((em) => (
              <a
                key={em.number}
                href={`tel:${em.number}`}
                className={`${em.color} text-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group`}
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/80 block">
                    {em.title}
                  </span>
                  <div className="text-4xl font-extrabold mt-1 tracking-tight flex items-center justify-between">
                    {em.number}
                    <FaPhoneAlt className="text-2xl opacity-75 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <p className="text-xs text-white/90 mt-4 leading-relaxed">
                  {em.desc}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Regional Emergency & Ambulance Services */}
        {data.services && data.services.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaAmbulance className="text-red-600" />
                Regional Ambulance & Specialized Emergency Networks (200 km)
              </h2>
              <span className="text-xs text-gray-500 font-medium">GPS-tracked & ICU-equipped</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.services.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="bg-red-50 text-red-700 font-bold text-xs px-2.5 py-0.5 rounded-full border border-red-200">
                        {srv.type || 'Emergency'}
                      </span>
                      <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                        24/7 Active
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 leading-snug">
                      {srv.name}
                    </h3>

                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {srv.description}
                    </p>

                    {srv.coverage_area && (
                      <p className="text-xs text-gray-500 mt-2 font-medium">
                        📍 Coverage: <span className="text-gray-700">{srv.coverage_area}</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">Dispatch:</span>
                    <a
                      href={`tel:${srv.phone}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                    >
                      <FaPhoneAlt /> Call {srv.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Hospitals */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaHospital className="text-primary-600" />
                Nearby 24/7 Emergency & Trauma Hospitals
              </h2>
              <span className="text-xs text-gray-500 font-medium">Equipped with 24/7 Casualty & Critical Care Units</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detectingLocation}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold border border-blue-200 transition-colors whitespace-nowrap"
              >
                <FaCrosshairs className={detectingLocation ? 'animate-spin' : ''} />
                {detectingLocation ? 'Detecting...' : userCoords ? 'Location Active ✓' : 'Detect My Location'}
              </button>

              {userCoords && (
                <button
                  type="button"
                  onClick={handleShareLocation}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm"
                >
                  <FaShareAlt />
                  Share Live Location
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(data.emergencyHospitals || []).map((hosp) => (
                <div
                  key={hosp.id}
                  className="bg-white rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-shadow p-5 flex flex-col justify-between border-t-4 border-t-red-500"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="bg-red-50 text-red-700 font-bold text-xs px-2 py-0.5 rounded flex items-center gap-1">
                        <FaAmbulance /> 24/7 Trauma Unit
                      </span>
                      {hosp.distance !== null && hosp.distance !== undefined ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-0.5 rounded font-bold">
                          📍 {hosp.distance} km away
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">{hosp.type?.toUpperCase()}</span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 leading-snug">
                      {hosp.name}
                    </h3>

                    <p className="text-sm text-gray-600 mt-2">
                      {hosp.address}, {hosp.city}
                    </p>

                    {hosp.emergency_contact && (
                      <div className="mt-3 p-2 bg-red-50 rounded-lg text-xs text-red-900 font-semibold flex items-center gap-2">
                        <FaPhoneAlt className="text-red-600" />
                        Emergency Dept: {hosp.emergency_contact}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2">
                    <a
                      href={
                        hosp.latitude && hosp.longitude
                          ? `https://www.google.com/maps/dir/?api=1&destination=${hosp.latitude},${hosp.longitude}&dir_action=navigate`
                          : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent([hosp.name, hosp.address, hosp.city, hosp.state].filter(Boolean).join(', '))}&dir_action=navigate`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold"
                    >
                      <FaDirections className="text-blue-600" />
                      Navigate Now
                    </a>

                    {(hosp.emergency_contact || hosp.phone) && (
                      <a
                        href={`tel:${hosp.emergency_contact || hosp.phone}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm"
                      >
                        <FaPhoneAlt />
                        Call Hospital
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Emergency;
