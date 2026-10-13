const { Hospital, HospitalDepartment, Doctor, User, DoctorSpecialization } = require('../models');
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

function getAddressPart(addressComponents = [], type) {
  return addressComponents.find(component => component.types?.includes(type))?.longText || '';
}

function googlePlaceToHospital(place) {
  const components = place.addressComponents || [];
  const address = place.formattedAddress || '';
  const city = getAddressPart(components, 'locality') || getAddressPart(components, 'administrative_area_level_2');
  const state = getAddressPart(components, 'administrative_area_level_1');
  const pincode = getAddressPart(components, 'postal_code');

  return {
    google_place_id: place.id,
    registration_number: `google-${place.id}`,
    name: place.displayName?.text || 'Unnamed hospital',
    type: 'private',
    address,
    city,
    state,
    pincode,
    phone: place.nationalPhoneNumber || null,
    website: place.websiteUri || null,
    opening_hours: place.regularOpeningHours?.weekdayDescriptions?.join('; ') || null,
    latitude: place.location?.latitude || null,
    longitude: place.location?.longitude || null,
    rating: place.rating || 0,
    total_reviews: place.userRatingCount || 0,
    // A Google listing is not a JeevanSeva verification.
    is_verified: false,
    data_source: 'google_places',
    last_synced_at: new Date()
  };
}

exports.syncGoogleNearbyHospitals = async (req, res, next) => {
  try {
    const lat = Number(req.body.lat);
    const lng = Number(req.body.lng);
    const radius = Math.min(Math.max(Number(req.body.radius) || 5000, 100), 50000);

    if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lng) || lng < -180 || lng > 180) {
      return res.status(400).json({ success: false, message: 'A valid latitude and longitude are required.' });
    }
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'Google Places is not configured. Add GOOGLE_MAPS_API_KEY to the server .env file.'
      });
    }

    const googleResponse = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.addressComponents,places.location,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.regularOpeningHours'
      },
      body: JSON.stringify({
        includedTypes: ['hospital'],
        maxResultCount: 20,
        rankPreference: 'DISTANCE',
        locationRestriction: { circle: { center: { latitude: lat, longitude: lng }, radius } }
      })
    });

    if (!googleResponse.ok) {
      console.error('Google Places request failed:', googleResponse.status, await googleResponse.text());
      return res.status(502).json({ success: false, message: 'Google Places could not return hospitals right now.' });
    }

    const { places = [] } = await googleResponse.json();
    await Promise.all(places.map(async place => {
      if (!place.id || !place.displayName?.text) return;
      const values = googlePlaceToHospital(place);
      const existing = await Hospital.findOne({ where: { google_place_id: place.id } });
      if (existing) await existing.update(values);
      else await Hospital.create(values);
    }));

    apiResponse.success(res, { imported: places.length }, 'Nearby Google hospitals were saved and refreshed.');
  } catch (error) {
    next(error);
  }
};

// RapidAPI provider response: { ok, data: { results: [...] } }.
// The API key never reaches the browser; it is read only from the server .env.
exports.syncRapidApiNearbyHospitals = async (req, res, next) => {
  try {
    const lat = Number(req.body.lat);
    const lng = Number(req.body.lng);
    const radiusKm = Math.min(Math.max(Number(req.body.radius_km) || 5, 1), 50);

    if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lng) || lng < -180 || lng > 180) {
      return res.status(400).json({ success: false, message: 'A valid latitude and longitude are required.' });
    }
    if (!process.env.RAPIDAPI_KEY || !process.env.RAPIDAPI_HOST || !process.env.RAPIDAPI_NEARBY_URL) {
      return res.status(503).json({
        success: false,
        message: 'RapidAPI is not configured. Add RAPIDAPI_KEY, RAPIDAPI_HOST, and RAPIDAPI_NEARBY_URL to .env.'
      });
    }

    const rapidResponse = await fetch(process.env.RAPIDAPI_NEARBY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
      },
      body: JSON.stringify({ lat, lng, query: 'hospital', radius_km: radiusKm })
    });

    if (!rapidResponse.ok) {
      console.error('RapidAPI nearby request failed:', rapidResponse.status, await rapidResponse.text());
      const messages = {
        401: 'RapidAPI rejected the API key. Replace RAPIDAPI_KEY with an active key and restart the backend.',
        403: 'RapidAPI access is denied. Confirm that you subscribed to this exact API and that the key belongs to the same RapidAPI account.',
        429: 'RapidAPI request limit has been reached. Check your RapidAPI plan and quota.'
      };
      return res.status(502).json({
        success: false,
        message: messages[rapidResponse.status] || `The nearby-places provider failed with HTTP ${rapidResponse.status}. Try the endpoint in RapidAPI Playground first.`
      });
    }

    const payload = await rapidResponse.json();
    const places = Array.isArray(payload?.data?.results) ? payload.data.results : [];
    if (!payload?.ok || !Array.isArray(places)) {
      return res.status(502).json({ success: false, message: 'The nearby-places provider returned an unexpected response.' });
    }

    let imported = 0;
    await Promise.all(places.map(async place => {
      const placeId = place.place_id || place.id || place.fid;
      const name = place.name || place.title;
      if (!placeId || !name) return;

      const values = {
        google_place_id: placeId,
        registration_number: `rapidapi-${placeId}`,
        name,
        type: 'private',
        address: place.address || place.addr || place.formatted_address || '',
        city: place.city || '',
        state: place.state || '',
        pincode: place.pincode || place.postal_code || '',
        phone: place.phone || place.phone_number || place.international_phone_number || null,
        website: place.website || place.website_uri || null,
        opening_hours: place.opening_hours?.weekday_text?.join('; ') || place.opening_hours || null,
        latitude: Number(place.latitude ?? place.lat) || null,
        longitude: Number(place.longitude ?? place.lng) || null,
        rating: Number(place.rating) || 0,
        total_reviews: Number(place.user_ratings_total ?? place.review_count) || 0,
        is_verified: false,
        data_source: 'rapidapi_places',
        last_synced_at: new Date()
      };
      const existing = await Hospital.findOne({ where: { google_place_id: placeId } });
      if (existing) await existing.update(values);
      else await Hospital.create(values);
      imported += 1;
    }));

    apiResponse.success(res, { imported }, 'Nearby hospitals were saved and refreshed from RapidAPI.');
  } catch (error) {
    next(error);
  }
};

exports.getAllHospitals = async (req, res, next) => {
  try {
    const { search, type, emergency, city, lat, lng, radius } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } }
      ];
    }

    if (type && type !== 'all') {
      where.type = type;
    }

    if (emergency === 'true' || emergency === true) {
      where.has_emergency = true;
    }

    if (city) {
      where.city = { [Op.like]: `%${city}%` };
    }

    const hospitals = await Hospital.findAll({
      where,
      include: [
        { model: HospitalDepartment, required: false },
        {
          model: Doctor,
          required: false,
          include: [{ model: User, attributes: ['name', 'avatar'] }, { model: DoctorSpecialization }]
        }
      ],
      order: [['rating', 'DESC'], ['name', 'ASC']]
    });

    let results = hospitals.map(h => {
      const data = h.toJSON();
      if (lat && lng && data.latitude && data.longitude) {
        data.distance = getDistance(parseFloat(lat), parseFloat(lng), data.latitude, data.longitude);
      } else {
        data.distance = null;
      }
      return data;
    });

    const searchLower = (search || '').trim().toLowerCase();

    results.sort((a, b) => {
      // Priority 1: Exact or name match with search term (e.g. AIIMS) ALWAYS first!
      if (searchLower) {
        const aMatch = (a.name && a.name.toLowerCase().includes(searchLower));
        const bMatch = (b.name && b.name.toLowerCase().includes(searchLower));
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
      }

      // Priority 2: Distance if coordinates available
      if (lat && lng) {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      }

      // Priority 3: Rating and Name
      return (b.rating || 0) - (a.rating || 0);
    });

    if (lat && lng && radius) {
      const rad = parseFloat(radius);
      const filtered = results.filter(h => h.distance !== null && h.distance <= rad);
      if (filtered.length > 0) {
        results = filtered;
      }
    }

    apiResponse.success(res, results, 'Hospitals fetched successfully');
  } catch (error) {
    next(error);
  }
};

exports.getHospitalById = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByPk(req.params.id, {
      include: [
        { model: HospitalDepartment },
        {
          model: Doctor,
          include: [
            { model: User, attributes: ['name', 'avatar', 'phone', 'email'] },
            { model: DoctorSpecialization }
          ]
        }
      ]
    });

    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    apiResponse.success(res, hospital, 'Hospital details fetched');
  } catch (error) {
    next(error);
  }
};
