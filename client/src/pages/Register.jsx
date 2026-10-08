import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaUserMd, FaHospital, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-hot-toast';
import { USER_ROLES, SPECIALIZATIONS, HOSPITAL_TYPES, BLOOD_GROUPS, LANGUAGES } from '../utils/constants';

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const password = watch('password');

  const handleNext = async () => {
    let isValid = false;
    if (step === 2) {
      isValid = await trigger(['name', 'email', 'phone', 'password', 'confirmPassword']);
    }
    if (isValid) setStep(3);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, role };
      delete payload.confirmPassword;
      await registerUser(payload);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">{t('auth.register')}</h2>
          <div className="mt-4 flex justify-center items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
          </div>
        </div>

        <div className="bg-white py-8 px-6 shadow sm:rounded-lg border border-gray-100">
          {/* Step 1: Select Role */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">{t('auth.role')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <button
                  type="button"
                  onClick={() => { setRole(USER_ROLES.PATIENT); setStep(2); }}
                  className="flex flex-col items-center justify-center p-6 border-2 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-colors focus:outline-none"
                >
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4">
                    <FaUser />
                  </div>
                  <span className="font-semibold text-gray-900">{t('auth.patient')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setRole(USER_ROLES.DOCTOR); setStep(2); }}
                  className="flex flex-col items-center justify-center p-6 border-2 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-colors focus:outline-none"
                >
                  <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-3xl mb-4">
                    <FaUserMd />
                  </div>
                  <span className="font-semibold text-gray-900">{t('auth.doctor')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setRole(USER_ROLES.HOSPITAL); setStep(2); }}
                  className="flex flex-col items-center justify-center p-6 border-2 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-colors focus:outline-none"
                >
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl mb-4">
                    <FaHospital />
                  </div>
                  <span className="font-semibold text-gray-900">{t('auth.hospital')}</span>
                </button>

              </div>
              <div className="mt-8 text-center text-sm text-gray-600">
                {t('auth.haveAccount')} <Link to="/login" className="text-primary-600 font-medium hover:underline">{t('nav.login')}</Link>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 2: Common Fields */}
            <div className={step === 2 ? 'block' : 'hidden'}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('auth.name')}</label>
                  <input {...register('name', { required: t('errors.required') })} type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('auth.email')}</label>
                  <input {...register('email', { required: t('errors.required'), pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('errors.invalidEmail') } })} type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('auth.phone')}</label>
                  <input {...register('phone', { required: t('errors.required'), pattern: { value: /^[6-9]\d{9}$/, message: t('errors.invalidPhone') } })} type="tel" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('auth.password')}</label>
                  <input {...register('password', { required: t('errors.required'), minLength: { value: 6, message: t('errors.passwordMin') } })} type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2" />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input {...register('confirmPassword', { validate: value => value === password || t('errors.passwordMatch') })} type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2" />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                  <FaArrowLeft /> {t('common.back')}
                </button>
                <button type="button" onClick={handleNext} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md">
                  {t('common.next')} <FaArrowRight />
                </button>
              </div>
            </div>

            {/* Step 3: Role Specific Fields */}
            {step === 3 && (
              <div>
                {role === USER_ROLES.PATIENT && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input {...register('dob')} type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <select {...register('gender')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2 bg-white">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                      <select {...register('bloodGroup')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2 bg-white">
                        <option value="">Select Blood Group</option>
                        {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {role === USER_ROLES.DOCTOR && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                      <input {...register('registrationNumber')} type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Specialization</label>
                      <select {...register('specialization')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2 bg-white">
                        <option value="">Select Specialization</option>
                        {SPECIALIZATIONS.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                      <input {...register('experienceYears')} type="number" min="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Consultation Fee (₹)</label>
                      <input {...register('consultationFee')} type="number" min="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2" />
                    </div>
                  </div>
                )}

                {role === USER_ROLES.HOSPITAL && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hospital Type</label>
                      <select {...register('type')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2 bg-white">
                        <option value="">Select Type</option>
                        {HOSPITAL_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <textarea {...register('address')} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input {...register('city')} type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <input {...register('state')} type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Emergency Services Available?</label>
                      <div className="mt-2 flex items-center">
                        <input {...register('hasEmergency')} type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                        <span className="ml-2 text-sm text-gray-700">Yes, we provide 24/7 emergency services</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                    <FaArrowLeft /> {t('common.back')}
                  </button>
                  <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-70">
                    {loading ? t('common.loading') : t('common.submit')}
                  </button>
                </div>
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
};

export default Register;
