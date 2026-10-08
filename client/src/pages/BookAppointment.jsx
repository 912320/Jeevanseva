import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserMd, FaCalendarAlt, FaClock, FaNotesMedical, FaCheckCircle, FaHospital, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  // Generate next 7 dates
  const availableDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const displayStr = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    availableDates.push({ dateStr, displayStr, isToday: i === 0 });
  }

  const timeSlots = [
    '09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM',
    '02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM',
    '05:00 PM', '06:00 PM', '07:00 PM'
  ];

  useEffect(() => {
    if (availableDates.length > 0) {
      setSelectedDate(availableDates[0].dateStr);
    }
  }, []);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`/api/doctors/${doctorId}`);
        setDoctor(res.data.data);
      } catch (err) {
        toast.error('Doctor details not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to book an appointment.');
      navigate('/login');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Please select an appointment date and time slot.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post('/api/appointments', {
        doctor_id: doctor.id,
        hospital_id: doctor.Hospitals?.[0]?.id || null,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        reason: reason || 'Routine Health Consultation',
        notes: notes || null
      });

      setBookingConfirmed(res.data.data);
      toast.success('Appointment booked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment. Slot might be full.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800">Doctor Not Found</h2>
        <Link to="/doctors" className="mt-4 text-primary-600 font-medium hover:underline flex items-center gap-2">
          <FaArrowLeft /> Back to Doctors List
        </Link>
      </div>
    );
  }

  const docUser = doctor.User || {};
  const specName = doctor.DoctorSpecializations?.[0]?.specialization || 'General Specialist';
  const hospitalAffil = doctor.Hospitals?.[0];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Back Link */}
        <Link to="/doctors" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-600 mb-6">
          <FaArrowLeft /> Back to Doctors
        </Link>

        {bookingConfirmed ? (
          /* Confirmation Success Card */
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              <FaCheckCircle />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Appointment Confirmed!</h2>
            <p className="text-gray-600 mt-2">
              Your consultation with <span className="font-bold text-gray-800">{docUser.name}</span> has been confirmed.
            </p>

            <div className="my-6 p-4 bg-gray-50 rounded-xl border border-gray-200 inline-block text-left max-w-md w-full">
              <div className="flex justify-between py-1 border-b border-gray-200 text-sm">
                <span className="text-gray-500">Date:</span>
                <span className="font-bold text-gray-800">{bookingConfirmed.appointment_date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200 text-sm">
                <span className="text-gray-500">Time:</span>
                <span className="font-bold text-gray-800">{bookingConfirmed.appointment_time}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200 text-sm">
                <span className="text-gray-500">Doctor:</span>
                <span className="font-bold text-gray-800">{docUser.name} ({specName})</span>
              </div>
              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-500">Consultation Fee:</span>
                <span className="font-bold text-emerald-600">₹{bookingConfirmed.fee} (Pay at clinic)</span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Link
                to="/dashboard"
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Go to My Dashboard
              </Link>
              <Link
                to="/doctors"
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-colors"
              >
                Find More Doctors
              </Link>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Doctor Info Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white text-emerald-700 flex items-center justify-center font-bold text-2xl flex-shrink-0">
                {docUser.name?.charAt(0) || 'D'}
              </div>
              <div>
                <h1 className="text-xl font-bold">{docUser.name}</h1>
                <p className="text-emerald-100 text-sm font-medium">{specName} • {doctor.qualification}</p>
                {hospitalAffil && (
                  <p className="text-emerald-200 text-xs mt-1 flex items-center gap-1">
                    <FaHospital /> {hospitalAffil.name}, {hospitalAffil.city}
                  </p>
                )}
              </div>
              <div className="ml-auto text-right">
                <span className="text-xs text-emerald-100 block">Fee</span>
                <span className="text-2xl font-extrabold text-white">₹{doctor.consultation_fee || 300}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Step 1: Select Date */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-primary-600" />
                  Select Appointment Date
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {availableDates.map((item) => (
                    <button
                      key={item.dateStr}
                      type="button"
                      onClick={() => setSelectedDate(item.dateStr)}
                      className={`p-2.5 rounded-xl border text-center transition-colors ${
                        selectedDate === item.dateStr
                          ? 'border-primary-600 bg-primary-50 text-primary-800 font-bold'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="block text-xs uppercase text-gray-500">{item.displayStr.split(' ')[0]}</span>
                      <span className="block text-sm font-semibold mt-0.5">{item.displayStr.split(' ').slice(1).join(' ')}</span>
                      {item.isToday && <span className="text-[10px] text-emerald-600 font-bold block">Today</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Time Slot */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <FaClock className="text-primary-600" />
                  Select Available Time Slot
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-colors ${
                        selectedTime === slot
                          ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Reason & Health Details */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <FaNotesMedical className="text-primary-600" />
                  Reason for Consultation / Health Problem
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., High fever since 2 days, chest congestion, diabetes follow-up..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any prior medical condition, allergies, or medicines currently taking..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 block">Total Payable at Clinic:</span>
                  <span className="text-lg font-bold text-emerald-700">₹{doctor.consultation_fee || 300}</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm disabled:opacity-60"
                >
                  {submitting ? 'Confirming...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
