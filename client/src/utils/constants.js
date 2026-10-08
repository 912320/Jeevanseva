export const API_BASE_URL = '/api';

export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  HOSPITAL: 'hospital',
  ADMIN: 'admin',
};

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const SEARCH_RADIUS_OPTIONS = [1, 5, 10, 25, 50];

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
];

export const SPECIALIZATIONS = [
  'General Medicine', 'Cardiology', 'Pediatrics', 'Dermatology', 
  'Orthopedics', 'Gynecology', 'Dentistry', 'ENT', 
  'Ophthalmology', 'Psychiatry', 'Neurology', 'Gastroenterology', 
  'Pulmonology', 'Urology', 'Oncology'
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const HOSPITAL_TYPES = ['Govt', 'Private', 'Clinic', 'PHC', 'CHC'];
