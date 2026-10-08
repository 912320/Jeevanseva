import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaHeartbeat, FaSearch, FaExclamationTriangle, FaUserMd, FaShieldAlt, FaAmbulance, FaInfoCircle } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const DiseaseSearch = () => {
  const [searchParams] = useSearchParams();
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('all');

  const categories = [
    'All Categories',
    'Infectious Disease',
    'Vector-borne Disease',
    'Cardiovascular Disease',
    'Respiratory Disease',
    'Chronic Metabolic Disorder'
  ];

  const fetchDiseases = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'all' && category !== 'All Categories') params.category = category;
      const res = await api.get('/diseases', { params });
      setDiseases(res.data.data || []);
    } catch (err) {
      console.error('Error loading diseases:', err);
      toast.error('Failed to load health information. Please ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDiseases();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Top Critical Disclaimer Banner */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm mb-8">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-amber-600 text-xl flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <span className="font-bold">Medical Disclaimer: </span>
              JeevanSeva provides educational healthcare information only and is <span className="font-semibold underline">not a substitute for professional medical advice, diagnosis, or treatment</span>. If you are experiencing serious or life-threatening symptoms, please contact emergency services immediately or visit the nearest hospital.
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl flex items-center justify-center gap-3">
            <FaHeartbeat className="text-primary-600" />
            Health Information & Symptom Guide
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Understand common health conditions, recognize warning signs, and learn which medical specialist to consult.
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
                placeholder="Search symptom or health condition (e.g. Fever, Cough, Chest Pain, Diabetes)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c === 'All Categories' ? 'all' : c}>
                  {c}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap shadow-sm"
            >
              Search Information
            </button>
          </form>

          {/* Symptom Quick Tags */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Common Symptoms:</span>
            {['Fever', 'Cough', 'Joint Pain', 'Headache', 'Shortness of Breath', 'Body Ache', 'Chest Pain'].map(sym => (
              <button
                key={sym}
                type="button"
                onClick={() => { setSearch(sym); fetchDiseases(); }}
                className="bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium transition-colors"
              >
                + {sym}
              </button>
            ))}
          </div>
        </div>

        {/* Diseases List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : diseases.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-8">
            <FaHeartbeat className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">No Information Found</h3>
            <p className="text-gray-600 mt-2">Try searching with a common symptom or resetting your category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diseases.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Category & Emergency Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded text-xs font-semibold">
                      {d.category || 'General'}
                    </span>

                    {d.is_emergency && (
                      <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold animate-pulse">
                        <FaAmbulance /> Urgent Medical Condition
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 leading-snug">
                    {d.name}
                  </h3>
                  {d.name_hindi && (
                    <p className="text-sm font-medium text-emerald-700 mt-0.5">
                      {d.name_hindi}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                    {d.description}
                  </p>

                  {/* Symptoms Tags */}
                  {d.Symptoms && d.Symptoms.length > 0 && (
                    <div className="mt-4">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                        Typical Symptoms to Observe:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {d.Symptoms.map((s) => (
                          <span key={s.id} className="bg-amber-50 text-amber-800 border border-amber-200 text-xs px-2 py-0.5 rounded font-medium">
                            • {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Precautions */}
                  {d.precautions && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-700">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
                        <FaShieldAlt /> General Care & Precautions:
                      </div>
                      <p>{d.precautions}</p>
                    </div>
                  )}

                  {/* When to visit doctor */}
                  {d.when_to_see_doctor && (
                    <div className="mt-2.5 p-3 bg-red-50 rounded-lg border border-red-100 text-xs text-red-900">
                      <div className="flex items-center gap-1.5 font-bold text-red-700 mb-1">
                        <FaInfoCircle /> When to Consult a Doctor:
                      </div>
                      <p>{d.when_to_see_doctor}</p>
                    </div>
                  )}
                </div>

                {/* Footer Specialist Link */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Recommended Specialty: <strong className="text-gray-800">{d.specialty || 'General Physician'}</strong>
                  </span>

                  <Link
                    to={`/doctors?search=${encodeURIComponent(d.specialty || d.name)}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <FaUserMd />
                    Find Specialist Doctors
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

export default DiseaseSearch;
