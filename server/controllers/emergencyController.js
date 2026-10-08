const { EmergencyService, Hospital } = require('../models');
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

exports.getEmergencyInfo = async (req, res, next) => {
  try {
    const { lat, lng, radius } = req.query;

    const services = await EmergencyService.findAll({
      where: { is_active: true }
    });

    const emergencyHospitals = await Hospital.findAll({
      where: { has_emergency: true },
      order: [['rating', 'DESC']]
    });

    let formattedHospitals = emergencyHospitals.map(h => {
      const data = h.toJSON();
      if (lat && lng && data.latitude && data.longitude) {
        data.distance = getDistance(parseFloat(lat), parseFloat(lng), data.latitude, data.longitude);
      } else {
        data.distance = null;
      }
      return data;
    });

    if (lat && lng) {
      formattedHospitals.sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });

      if (radius) {
        const rad = parseFloat(radius);
        const withinRadius = formattedHospitals.filter(h => h.distance !== null && h.distance <= rad);
        if (withinRadius.length > 0) {
          formattedHospitals = withinRadius;
        }
      }
    }

    // Limit to top 12 emergency hospitals
    formattedHospitals = formattedHospitals.slice(0, 12);

    const nationalHelplines = [
      { name: 'National Emergency Number', phone: '112', description: 'Single emergency helpline for all services across India' },
      { name: 'Ambulance Helpline', phone: '108', description: 'Emergency medical and ambulance transport services' },
      { name: 'National Health Helpline', phone: '1075', description: 'Ministry of Health & Family Welfare helpline' },
      { name: 'Mother & Child Helpline', phone: '102', description: 'Free pregnancy and neonatal emergency transport' },
      { name: 'Disaster Helpline', phone: '1078', description: 'National Disaster Management Authority helpline' },
      { name: 'Women Helpline', phone: '1091', description: 'Emergency distress response for women' }
    ];

    apiResponse.success(res, {
      nationalHelplines,
      services,
      emergencyHospitals: formattedHospitals
    }, 'Emergency info fetched');
  } catch (error) {
    next(error);
  }
};
