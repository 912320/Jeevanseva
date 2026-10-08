const { Appointment, Doctor, User, Hospital, Patient, DoctorSpecialization } = require('../models');
const apiResponse = require('../utils/apiResponse');

exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctor_id, hospital_id, appointment_date, appointment_time, reason, notes } = req.body;

    // Find or create patient record for this user
    let patient = await Patient.findOne({ where: { user_id: req.user.id } });
    if (!patient) {
      patient = await Patient.create({ user_id: req.user.id });
    }

    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Check for double booking
    const existing = await Appointment.findOne({
      where: {
        doctor_id,
        appointment_date,
        appointment_time,
        status: ['pending', 'confirmed']
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked. Please choose another time.'
      });
    }

    const appointment = await Appointment.create({
      patient_id: patient.id,
      doctor_id,
      hospital_id: hospital_id || null,
      appointment_date,
      appointment_time,
      reason: reason || 'General Consultation',
      notes: notes || null,
      fee: doctor.consultation_fee || 0,
      status: 'confirmed',
      payment_status: 'pending'
    });

    apiResponse.success(res, appointment, 'Appointment booked successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.getUserAppointments = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ where: { user_id: req.user.id } });
    if (!patient) {
      return apiResponse.success(res, [], 'No appointments found');
    }

    const appointments = await Appointment.findAll({
      where: { patient_id: patient.id },
      include: [
        {
          model: Doctor,
          include: [
            { model: User, attributes: ['name', 'phone', 'avatar'] },
            { model: DoctorSpecialization }
          ]
        },
        {
          model: Hospital,
          required: false,
          attributes: ['name', 'address', 'city', 'phone']
        }
      ],
      order: [['appointment_date', 'DESC'], ['appointment_time', 'DESC']]
    });

    apiResponse.success(res, appointments, 'Appointments fetched');
  } catch (error) {
    next(error);
  }
};

exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    await appointment.update({ status: 'cancelled' });
    apiResponse.success(res, appointment, 'Appointment cancelled');
  } catch (error) {
    next(error);
  }
};
