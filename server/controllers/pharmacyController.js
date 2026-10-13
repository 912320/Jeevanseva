const { Pharmacy, Medicine } = require('../models');
const { Op } = require('sequelize');
const apiResponse = require('../utils/apiResponse');

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

exports.getAllPharmacies = async (req, res, next) => {
  try {
    const { search, medicine, city, is_24_hours, home_delivery, lat, lng, radius } = req.query;
    const where = { is_active: true };
    let matchedMedicineName = medicine ? medicine.trim() : null;

    if (city) {
      where.city = { [Op.like]: `%${city}%` };
    }

    if (is_24_hours === 'true' || is_24_hours === true) {
      where.is_24_hours = true;
    }

    if (home_delivery === 'true' || home_delivery === true) {
      where.home_delivery = true;
    }

    // 1. If explicit medicine parameter is passed, we show pharmacies stocking it
    // 2. If search parameter is passed:
    if (search && search.trim()) {
      const q = search.trim();

      // First check if search matches store name, address, or city
      const storeWhere = {
        ...where,
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { address: { [Op.like]: `%${q}%` } },
          { city: { [Op.like]: `%${q}%` } }
        ]
      };

      const matchedStores = await Pharmacy.findAll({ where: storeWhere, order: [['name', 'ASC']] });

      if (matchedStores.length > 0) {
        // Matched by pharmacy name/location directly
        where[Op.or] = [
          { name: { [Op.like]: `%${q}%` } },
          { address: { [Op.like]: `%${q}%` } },
          { city: { [Op.like]: `%${q}%` } }
        ];
      } else {
        // Did not match store name/address/city -> check if search is actually a medicine name!
        const foundMed = await Medicine.findOne({
          where: {
            [Op.or]: [
              { name: { [Op.like]: `%${q}%` } },
              { generic_name: { [Op.like]: `%${q}%` } },
              { category: { [Op.like]: `%${q}%` } }
            ]
          }
        });

        if (foundMed) {
          matchedMedicineName = foundMed.name;
          // Do not filter out pharmacies by store name since it's a medicine query
        } else {
          // If not in Medicine table, still attempt partial search or show general pharmacies with search term
          matchedMedicineName = q;
        }
      }
    }

    const pharmacies = await Pharmacy.findAll({ where, order: [['name', 'ASC']] });

    let results = pharmacies.map(p => {
      const data = p.toJSON();
      if (lat && lng && data.latitude && data.longitude) {
        data.distance = getDistance(parseFloat(lat), parseFloat(lng), data.latitude, data.longitude);
      } else {
        data.distance = null;
      }
      if (matchedMedicineName) {
        data.stocks_medicine = true;
        data.requested_medicine = matchedMedicineName;
      }
      return data;
    });

    let isBeyondRadius = false;

    if (lat && lng) {
      results.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });

      if (radius && radius !== 'all' && radius !== '') {
        const rad = parseFloat(radius);
        const inRadius = results.filter(p => p.distance !== null && p.distance <= rad);
        if (inRadius.length > 0) {
          results = inRadius;
        } else {
          // If no pharmacy found within strict radius (e.g. user in area with >200km to nearest store),
          // fallback to nearest available pharmacies sorted by distance instead of showing empty page!
          isBeyondRadius = true;
          results = results.slice(0, 15).map(p => ({
            ...p,
            is_outside_radius: true,
            filter_radius: rad
          }));
        }
      }
    }

    return res.json({
      success: true,
      data: results,
      meta: {
        total: results.length,
        is_beyond_radius: isBeyondRadius,
        medicine_query: matchedMedicineName
      },
      message: 'Pharmacies fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getPharmacyById = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findByPk(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    }
    apiResponse.success(res, pharmacy, 'Pharmacy details fetched');
  } catch (error) {
    next(error);
  }
};
