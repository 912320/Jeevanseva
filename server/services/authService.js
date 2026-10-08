const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/config');
const { User, Patient, Doctor, Hospital, DoctorSpecialization } = require('../models');

exports.registerUser = async (userData) => {
  const {
    name, email, password_hash, role, phone,
    // Patient fields
    dob, date_of_birth, gender, bloodGroup, blood_group, medical_history, emergency_contact,
    // Doctor fields
    registrationNumber, registration_number, qualification, experienceYears, experience_years,
    bio, consultationFee, consultation_fee, languages_spoken, specialization,
    // Hospital fields
    type, description, address, city, state, pincode, hasEmergency, has_emergency, emergencyContact
  } = userData;

  const user = await User.create({
    name,
    email,
    password_hash,
    role: role || 'patient',
    phone: phone && phone.trim() ? phone.trim() : null
  });

  if (user.role === 'patient') {
    await Patient.create({
      user_id: user.id,
      date_of_birth: date_of_birth || dob || null,
      gender: gender || null,
      blood_group: blood_group || bloodGroup || null,
      medical_history: medical_history || null,
      emergency_contact: emergency_contact || null
    });
  } else if (user.role === 'doctor') {
    const doc = await Doctor.create({
      user_id: user.id,
      registration_number: registration_number || registrationNumber || `DOC-${Date.now()}`,
      qualification: qualification || 'MBBS',
      experience_years: experience_years || experienceYears || 0,
      bio: bio || null,
      consultation_fee: consultation_fee || consultationFee || 0,
      languages_spoken: languages_spoken || 'English, Hindi',
      is_available: true,
      is_verified: false
    });
    if (specialization) {
      await DoctorSpecialization.create({
        doctor_id: doc.id,
        specialization: specialization,
        is_primary: true
      });
    }
  } else if (user.role === 'hospital') {
    await Hospital.create({
      user_id: user.id,
      name: name,
      registration_number: registration_number || `HOSP-${Date.now()}`,
      type: type || 'private',
      description: description || null,
      address: address || null,
      city: city || null,
      state: state || null,
      pincode: pincode || null,
      phone: phone && phone.trim() ? phone.trim() : null,
      has_emergency: has_emergency !== undefined ? has_emergency : !!hasEmergency,
      emergency_contact: emergencyContact || null,
      is_verified: false
    });
  }

  return user;
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) return null;
  user.last_login = new Date();
  await user.save();
  return user;
};

exports.generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name, email: user.email },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expire || '7d' }
  );
};