const { Pharmacy, sequelize } = require('../models');

const additionalPharmacies = [
  // Jamshedpur (Jharkhand)
  {
    name: 'Apollo Pharmacy 24/7 Bistupur',
    phone: '+91-657-2249001',
    email: 'bistupur@apollopharmacy.org',
    address: 'Main Road, Near Gopal Maidan, Bistupur',
    city: 'Jamshedpur',
    state: 'Jharkhand',
    pincode: '831001',
    latitude: 22.7985,
    longitude: 86.1865,
    opening_hours: '24 Hours Open',
    is_24_hours: true,
    home_delivery: true,
    is_active: true
  },
  {
    name: 'Jan Aushadhi Kendra (Govt Affordable Medicine) Sakchi',
    phone: '+91-657-2431200',
    email: 'sakchi.aushadhi@gov.in',
    address: 'Opposite MGM Medical College Hospital, Sakchi',
    city: 'Jamshedpur',
    state: 'Jharkhand',
    pincode: '831001',
    latitude: 22.8090,
    longitude: 86.2025,
    opening_hours: '08:00 AM - 10:00 PM',
    is_24_hours: false,
    home_delivery: false,
    is_active: true
  },
  {
    name: 'MedPlus Chemist & Druggist Telco Colony',
    phone: '+91-657-2284560',
    email: 'telco@medplusindia.com',
    address: 'Telco Town, Near Plaza Market',
    city: 'Jamshedpur',
    state: 'Jharkhand',
    pincode: '831004',
    latitude: 22.7750,
    longitude: 86.2420,
    opening_hours: '24 Hours Open',
    is_24_hours: true,
    home_delivery: true,
    is_active: true
  },
  {
    name: 'Sanjivani Medical Store Kadma',
    phone: '+91-657-2301980',
    email: 'kadma.sanjivani@gmail.com',
    address: 'Uliyan Main Road, Kadma',
    city: 'Jamshedpur',
    state: 'Jharkhand',
    pincode: '831005',
    latitude: 22.7890,
    longitude: 86.1620,
    opening_hours: '07:30 AM - 11:00 PM',
    is_24_hours: false,
    home_delivery: true,
    is_active: true
  },
  {
    name: 'Tata Main Hospital (TMH) Outpatient 24/7 Pharmacy',
    phone: '+91-657-6641000',
    email: 'pharmacy@tatasteel.com',
    address: 'TMH Campus, C Road, Northern Town',
    city: 'Jamshedpur',
    state: 'Jharkhand',
    pincode: '831001',
    latitude: 22.8020,
    longitude: 86.1950,
    opening_hours: '24 Hours Open',
    is_24_hours: true,
    home_delivery: false,
    is_active: true
  },

  // Ranchi (Jharkhand)
  {
    name: 'Apollo Pharmacy 24/7 Main Road Ranchi',
    phone: '+91-651-2330550',
    email: 'ranchi.mainrd@apollopharmacy.org',
    address: 'Near Overbridge, Main Road',
    city: 'Ranchi',
    state: 'Jharkhand',
    pincode: '834001',
    latitude: 23.3550,
    longitude: 85.3280,
    opening_hours: '24 Hours Open',
    is_24_hours: true,
    home_delivery: true,
    is_active: true
  },
  {
    name: 'Jan Aushadhi Kendra (RIMS Campus) Bariatu',
    phone: '+91-651-2541200',
    email: 'rims.aushadhi@gov.in',
    address: 'Rajendra Institute of Medical Sciences (RIMS), Bariatu',
    city: 'Ranchi',
    state: 'Jharkhand',
    pincode: '834009',
    latitude: 23.3850,
    longitude: 85.3620,
    opening_hours: '24 Hours Open',
    is_24_hours: true,
    home_delivery: false,
    is_active: true
  },

  // Kolkata (West Bengal)
  {
    name: 'Frank Ross Pharmacy 24/7 Park Street',
    phone: '+91-33-22268710',
    email: 'parkstreet@frankross.in',
    address: 'Park Street Crossing, Central Kolkata',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700016',
    latitude: 22.5510,
    longitude: 88.3530,
    opening_hours: '24 Hours Open',
    is_24_hours: true,
    home_delivery: true,
    is_active: true
  },

  // Lucknow (Uttar Pradesh)
  {
    name: 'Apollo Pharmacy 24/7 Hazratganj',
    phone: '+91-522-2621450',
    email: 'hazratganj@apollopharmacy.org',
    address: 'M.G. Marg, Hazratganj',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226001',
    latitude: 26.8480,
    longitude: 80.9450,
    opening_hours: '24 Hours Open',
    is_24_hours: true,
    home_delivery: true,
    is_active: true
  },

  // Patna (Bihar)
  {
    name: 'MedPlus Chemist 24/7 Kankarbagh',
    phone: '+91-612-2354890',
    email: 'kankarbagh@medplusindia.com',
    address: 'Kankarbagh Main Road, Near Colony More',
    city: 'Patna',
    state: 'Bihar',
    pincode: '800020',
    latitude: 25.5940,
    longitude: 85.1580,
    opening_hours: '24 Hours Open',
    is_24_hours: true,
    home_delivery: true,
    is_active: true
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    for (const data of additionalPharmacies) {
      const existing = await Pharmacy.findOne({ where: { name: data.name } });
      if (!existing) {
        await Pharmacy.create(data);
        console.log(`Created pharmacy: ${data.name} (${data.city})`);
      } else {
        await existing.update(data);
        console.log(`Updated pharmacy: ${data.name}`);
      }
    }

    const count = await Pharmacy.count();
    console.log(`Total pharmacies in database now: ${count}`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
