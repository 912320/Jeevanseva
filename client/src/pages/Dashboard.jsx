import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaCalendarCheck, FaHospital, FaUserMd, FaPills, FaPhoneAlt, FaTimesCircle, FaCheckCircle, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/appointments');
      setAppointments(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await axios.put(`/api/appointments/${id}/cancel`);
      toast.success('Appointment cancelled successfully.');
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to cancel appointment.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-primary-700 flex items-center justify-center font-bold text-3xl border-4 border-emerald-50">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {user?.role}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
              {user?.phone && <p className="text-sm text-gray-500">{user?.phone}</p>}
              {user?.city && <p className="text-xs text-gray-400 mt-1">📍 {user?.city}, {user?.state}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/profile"
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Quick Healthcare Shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/hospitals"
            className="bg-white p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-sm transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
              <FaHospital />
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Find</span>
              <strong className="text-sm text-gray-800 font-bold">Hospitals</strong>
            </div>
          </Link>

          <Link
            to="/doctors"
            className="bg-white p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-sm transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
              <FaUserMd />
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Consult</span>
              <strong className="text-sm text-gray-800 font-bold">Doctors</strong>
            </div>
          </Link>

          <Link
            to="/medicines"
            className="bg-white p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-sm transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
              <FaPills />
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Check</span>
              <strong className="text-sm text-gray-800 font-bold">Medicines</strong>
            </div>
          </Link>

          <Link
            to="/emergency"
            className="bg-white p-4 rounded-xl border border-red-200 hover:border-red-500 hover:shadow-sm transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-lg">
              <FaPhoneAlt />
            </div>
            <div>
              <span className="text-xs text-red-500 block">Quick</span>
              <strong className="text-sm text-red-700 font-bold">Emergency</strong>
            </div>
          </Link>
        </div>

        {/* My Appointments List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaCalendarCheck className="text-primary-600" />
                My Doctor Appointments
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage your upcoming and past doctor visits</p>
            </div>

            <Link
              to="/doctors"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              + Book New Appointment
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
              <FaCalendarCheck className="mx-auto text-4xl text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-700">No Appointments Booked Yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Search our directory of verified doctors across specialties and schedule your consultation in seconds.
              </p>
              <Link
                to="/doctors"
                className="mt-4 inline-block px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Find Doctors Now
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {appointments.map((apt) => {
                const doc = apt.Doctor || {};
                const docUser = doc.User || {};
                const spec = doc.DoctorSpecializations?.[0]?.specialization || 'General Physician';
                const hospital = apt.Hospital || {};

                return (
                  <div key={apt.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {docUser.name?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-base">{docUser.name || 'Doctor'}</h4>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                            {spec}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-600">
                          <span className="flex items-center gap-1 font-semibold text-gray-900">
                            <FaClock className="text-primary-600" />
                            {apt.appointment_date} at {apt.appointment_time}
                          </span>

                          {hospital.name && (
                            <span className="flex items-center gap-1 text-gray-500">
                              <FaHospital />
                              {hospital.name}, {hospital.city}
                            </span>
                          )}

                          <span className="text-gray-500">
                            Fee: <strong className="text-gray-800">₹{apt.fee}</strong>
                          </span>
                        </div>

                        {apt.reason && (
                          <p className="text-xs text-gray-500 mt-1 italic">
                            Reason: {apt.reason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        apt.status === 'cancelled' ? 'bg-gray-100 text-gray-600' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {apt.status}
                      </span>

                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancel(apt.id)}
                          className="text-xs text-red-600 hover:text-red-800 font-medium hover:underline flex items-center gap-1"
                        >
                          <FaTimesCircle /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
