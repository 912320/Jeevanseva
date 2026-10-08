const { Doctor, User, DoctorSpecialization, Hospital, DoctorAvailability } = require('../models');
const { Op } = require('sequelize');
const apiResponse = require('../utils/apiResponse');

// Calculate Haversine distance in KM
function getDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

exports.getAllDoctors = async (req, res, next) => {
  try {
    const { search, specialization, minExp, maxFee, verified, city, lat, lng, radius, hospitalId } = req.query;
    const userWhere = {};
    const doctorWhere = {};
    const specWhere = {};

    if (search) {
      userWhere[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } }
      ];
    }

    // Only filter strictly by city if user did not provide lat/lng
    if (city && !lat && !lng) {
      userWhere.city = { [Op.like]: `%${city}%` };
    }

    if (minExp) {
      doctorWhere.experience_years = { [Op.gte]: parseInt(minExp, 10) };
    }

    if (maxFee) {
      doctorWhere.consultation_fee = { [Op.lte]: parseFloat(maxFee) };
    }

    if (verified === 'true' || verified === true) {
      doctorWhere.is_verified = true;
    }

    if (specialization && specialization !== 'all') {
      specWhere.specialization = { [Op.like]: `%${specialization}%` };
    }

    // 1. If hospitalId is provided, first check if doctors are directly affiliated
    if (hospitalId) {
      const hospitalAffiliatedDoctors = await Doctor.findAll({
        where: doctorWhere,
        include: [
          {
            model: User,
            where: Object.keys(userWhere).length ? userWhere : undefined,
            attributes: ['id', 'name', 'email', 'phone', 'avatar', 'city', 'state', 'latitude', 'longitude']
          },
          {
            model: DoctorSpecialization,
            where: Object.keys(specWhere).length ? specWhere : undefined,
            required: !!specialization && specialization !== 'all'
          },
          {
            model: Hospital,
            where: { id: hospitalId },
            required: true,
            attributes: ['id', 'name', 'city', 'type', 'address', 'latitude', 'longitude']
          },
          {
            model: DoctorAvailability,
            required: false
          }
        ],
        order: [['rating', 'DESC'], ['experience_years', 'DESC']]
      });

      if (hospitalAffiliatedDoctors.length > 0) {
        const results = hospitalAffiliatedDoctors.map(d => {
          const data = d.toJSON();
          data.distance = 0; // Directly at this hospital
          data.affiliatedWithTargetHospital = true;
          return data;
        });
        return apiResponse.success(res, results, 'Doctors for hospital fetched successfully');
      }
      // If no directly affiliated doctors found, continue to query doctors nearby or in that city
    }

    const doctors = await Doctor.findAll({
      where: doctorWhere,
      include: [
        {
          model: User,
          where: Object.keys(userWhere).length ? userWhere : undefined,
          attributes: ['id', 'name', 'email', 'phone', 'avatar', 'city', 'state', 'latitude', 'longitude']
        },
        {
          model: DoctorSpecialization,
          where: Object.keys(specWhere).length ? specWhere : undefined,
          required: !!specialization && specialization !== 'all'
        },
        {
          model: Hospital,
          through: { attributes: [] },
          required: false,
          attributes: ['id', 'name', 'city', 'type', 'address', 'latitude', 'longitude']
        },
        {
          model: DoctorAvailability,
          required: false
        }
      ],
      order: [['rating', 'DESC'], ['experience_years', 'DESC']]
    });

    let results = doctors.map(d => {
      const data = d.toJSON();
      data.distance = null;

      if (lat && lng) {
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        const distances = [];

        // Check doctor's user clinic coordinates
        if (data.User?.latitude && data.User?.longitude) {
          const dist = getDistance(userLat, userLng, data.User.latitude, data.User.longitude);
          if (dist !== null) distances.push(dist);
        }

        // Check doctor's affiliated hospital coordinates
        if (Array.isArray(data.Hospitals)) {
          for (const h of data.Hospitals) {
            if (h.latitude && h.longitude) {
              const dist = getDistance(userLat, userLng, h.latitude, h.longitude);
              if (dist !== null) distances.push(dist);
            }
          }
        }

        if (distances.length > 0) {
          data.distance = Math.min(...distances);
        }
      }
      return data;
    });

    if (lat && lng) {
      results.sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });

      if (radius) {
        const rad = parseFloat(radius);
        const filtered = results.filter(d => d.distance !== null && d.distance <= rad);
        // If radius is too tight and no doctors found, we still return the closest ones or filtered
        if (filtered.length > 0) {
          results = filtered;
        }
      }
    }

    apiResponse.success(res, results, 'Doctors fetched successfully');
  } catch (error) {
    next(error);
  }
};

exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'phone', 'avatar', 'city', 'state']
        },
        {
          model: DoctorSpecialization
        },
        {
          model: Hospital,
          through: { attributes: [] }
        },
        {
          model: DoctorAvailability
        }
      ]
    });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    apiResponse.success(res, doctor, 'Doctor details fetched');
  } catch (error) {
    next(error);
  }
};
