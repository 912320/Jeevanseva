import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPills, FaSearch, FaExclamationTriangle, FaPrescriptionBottleAlt, FaShieldAlt, FaStore, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const MedicineSearch = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const fetchMedicines = async (searchTerm) => {
    setLoading(true);
    const currentSearch = searchTerm !== undefined ? searchTerm : search;
    try {
      const params = {};
      if (currentSearch) params.search = currentSearch;
      if (category !== 'all') params.category = category;
      const res = await api.get('/medicines', { params });
      setMedicines(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load medicines.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMedicines();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Safety Disclaimer Banner */}
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl shadow-sm mb-8">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-red-600 text-xl flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-900">
              <span className="font-bold">Important Medicine Safety Notice: </span>
              JeevanSeva provides informational details about common medications. <span className="font-semibold underline">Never self-medicate or alter dosage without consulting a licensed physician or registered pharmacist.</span> Prescription-only medications (marked with Rx) must only be purchased with a valid medical prescription.
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl flex items-center justify-center gap-3">
            <FaPills className="text-primary-600" />
            Medicines & Pharmaceutical Information
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Look up common generic drugs, safety warnings, proper uses, and discover nearby licensed pharmacies.
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
                placeholder="Search medicine by brand name, generic name, or common condition..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap shadow-sm"
            >
              Search Medicines
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Suggestions:</span>
            {['Paracetamol', 'Azithromycin', 'Metformin', 'Telmisartan', 'ORS'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => { setSearch(m); fetchMedicines(m); }}
                className="bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium transition-colors"
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Medicines Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-8">
            <FaPills className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">No Medicines Found</h3>
            <p className="text-gray-600 mt-2">Try searching by generic formula or common brand name.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Prescription Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5 rounded font-medium">
                      {m.category || 'Medication'}
                    </span>

                    {m.prescription_required ? (
                      <span className="bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                        <FaPrescriptionBottleAlt /> Rx Required
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-xs font-bold">
                        OTC (Over-the-Counter)
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 leading-snug">
                    {m.name}
                  </h3>
                  {m.name_hindi && (
                    <p className="text-xs font-medium text-emerald-700 mt-0.5">{m.name_hindi}</p>
                  )}

                  <p className="text-xs text-gray-500 mt-1 italic">
                    Generic: <strong className="text-gray-700">{m.generic_name}</strong>
                  </p>

                  {/* Common Uses */}
                  {m.uses && (
                    <div className="mt-3 text-xs text-gray-600">
                      <strong className="text-gray-900 block mb-1">Common Uses:</strong>
                      <p className="line-clamp-2">{m.uses}</p>
                    </div>
                  )}

                  {/* Precautions */}
                  {m.precautions && (
                    <div className="mt-3 p-2.5 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-900">
                      <strong className="flex items-center gap-1 text-amber-800 mb-0.5">
                        <FaShieldAlt /> Caution:
                      </strong>
                      <p className="line-clamp-2">{m.precautions}</p>
                    </div>
                  )}

                  {/* Side Effects */}
                  {m.side_effects && (
                    <div className="mt-2 text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">Possible side effects:</span> {m.side_effects}
                    </div>
                  )}
                </div>

                {/* Footer Link to Pharmacies */}
                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2">
                  <Link
                    to={`/pharmacies?medicine=${encodeURIComponent(m.name)}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <FaStore className="text-emerald-600" />
                    Find in Pharmacies
                  </Link>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('pharmacy medical store near me')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                    title="Open nearby medical stores on Google Maps"
                  >
                    <FaMapMarkerAlt /> Nearby
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineSearch;
