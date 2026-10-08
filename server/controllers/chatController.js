require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  Hospital,
  Doctor,
  Medicine,
  Pharmacy,
  EmergencyService,
  User,
  DoctorSpecialization,
  HospitalDepartment,
  Disease,
  Symptom
} = require('../models');
const { Op } = require('sequelize');

// Supported modern Gemini models in order of priority (flash-lite prioritized for fast response)
const GEMINI_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash'
];

// ── Haversine helper ────────────────────────────────────────────────────────
function getDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

// ── Emergency keyword detection ──────────────────────────────────────────────
const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'stroke', 'unconscious', 'not breathing',
  'severe bleeding', 'heavy bleeding', 'seizure', 'convulsion', 'poisoning',
  'overdose', 'suicide', "can't breathe", 'cannot breathe', 'difficulty breathing',
  'choking', 'severe pain', 'paralysis', 'fainted', 'collapsed', 'accident',
  'drowning', 'burn', 'fracture with bleeding', 'anaphylaxis', 'allergic reaction severe',
  'emergency', 'ambulance', 'dying', 'help me'
];

function detectEmergency(text) {
  const lower = (text || '').toLowerCase();
  return EMERGENCY_KEYWORDS.some(kw => lower.includes(kw));
}

// ── Intent detection ─────────────────────────────────────────────────────────
function detectIntent(message) {
  const lower = (message || '').toLowerCase();

  if (detectEmergency(lower)) return 'emergency';

  if (/doctor|physician|specialist|surgeon|cardiologist|neurologist|dermatologist|pediatrician|orthopedic|gynecologist|psychiatrist|oncologist|diabetologist|gastroenterologist|pulmonologist|nephrologist|urologist|endocrinologist|rheumatologist|ophthalmologist|ent|dentist|obstetrician/.test(lower)) {
    return 'doctor';
  }

  if (/hospital|clinic|nursing home|medical center|icu|nicu|admit|bed|beds/.test(lower)) {
    return 'hospital';
  }

  if (/medicine|tablet|capsule|syrup|drug|paracetamol|ibuprofen|amoxicillin|metformin|atorvastatin|omeprazole|azithromycin|ciprofloxacin|medication|pill|dosage|side effect|uses of|composition|generic/.test(lower)) {
    return 'medicine';
  }

  if (/pharmacy|chemist|medical store|drug store|dispensary/.test(lower)) {
    return 'pharmacy';
  }

  if (/ambulance|108|112|emergency service/.test(lower)) {
    return 'emergency';
  }

  if (/symptom|pain|fever|cough|cold|headache|vomiting|nausea|diarrhea|loose motion|diabetes|sugar|blood pressure|hypertension|asthma|allergy|rash|fatigue|tired|dizzy|breathless|swelling|itching|infection|ache|throat/.test(lower)) {
    return 'symptom';
  }

  if (/what is|what are|how to|explain|define|tell me about|information about|treatment|cause|prevent|vaccine|vaccination|test|mri|ct scan|x-ray|blood test|ecg|ultrasound/.test(lower)) {
    return 'medical_info';
  }

  return 'general';
}

// ── Extract location hint from message ───────────────────────────────────────
function extractLocation(message) {
  const knownCities = [
    'bhopal', 'indore', 'jamshedpur', 'delhi', 'mumbai', 'bangalore', 'bengaluru',
    'hyderabad', 'chennai', 'kolkata', 'pune', 'ahmedabad', 'jaipur', 'lucknow',
    'kanpur', 'nagpur', 'sehore', 'raisen', 'vidisha', 'ujjain', 'dewas', 'itarsi',
    'narmadapuram', 'gwalior', 'jabalpur', 'ranchi', 'patna'
  ];
  const lower = (message || '').toLowerCase();
  for (const city of knownCities) {
    if (new RegExp('\\b' + city + '\\b', 'i').test(lower)) {
      return city.charAt(0).toUpperCase() + city.slice(1);
    }
  }

  const cityPattern = /\b(?:in|near|at|around|from)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)\b/i;
  const match = message.match(cityPattern);
  if (match && match[1]) {
    const candidate = match[1].trim();
    const blacklist = [
      'me', 'here', 'my', 'hospital', 'hospitals', 'doctor', 'doctors', 'today',
      'emergency', 'pain', 'trouble', 'chest', 'breathing', 'fever', 'cough',
      'severe', 'headache', 'stomach', 'medicine', 'medicines', 'pharmacy',
      'clinic', 'the', 'a', 'an', 'this', 'that', 'condition'
    ];
    if (!blacklist.includes(candidate.toLowerCase()) && candidate.length > 2) {
      return candidate;
    }
  }
  return null;
}

// ── Database query helpers ───────────────────────────────────────────────────
async function searchDoctors({ query, specialization, lat, lng, radius = 200, city, limit = 5 }) {
  const userWhere = {};
  const specWhere = {};

  if (query) {
    userWhere[Op.or] = [
      { name: { [Op.like]: `%${query}%` } },
      { city: { [Op.like]: `%${query}%` } }
    ];
  }
  if (city && !lat) {
    userWhere.city = { [Op.like]: `%${city}%` };
  }
  if (specialization) {
    specWhere.specialization = { [Op.like]: `%${specialization}%` };
  }

  const doctors = await Doctor.findAll({
    include: [
      {
        model: User,
        where: Object.keys(userWhere).length ? userWhere : undefined,
        attributes: ['id', 'name', 'email', 'phone', 'avatar', 'city', 'state', 'latitude', 'longitude']
      },
      {
        model: DoctorSpecialization,
        where: Object.keys(specWhere).length ? specWhere : undefined,
        required: !!specialization
      },
      {
        model: Hospital,
        through: { attributes: [] },
        required: false,
        attributes: ['id', 'name', 'city', 'address', 'latitude', 'longitude']
      }
    ],
    order: [['rating', 'DESC'], ['experience_years', 'DESC']],
    limit: limit * 4
  });

  let results = doctors.map(d => {
    const data = d.toJSON();
    if (lat && lng) {
      const dists = [];
      if (data.User?.latitude && data.User?.longitude) {
        dists.push(getDistance(lat, lng, data.User.latitude, data.User.longitude));
      }
      (data.Hospitals || []).forEach(h => {
        if (h.latitude && h.longitude) {
          dists.push(getDistance(lat, lng, h.latitude, h.longitude));
        }
      });
      data.distance = dists.length ? Math.min(...dists.filter(Boolean)) : null;
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
      const filtered = results.filter(d => d.distance !== null && d.distance <= radius);
      if (filtered.length > 0) results = filtered;
    }
  }

  return results.slice(0, limit);
}

async function searchHospitals({ query, emergency, lat, lng, radius = 200, city, limit = 5 }) {
  const where = {};
  if (query) {
    where[Op.or] = [
      { name: { [Op.like]: `%${query}%` } },
      { city: { [Op.like]: `%${query}%` } },
      { address: { [Op.like]: `%${query}%` } },
      { description: { [Op.like]: `%${query}%` } }
    ];
  }
  if (emergency) where.has_emergency = true;
  if (city && !lat) where.city = { [Op.like]: `%${city}%` };

  const hospitals = await Hospital.findAll({
    where,
    include: [{ model: HospitalDepartment, required: false }],
    order: [['rating', 'DESC']],
    limit: limit * 4
  });

  let results = hospitals.map(h => {
    const data = h.toJSON();
    if (lat && lng && data.latitude && data.longitude) {
      data.distance = getDistance(lat, lng, data.latitude, data.longitude);
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
      const filtered = results.filter(h => h.distance !== null && h.distance <= radius);
      if (filtered.length > 0) results = filtered;
    }
  }

  return results.slice(0, limit);
}

async function searchMedicines({ query, limit = 5 }) {
  if (!query) {
    return Medicine.findAll({ limit });
  }

  // Remove generic query words
  const cleanQuery = query.replace(/(?:what is|what are|uses of|tell me about|medicine|tablet|syrup|capsule|pill|please|about|can you)/gi, '').trim();
  const searchTerms = cleanQuery.split(/\s+/).filter(w => w.length > 2);

  const orConditions = [
    { name: { [Op.like]: `%${cleanQuery}%` } },
    { generic_name: { [Op.like]: `%${cleanQuery}%` } },
    { uses: { [Op.like]: `%${cleanQuery}%` } },
    { category: { [Op.like]: `%${cleanQuery}%` } }
  ];

  searchTerms.forEach(term => {
    orConditions.push(
      { name: { [Op.like]: `%${term}%` } },
      { generic_name: { [Op.like]: `%${term}%` } },
      { uses: { [Op.like]: `%${term}%` } }
    );
  });

  return Medicine.findAll({
    where: { [Op.or]: orConditions },
    limit
  });
}

async function searchPharmacies({ lat, lng, city, radius = 200, limit = 5 }) {
  const where = {};
  if (city && !lat) where.city = { [Op.like]: `%${city}%` };

  const pharmacies = await Pharmacy.findAll({ where, limit: limit * 4 });
  let results = pharmacies.map(p => {
    const data = p.toJSON();
    if (lat && lng && data.latitude && data.longitude) {
      data.distance = getDistance(lat, lng, data.latitude, data.longitude);
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
      const filtered = results.filter(p => p.distance !== null && p.distance <= radius);
      if (filtered.length > 0) results = filtered;
    }
  }
  return results.slice(0, limit);
}

async function searchHealthConditions(query) {
  if (!query) return { diseases: [], symptoms: [] };
  const clean = query.replace(/(?:i have|suffering from|what is|tell me|doctor for|treatment for)/gi, '').trim();
  const [diseases, symptoms] = await Promise.all([
    Disease.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${clean}%` } },
          { description: { [Op.like]: `%${clean}%` } },
          { specialty: { [Op.like]: `%${clean}%` } }
        ]
      },
      limit: 3
    }),
    Symptom.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${clean}%` } },
          { description: { [Op.like]: `%${clean}%` } },
          { body_part: { [Op.like]: `%${clean}%` } }
        ]
      },
      limit: 3
    })
  ]);
  return { diseases, symptoms };
}

// ── Format DB results for AI prompt ──────────────────────────────────────────
function formatDoctorsForAI(doctors) {
  if (!doctors || !doctors.length) return 'No doctors found matching this exact query in database.';
  return doctors.map((d, i) => {
    const spec = d.DoctorSpecializations?.map(s => s.specialization).join(', ') || 'General Physician';
    const hosp = d.Hospitals?.[0]?.name || 'Private Clinic';
    const city = d.User?.city || 'India';
    const dist = d.distance != null ? ` (${d.distance} km away)` : '';
    return `${i + 1}. Dr. ${d.User?.name || 'Verified Doctor'} | ${spec} | ${d.experience_years || 5}+ yrs exp | ${hosp}, ${city}${dist} | Fee: ₹${d.consultation_fee || 500} | ID: ${d.id}`;
  }).join('\n');
}

function formatHospitalsForAI(hospitals) {
  if (!hospitals || !hospitals.length) return 'No hospitals found matching this query in database.';
  return hospitals.map((h, i) => {
    const dist = h.distance != null ? ` (${h.distance} km away)` : '';
    const emergency = h.has_emergency ? '🚨 24/7 Emergency Available' : '';
    return `${i + 1}. ${h.name} | ${h.type || 'Hospital'} | ${h.city || 'India'}${dist} | ${emergency} | Phone: ${h.phone || 'Available'} | Rating: ${h.rating || 4.2}★ | ID: ${h.id}`;
  }).join('\n');
}

function formatMedicinesForAI(medicines) {
  if (!medicines || !medicines.length) return 'No medicines found matching this query in database.';
  return medicines.map((m, i) =>
    `${i + 1}. ${m.name} | Generic: ${m.generic_name || 'N/A'} | Category: ${m.category || 'Therapeutic'} | Uses: ${m.uses || 'N/A'} | Prescription: ${m.prescription_required ? 'Required (Rx)' : 'Over the counter (OTC)'} | Side Effects: ${m.side_effects || 'Consult doctor'} | ID: ${m.id}`
  ).join('\n');
}

function formatPharmaciesForAI(pharmacies) {
  if (!pharmacies || !pharmacies.length) return 'No pharmacies found matching this query in database.';
  return pharmacies.map((p, i) => {
    const dist = p.distance != null ? ` (${p.distance} km away)` : '';
    return `${i + 1}. ${p.name} | ${p.city || 'India'}${dist} | Phone: ${p.phone || 'Available'} | Hours: ${p.opening_hours || 'Open daily'} | ID: ${p.id}`;
  }).join('\n');
}

// ── Smart Rule-Based Healthcare Answer Generator (Guaranteed Fallback) ───────
function generateLocalHealthcareAnswer({ message, intent, isEmergency, locationHint, dbResults, detectedSpec }) {
  const locStr = locationHint ? `in ${locationHint}` : 'near you';

  // 1. EMERGENCY
  if (isEmergency) {
    let text = `🚨 **MEDICAL EMERGENCY ALERT**\n\n`;
    text += `If you or someone nearby is experiencing life-threatening symptoms (such as severe chest pain, breathing difficulty, unconsciousness, heavy bleeding, or stroke symptoms):\n\n`;
    text += `• **Call 108 immediately** for emergency ambulance service.\n`;
    text += `• **Call 112** for all-India emergency assistance.\n`;
    text += `• Go to the nearest emergency department right away.\n\n`;

    if (dbResults.hospitals && dbResults.hospitals.length > 0) {
      text += `**Nearest Hospitals with 24/7 Emergency Services:**\n`;
      dbResults.hospitals.slice(0, 3).forEach((h, i) => {
        const dist = h.distance != null ? ` (${h.distance} km away)` : '';
        text += `${i + 1}. **${h.name}** - ${h.city}${dist} | 📞 ${h.phone || 'Emergency Desk'}\n`;
      });
      text += `\n*Tap the emergency buttons below to call or navigate immediately.*`;
    }
    return text;
  }

  // 2. DOCTORS
  if (intent === 'doctor') {
    const specTitle = detectedSpec ? detectedSpec.charAt(0).toUpperCase() + detectedSpec.slice(1) : 'Doctor';
    let text = `Here are verified **${specTitle}s** ${locStr} from the JeevanSeva database:\n\n`;

    if (dbResults.doctors && dbResults.doctors.length > 0) {
      dbResults.doctors.forEach((d, i) => {
        const spec = d.specialization?.join(', ') || specTitle;
        const dist = d.distance != null ? ` • **${d.distance} km away**` : '';
        text += `👨‍⚕️ **Dr. ${d.name}**\n`;
        text += `• Specialty: ${spec}\n`;
        if (d.hospital) text += `• Hospital: ${d.hospital}\n`;
        text += `• Location: ${d.city || 'India'}${dist}\n`;
        if (d.fee) text += `• Consultation Fee: ₹${d.fee}\n`;
        text += `\n`;
      });
      text += `You can view profiles, check available slots, or book an appointment directly using the cards below.`;
    } else {
      text += `I couldn't find a doctor matching that specific specialty ${locStr} in our current listings. You can browse all available doctors on the Doctors page or expand your search distance.`;
    }
    return text;
  }

  // 3. HOSPITALS
  if (intent === 'hospital') {
    let text = `Here are healthcare facilities and **hospitals** ${locStr} from JeevanSeva:\n\n`;
    if (dbResults.hospitals && dbResults.hospitals.length > 0) {
      dbResults.hospitals.forEach((h, i) => {
        const dist = h.distance != null ? ` • **${h.distance} km**` : '';
        const em = h.hasEmergency ? ' • 🚨 24/7 Emergency' : '';
        text += `🏥 **${h.name}**\n`;
        text += `• Location: ${h.address || h.city}${dist}${em}\n`;
        if (h.phone) text += `• Phone: ${h.phone}\n`;
        if (h.rating) text += `• Rating: ${h.rating} ★\n`;
        text += `\n`;
      });
      text += `Use the cards below to view directions or call the hospital directly.`;
    } else {
      text += `No hospitals were found matching your query ${locStr}. Please check our Hospitals page for full listings.`;
    }
    return text;
  }

  // 4. MEDICINES
  if (intent === 'medicine') {
    if (dbResults.medicines && dbResults.medicines.length > 0) {
      const med = dbResults.medicines[0];
      let text = `📋 **Information for ${med.name}**:\n\n`;
      if (med.genericName) text += `• **Generic Name:** ${med.genericName}\n`;
      if (med.category) text += `• **Category / Class:** ${med.category}\n`;
      if (med.uses) text += `• **Common Uses:** ${med.uses}\n`;
      text += `• **Prescription Status:** ${med.prescriptionRequired ? '⚠️ Prescription Required (Rx)' : '✅ Over-the-counter (OTC)'}\n`;
      if (med.sideEffects) text += `• **Known Side Effects:** ${med.sideEffects}\n`;
      text += `\n⚠️ *Important Notice: This information is for educational purposes only. Never adjust or take medication without consulting a certified physician or pharmacist.*`;
      return text;
    } else {
      return `I couldn't find that specific medicine in the JeevanSeva database. Always consult a qualified pharmacist or doctor before taking any unfamiliar medication.`;
    }
  }

  // 5. PHARMACIES
  if (intent === 'pharmacy') {
    let text = `Here are nearby **pharmacies and medical stores** ${locStr}:\n\n`;
    if (dbResults.pharmacies && dbResults.pharmacies.length > 0) {
      dbResults.pharmacies.forEach((p, i) => {
        const dist = p.distance != null ? ` • **${p.distance} km away**` : '';
        text += `🏪 **${p.name}**\n`;
        text += `• Address: ${p.address || p.city}${dist}\n`;
        if (p.phone) text += `• Contact: ${p.phone}\n`;
        if (p.openingHours) text += `• Hours: ${p.openingHours}\n`;
        text += `\n`;
      });
      text += `Use the cards below to call or get instant directions via Google Maps.`;
    } else {
      text += `No pharmacies found in this specific area in our database. You can search the full Pharmacy Directory on JeevanSeva.`;
    }
    return text;
  }

  // 6. SYMPTOMS / HEALTH CONDITIONS
  if (intent === 'symptom' || intent === 'medical_info') {
    let text = `🩺 **Health Assessment & Guidance**:\n\n`;
    text += `Symptoms can have various underlying causes and require proper medical evaluation. Common recommendations:\n\n`;
    text += `1. **Consult a Specialist:** Based on your description, a consultation with a General Physician or relevant specialist is recommended for an accurate diagnosis.\n`;
    text += `2. **Warning Signs:** Seek immediate emergency care if you experience severe pain, difficulty breathing, high persistent fever, or disorientation.\n`;
    text += `3. **Self-Care:** Stay hydrated and rest, but avoid self-medicating with unprescribed antibiotics or strong painkillers.\n\n`;

    if (dbResults.doctors && dbResults.doctors.length > 0) {
      text += `**Recommended Doctors You Can Consult:**\n`;
      dbResults.doctors.slice(0, 2).forEach(d => {
        text += `• **Dr. ${d.name}** (${d.specialization?.join(', ') || 'Specialist'}) - ${d.city || 'Available'}\n`;
      });
      text += `\n*JeevanSeva AI provides educational information only and cannot replace clinical examination.*`;
    }
    return text;
  }

  // 7. GENERAL
  return `👋 I am **JeevanSeva AI Assistant**! I can help you find:\n\n` +
    `• **Doctors & Specialists:** Search by specialty, city, or nearest to your location.\n` +
    `• **Hospitals:** Find 24/7 emergency facilities, ICU beds, and hospital departments.\n` +
    `• **Medicines:** Look up uses, generic alternatives, side effects, and Rx status.\n` +
    `• **Pharmacies:** Locate nearby medical stores and open chemists.\n` +
    `• **Emergency:** Instant dial 108 ambulance and find emergency trauma centers.\n\n` +
    `How can I assist you right now?`;
}

// ── System Prompt for Gemini ──────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are JeevanSeva AI Assistant, a compassionate, accurate, and professional healthcare discovery assistant for India.

CORE PRINCIPLES:
1. NEVER diagnose a patient with certainty. Always explain that symptoms require clinical evaluation.
2. NEVER prescribe personal medication dosages or advise changing prescribed medicines.
3. NEVER fabricate doctor names, hospital names, phone numbers, or availability. Use the provided database facts.
4. For emergencies, prioritize emergency guidance (108 Ambulance, 112, nearest emergency hospital) immediately.
5. Provide clear, empathetic, easy-to-understand explanations for general health and medicine questions.
6. Support Indian healthcare context: ₹ currency, Indian medicines, Indian medical degrees (MBBS, MD, MS), 108/112 helplines.

Always conclude medical advice with a clear, subtle reminder to consult a qualified healthcare professional.`;

// ── Main Chat Handler ─────────────────────────────────────────────────────────
exports.chat = async (req, res) => {
  let userMessage = '';
  let intent = 'general';
  let isEmergency = false;
  let locationHint = null;
  let dbResults = {};

  try {
    const { message, history = [], lat, lng } = req.body || {};

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'A valid message is required.' });
    }

    userMessage = message.trim();
    if (userMessage.length > 1000) {
      userMessage = userMessage.substring(0, 1000);
    }

    isEmergency = detectEmergency(userMessage);
    intent = detectIntent(userMessage);
    locationHint = extractLocation(userMessage);
    const userLat = lat ? parseFloat(lat) : null;
    const userLng = lng ? parseFloat(lng) : null;

    // Detect doctor specialization keyword if any
    const specKeywords = [
      'cardiologist', 'neurologist', 'dermatologist', 'pediatrician', 'orthopedic',
      'gynecologist', 'psychiatrist', 'oncologist', 'diabetologist', 'gastroenterologist',
      'pulmonologist', 'nephrologist', 'urologist', 'endocrinologist', 'rheumatologist',
      'ophthalmologist', 'ent', 'dentist', 'physician', 'surgeon'
    ];
    const lowerMsg = userMessage.toLowerCase();
    const detectedSpec = specKeywords.find(s => lowerMsg.includes(s));

    // ── 1. Fetch relevant database records ──────────────────────────────────
    let dbContext = '';

    if (intent === 'doctor' || detectedSpec) {
      const doctors = await searchDoctors({
        query: locationHint || null,
        specialization: detectedSpec || null,
        lat: userLat,
        lng: userLng,
        city: locationHint,
        limit: 5
      });
      dbResults.doctors = doctors;
      dbContext += `\n\nJEEVANSEVA DOCTOR DATABASE:\n${formatDoctorsForAI(doctors)}`;
    }

    if (intent === 'hospital' || isEmergency) {
      const isEmergencyQuery = isEmergency || /emergency|icu|trauma|urgent/.test(lowerMsg);
      const hospitals = await searchHospitals({
        query: isEmergency ? null : (locationHint || null),
        emergency: isEmergencyQuery,
        lat: userLat,
        lng: userLng,
        city: locationHint,
        limit: 5
      });
      dbResults.hospitals = hospitals;
      dbContext += `\n\nJEEVANSEVA HOSPITAL DATABASE:\n${formatHospitalsForAI(hospitals)}`;
    }

    if (intent === 'medicine') {
      const medicines = await searchMedicines({ query: userMessage, limit: 5 });
      dbResults.medicines = medicines.map(m => m.toJSON ? m.toJSON() : m);
      dbContext += `\n\nJEEVANSEVA MEDICINE DATABASE:\n${formatMedicinesForAI(dbResults.medicines)}`;
    }

    if (intent === 'pharmacy') {
      const pharmacies = await searchPharmacies({
        lat: userLat,
        lng: userLng,
        city: locationHint,
        limit: 5
      });
      dbResults.pharmacies = pharmacies;
      dbContext += `\n\nJEEVANSEVA PHARMACY DATABASE:\n${formatPharmaciesForAI(pharmacies)}`;
    }

    if (intent === 'symptom' || intent === 'medical_info') {
      const { diseases, symptoms } = await searchHealthConditions(userMessage);
      dbResults.diseases = diseases;
      dbResults.symptoms = symptoms;
      if (diseases.length > 0) {
        dbContext += `\n\nJEEVANSEVA RELEVANT HEALTH CONDITIONS:\n` +
          diseases.map(d => `${d.name} (${d.specialty || 'General'}): ${d.description || ''}`).join('\n');
      }
      // Also fetch a couple of doctors in case user needs consultation
      const docs = await searchDoctors({
        specialization: diseases[0]?.specialty || null,
        lat: userLat,
        lng: userLng,
        city: locationHint,
        limit: 3
      });
      if (docs.length) {
        dbResults.doctors = docs;
      }
    }

    // ── 2. Format Structured Output Data for Frontend Cards ─────────────────
    const formattedDbResults = {
      doctors: dbResults.doctors ? dbResults.doctors.map(d => ({
        id: d.id,
        name: d.User?.name || 'Verified Doctor',
        specialization: d.DoctorSpecializations?.map(s => s.specialization) || [],
        hospital: d.Hospitals?.[0]?.name,
        city: d.User?.city || 'India',
        experience: d.experience_years,
        fee: d.consultation_fee,
        rating: d.rating,
        distance: d.distance,
        phone: d.User?.phone,
        avatar: d.User?.avatar
      })) : null,
      hospitals: dbResults.hospitals ? dbResults.hospitals.map(h => ({
        id: h.id,
        name: h.name,
        type: h.type,
        city: h.city,
        address: h.address,
        phone: h.phone,
        hasEmergency: h.has_emergency,
        rating: h.rating,
        distance: h.distance,
        latitude: h.latitude,
        longitude: h.longitude,
        openingHours: h.opening_hours
      })) : null,
      medicines: dbResults.medicines ? dbResults.medicines.map(m => ({
        id: m.id,
        name: m.name,
        genericName: m.generic_name,
        category: m.category,
        uses: m.uses,
        prescriptionRequired: m.prescription_required,
        sideEffects: m.side_effects,
        manufacturer: m.manufacturer
      })) : null,
      pharmacies: dbResults.pharmacies ? dbResults.pharmacies.map(p => ({
        id: p.id,
        name: p.name,
        city: p.city,
        address: p.address,
        phone: p.phone,
        distance: p.distance,
        openingHours: p.opening_hours,
        latitude: p.latitude,
        longitude: p.longitude
      })) : null,
      isEmergency
    };

    // ── 3. Generate AI Answer with Gemini (with multi-model fallback) ────────
    let replyText = null;

    if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('YOUR_GEMINI_API_KEY')) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      // Compose prompt
      const promptWithContext = dbContext
        ? `${userMessage}\n\n[ACTUAL DATABASE RESULTS FROM JEEVANSEVA]:\n${dbContext}\n\nINSTRUCTIONS: Answer the user's question clearly and helpfully using the database facts above. Do not invent unverified providers.`
        : userMessage;

      // Try available models in sequence
      for (const modelName of GEMINI_MODELS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: SYSTEM_PROMPT
          });

          // Build clean history for model
          const cleanHistory = (Array.isArray(history) ? history.slice(-6) : [])
            .filter(h => h && h.content && typeof h.content === 'string')
            .map(h => ({
              role: h.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: h.content }]
            }));

          const chatSession = model.startChat({ history: cleanHistory });
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout on model ${modelName}`)), 7000)
          );
          const result = await Promise.race([chatSession.sendMessage(promptWithContext), timeoutPromise]);
          const responseText = result?.response?.text();

          if (responseText && typeof responseText === 'string' && responseText.trim().length > 0) {
            replyText = responseText.trim();
            break; // Successfully generated!
          }
        } catch (modelErr) {
          console.warn(`[ChatController] Model ${modelName} attempt error:`, modelErr.message?.slice(0, 120));
          // Continue to next model
        }
      }
    }

    // ── 4. Fallback to local intelligent healthcare synthesizer if AI fails ─
    if (!replyText) {
      replyText = generateLocalHealthcareAnswer({
        message: userMessage,
        intent,
        isEmergency,
        locationHint,
        dbResults: formattedDbResults,
        detectedSpec
      });
    }

    return res.json({
      success: true,
      reply: replyText,
      intent,
      isEmergency,
      dbResults: formattedDbResults
    });

  } catch (unexpectedError) {
    console.error('[ChatController] Unexpected Error:', unexpectedError);

    // Guaranteed safe response so user never receives an uncaught error or [object Object]
    const safeFallback = generateLocalHealthcareAnswer({
      message: userMessage || 'help',
      intent: intent || 'general',
      isEmergency: isEmergency || false,
      locationHint,
      dbResults: {},
      detectedSpec: null
    });

    return res.json({
      success: true,
      reply: safeFallback,
      intent: 'general',
      isEmergency: false,
      dbResults: null
    });
  }
};

// ── Suggested Prompts Endpoint ────────────────────────────────────────────────
exports.getSuggestedPrompts = (req, res) => {
  res.json({
    success: true,
    prompts: [
      { icon: '🔍', text: 'Find a doctor near me', category: 'doctor' },
      { icon: '🏥', text: 'Find nearby hospitals', category: 'hospital' },
      { icon: '💊', text: 'What is Paracetamol used for?', category: 'medicine' },
      { icon: '🩺', text: 'I have fever and body ache', category: 'symptom' },
      { icon: '🚑', text: 'Emergency ambulance help', category: 'emergency' },
      { icon: '📍', text: 'Find pharmacy near me', category: 'pharmacy' }
    ]
  });
};
