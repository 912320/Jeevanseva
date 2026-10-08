const { Pharmacy } = require('../models');
const { Op } = require('sequelize');
const apiResponse = require('../utils/apiResponse');

function getDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

exports.getAllPharmacies = async (req, res, next) => {
  try {
    const { search, city, is_24_hours, home_delivery, lat, lng, radius } = req.query;
    const where = { is_active: true };

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } }
      ];
    }

    if (city) {
      where.city = { [Op.like]: `%${city}%` };
    }

    if (is_24_hours === 'true') {
      where.is_24_hours = true;
    }

    if (home_delivery === 'true') {
      where.home_delivery = true;
    }

    const pharmacies = await Pharmacy.findAll({ where, order: [['name', 'ASC']] });

    let results = pharmacies.map(p => {
      const data = p.toJSON();
      if (lat && lng && data.latitude && data.longitude) {
        data.distance = getDistance(parseFloat(lat), parseFloat(lng), data.latitude, data.longitude);
      } else {
        data.distance = null;
      }
      return data;
    });

    if (lat && lng) {
      results.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });

      if (radius) {
        const rad = parseFloat(radius);
        results = results.filter(p => p.distance !== null && p.distance <= rad);
      }
    }

    apiResponse.success(res, results, 'Pharmacies fetched successfully');
  } catch (error) {
    next(error);
  }
};
