const {
  User, Doctor, Hospital, HospitalDepartment,
  DoctorSpecialization, DoctorHospital, Pharmacy, sequelize
} = require('../models');
const bcrypt = require('bcryptjs');

async function seedBhopal() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database for Bhopal seeding...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Bhopal Hospitals
    console.log('Seeding Bhopal Hospitals...');
    const bhopalHospitalsData = [
      {
        name: 'AIIMS Bhopal - All India Institute of Medical Sciences',
        type: 'government',
        registration_number: 'AIIMS-BPL-001',
        description: 'Apex healthcare institute offering advanced tertiary care, multi-specialty trauma, cardiology, oncology, and robotic surgery.',
        has_emergency: true,
        emergency_contact: '0755-2982607',
        phone: '0755-2982600',
        email: 'info@aiimsbhopal.edu.in',
        opening_hours: '24 Hours',
        address: 'Saket Nagar, Habib Ganj',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462020',
        latitude: 23.2066,
        longitude: 77.4533,
        rating: 4.8,
        total_reviews: 950,
        is_verified: true
      },
      {
        name: 'Gandhi Medical College & Hamidia Hospital',
        type: 'government',
        registration_number: 'GOV-HMD-002',
        description: 'Premier government medical college and largest tertiary care civil hospital in Bhopal with 2000+ beds and a 24/7 emergency trauma centre.',
        has_emergency: true,
        emergency_contact: '0755-2540222',
        phone: '0755-2540222',
        email: 'contact@hamidiabhopal.gov.in',
        opening_hours: '24 Hours',
        address: 'Royal Market, Sultania Road, Medical College Campus',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462001',
        latitude: 23.2618,
        longitude: 77.3912,
        rating: 4.3,
        total_reviews: 820,
        is_verified: true
      },
      {
        name: 'Bhopal Memorial Hospital & Research Centre (BMHRC)',
        type: 'government',
        registration_number: 'GOV-BMHRC-003',
        description: 'Multi-specialty 350-bed research hospital dedicated to providing high-level specialty care with advanced cardiac, pulmonary, and nephrology facilities.',
        has_emergency: true,
        emergency_contact: '0755-2740325',
        phone: '0755-2740325',
        email: 'director@bmhrc.ac.in',
        opening_hours: '24 Hours',
        address: 'Raisen Bypass Road, Near Karond',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462038',
        latitude: 23.3082,
        longitude: 77.4190,
        rating: 4.5,
        total_reviews: 640,
        is_verified: true
      },
      {
        name: 'Bansal Hospital Bhopal',
        type: 'private',
        registration_number: 'PVT-BNS-004',
        description: '300-bed tertiary care super-specialty hospital with state-of-the-art cath labs, liver & kidney transplant, neurosurgery, and oncology.',
        has_emergency: true,
        emergency_contact: '0755-4086000',
        phone: '0755-4086000',
        email: 'contact@bansalhospital.com',
        opening_hours: '24 Hours',
        address: 'C-Sector, Shahpura, Near Manisha Market',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462016',
        latitude: 23.1970,
        longitude: 77.4285,
        rating: 4.7,
        total_reviews: 1120,
        is_verified: true
      },
      {
        name: 'Chirayu Health & Medicare Hospital',
        type: 'private',
        registration_number: 'PVT-CHY-005',
        description: 'Expansive 1000-bed super-specialty medical facility on the highway providing emergency trauma, critical care, and affordable treatments.',
        has_emergency: true,
        emergency_contact: '0755-2700700',
        phone: '0755-2700700',
        email: 'info@chirayuhospital.info',
        opening_hours: '24 Hours',
        address: 'Bhopal-Indore Highway, Bairagarh',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462030',
        latitude: 23.2755,
        longitude: 77.3320,
        rating: 4.4,
        total_reviews: 730,
        is_verified: true
      },
      {
        name: 'Narmada Trauma Centre & Multi-Speciality Hospital',
        type: 'private',
        registration_number: 'PVT-NRM-006',
        description: 'Pioneering trauma and emergency care centre in Arera Colony equipped with modular OTs, orthopedic trauma units, and pediatric intensive care.',
        has_emergency: true,
        emergency_contact: '0755-4040000',
        phone: '0755-4040000',
        email: 'contact@narmadahospital.com',
        opening_hours: '24 Hours',
        address: 'E-3/23, Arera Colony, Near 10 Number Market',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462016',
        latitude: 23.2185,
        longitude: 77.4330,
        rating: 4.6,
        total_reviews: 580,
        is_verified: true
      },
      {
        name: 'J.P. District Hospital (1250 Hospital Bhopal)',
        type: 'government',
        registration_number: 'GOV-JP-007',
        description: 'Central district civil hospital offering 24/7 emergency casualty, delivery wing, child immunization, and diagnostic pathology.',
        has_emergency: true,
        emergency_contact: '0755-2556555',
        phone: '0755-2556555',
        email: 'jphospital@mphealth.gov.in',
        opening_hours: '24 Hours',
        address: '1250, Tulsi Nagar, Shivaji Nagar',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462003',
        latitude: 23.2280,
        longitude: 77.4190,
        rating: 4.2,
        total_reviews: 490,
        is_verified: true
      },
      {
        name: 'Primary Health Centre (PHC) Kolar Road',
        type: 'phc',
        registration_number: 'PHC-BPL-008',
        description: 'Community public health post for maternal checkups, vaccines, general ailments, and free essential government medicines.',
        has_emergency: false,
        emergency_contact: '0755-2420111',
        phone: '0755-2420111',
        email: 'phc.kolar@mphealth.gov.in',
        opening_hours: '9:00 AM - 5:00 PM',
        address: 'Sarvadharma Sector A, Main Kolar Road',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462042',
        latitude: 23.1690,
        longitude: 77.4170,
        rating: 4.1,
        total_reviews: 110,
        is_verified: true
      },
      {
        name: 'Community Health Centre (CHC) Gandhi Nagar',
        type: 'chc',
        registration_number: 'CHC-BPL-009',
        description: 'Secondary care community clinic with 30 beds, emergency stabilization, labor room, and outpatient consultation.',
        has_emergency: true,
        emergency_contact: '0755-2735123',
        phone: '0755-2735123',
        email: 'chc.gandhinagar@mphealth.gov.in',
        opening_hours: '24 Hours',
        address: 'Airport Road, Gandhi Nagar Block',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462036',
        latitude: 23.2980,
        longitude: 77.3550,
        rating: 4.3,
        total_reviews: 145,
        is_verified: true
      },
      {
        name: 'Sagar Multi-Speciality Hospital',
        type: 'private',
        registration_number: 'PVT-SGR-010',
        description: '300-bed modern multi-specialty hospital with advanced neonatal ICU, joint replacement, and round-the-clock emergency casualty.',
        has_emergency: true,
        emergency_contact: '0755-6668888',
        phone: '0755-6668888',
        email: 'info@sagarhospitalbhopal.com',
        opening_hours: '24 Hours',
        address: 'Ayodhya Bypass Road, Near Sagar Landmark',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462041',
        latitude: 23.2650,
        longitude: 77.4720,
        rating: 4.5,
        total_reviews: 380,
        is_verified: true
      }
    ];

    const createdBhopalHospitals = [];
    for (const h of bhopalHospitalsData) {
      let [hosp] = await Hospital.findOrCreate({
        where: { registration_number: h.registration_number },
        defaults: h
      });
      // Ensure coordinates are updated
      await hosp.update({
        latitude: h.latitude,
        longitude: h.longitude,
        city: 'Bhopal',
        state: 'Madhya Pradesh'
      });
      createdBhopalHospitals.push(hosp);
    }

    // 2. Bhopal Doctors
    console.log('Seeding Bhopal Doctors...');
    const bhopalDoctorsData = [
      {
        name: 'Dr. Alok Verma',
        email: 'dr.alok.verma@jeevanseva.org',
        phone: '9826011122',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.2066,
        longitude: 77.4533,
        qualification: 'MBBS, MD (General Medicine - AIIMS)',
        specialization: 'General Medicine',
        experience_years: 14,
        consultation_fee: 300,
        bio: 'Senior consultant physician at AIIMS Bhopal with extensive expertise in diabetes management, persistent fever, and hypertension.',
        languages_spoken: 'Hindi, English',
        rating: 4.9,
        total_reviews: 240,
        hospitalIndex: 0 // AIIMS Bhopal
      },
      {
        name: 'Dr. Ritu Singhal',
        email: 'dr.ritu.singhal@jeevanseva.org',
        phone: '9826022233',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.1970,
        longitude: 77.4285,
        qualification: 'MBBS, MD, DM (Cardiology)',
        specialization: 'Cardiology',
        experience_years: 16,
        consultation_fee: 600,
        bio: 'Chief interventional cardiologist at Bansal Hospital. Expert in coronary angiography, heart failure management, and preventive heart care.',
        languages_spoken: 'Hindi, English',
        rating: 4.9,
        total_reviews: 310,
        hospitalIndex: 3 // Bansal Hospital
      },
      {
        name: 'Dr. Deepak Agrawal',
        email: 'dr.deepak.agrawal@jeevanseva.org',
        phone: '9826033344',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.2618,
        longitude: 77.3912,
        qualification: 'MBBS, DCH, MD (Pediatrics)',
        specialization: 'Pediatrics',
        experience_years: 13,
        consultation_fee: 250,
        bio: 'Professor and senior pediatrician at Hamidia Hospital. Specialized in newborn intensive care, seasonal child allergies, and vaccinations.',
        languages_spoken: 'Hindi, English',
        rating: 4.8,
        total_reviews: 190,
        hospitalIndex: 1 // Hamidia Hospital
      },
      {
        name: 'Dr. Pratibha Chouhan',
        email: 'dr.pratibha.chouhan@jeevanseva.org',
        phone: '9826044455',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.2185,
        longitude: 77.4330,
        qualification: 'MBBS, MS (Obstetrics & Gynecology)',
        specialization: 'Gynecology',
        experience_years: 15,
        consultation_fee: 400,
        bio: 'Leading gynecologist at Narmada Hospital Arera Colony. Specializes in high-risk pregnancy, PCOS treatment, and women hormonal wellness.',
        languages_spoken: 'Hindi, English',
        rating: 4.9,
        total_reviews: 280,
        hospitalIndex: 5 // Narmada Trauma Centre
      },
      {
        name: 'Dr. Suresh Saxena',
        email: 'dr.suresh.saxena@jeevanseva.org',
        phone: '9826055566',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.3082,
        longitude: 77.4190,
        qualification: 'MBBS, MS (Orthopedics)',
        specialization: 'Orthopedics',
        experience_years: 18,
        consultation_fee: 350,
        bio: 'Senior orthopedic surgeon at BMHRC Bhopal. Specialized in knee & hip joint replacement, arthritis management, and fracture rehabilitation.',
        languages_spoken: 'Hindi, English',
        rating: 4.8,
        total_reviews: 220,
        hospitalIndex: 2 // BMHRC
      },
      {
        name: 'Dr. Meenakshi Tiwari',
        email: 'dr.meenakshi.tiwari@jeevanseva.org',
        phone: '9826066677',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.2280,
        longitude: 77.4190,
        qualification: 'MBBS, MD (Dermatology & Cosmetology)',
        specialization: 'Dermatology',
        experience_years: 11,
        consultation_fee: 300,
        bio: 'Dermatologist at J.P. Hospital Tulsi Nagar. Focuses on acne control, eczema, fungal infections, allergic skin disorders, and hair restoration.',
        languages_spoken: 'Hindi, English',
        rating: 4.7,
        total_reviews: 165,
        hospitalIndex: 6 // JP Hospital
      },
      {
        name: 'Dr. Sandeep Malviya',
        email: 'dr.sandeep.malviya@jeevanseva.org',
        phone: '9826077788',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.1690,
        longitude: 77.4170,
        qualification: 'MBBS (Family Physician)',
        specialization: 'General Medicine',
        experience_years: 9,
        consultation_fee: 150,
        bio: 'Community medical doctor at PHC Kolar Road. Offers affordable consultations for viral fever, seasonal infections, and common gastrointestinal issues.',
        languages_spoken: 'Hindi, English',
        rating: 4.7,
        total_reviews: 130,
        hospitalIndex: 7 // PHC Kolar
      },
      {
        name: 'Dr. Vivek Dubey',
        email: 'dr.vivek.dubey@jeevanseva.org',
        phone: '9826088899',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.2755,
        longitude: 77.3320,
        qualification: 'MBBS, MD, DM (Neurology)',
        specialization: 'Neurology',
        experience_years: 14,
        consultation_fee: 550,
        bio: 'Senior neurologist at Chirayu Hospital. Specializes in migraine headaches, stroke rehabilitation, epilepsy treatment, and nerve disorders.',
        languages_spoken: 'Hindi, English',
        rating: 4.8,
        total_reviews: 175,
        hospitalIndex: 4 // Chirayu Hospital
      },
      {
        name: 'Dr. Mohit Patidar',
        email: 'dr.mohit.patidar@jeevanseva.org',
        phone: '9826099900',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.2650,
        longitude: 77.4720,
        qualification: 'MBBS, MS (Ophthalmology)',
        specialization: 'Ophthalmology',
        experience_years: 10,
        consultation_fee: 300,
        bio: 'Eye specialist and cataract surgeon at Sagar Hospital Ayodhya Bypass. Offers computerized vision testing, diabetic eye checkups, and glaucoma treatment.',
        languages_spoken: 'Hindi, English',
        rating: 4.8,
        total_reviews: 140,
        hospitalIndex: 9 // Sagar Hospital
      }
    ];

    for (const d of bhopalDoctorsData) {
      let user = await User.findOne({ where: { email: d.email } });
      if (!user) {
        user = await User.create({
          name: d.name,
          email: d.email,
          phone: d.phone,
          password_hash: hashedPassword,
          role: 'doctor',
          city: d.city,
          state: d.state,
          latitude: d.latitude,
          longitude: d.longitude,
          is_verified: true,
          is_active: true
        });
      } else {
        await user.update({
          latitude: d.latitude,
          longitude: d.longitude,
          city: d.city,
          state: d.state
        });
      }

      let doctor = await Doctor.findOne({ where: { user_id: user.id } });
      if (!doctor) {
        doctor = await Doctor.create({
          user_id: user.id,
          registration_number: `MPMC-${Math.floor(10000 + Math.random() * 90000)}`,
          qualification: d.qualification,
          experience_years: d.experience_years,
          consultation_fee: d.consultation_fee,
          bio: d.bio,
          languages_spoken: d.languages_spoken,
          rating: d.rating,
          total_reviews: d.total_reviews,
          is_available: true,
          is_verified: true
        });

        await DoctorSpecialization.create({
          doctor_id: doctor.id,
          specialization: d.specialization,
          is_primary: true
        });

        const targetHospital = createdBhopalHospitals[d.hospitalIndex];
        if (targetHospital) {
          await DoctorHospital.findOrCreate({
            where: { doctor_id: doctor.id, hospital_id: targetHospital.id },
            defaults: { doctor_id: doctor.id, hospital_id: targetHospital.id, is_primary: true }
          });
        }
      }
    }

    // 3. Bhopal Pharmacies
    console.log('Seeding Bhopal Pharmacies...');
    const bhopalPharmaciesData = [
      {
        name: 'Apollo Pharmacy 24/7 MP Nagar',
        phone: '0755-4201122',
        email: 'bhopal.mpnagar@apollopharmacy.org',
        address: 'Plot 14, Zone-II, Near Sargam Cinema, MP Nagar',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462011',
        latitude: 23.2320,
        longitude: 77.4320,
        opening_hours: '24 Hours Open',
        is_24_hours: true,
        home_delivery: true,
        is_active: true
      },
      {
        name: 'Jan Aushadhi Kendra (Govt Affordable Medicine) Hamidia Campus',
        phone: '0755-2541100',
        email: 'janaushadhi.hamidia@mp.gov.in',
        address: 'Gate No. 1, Hamidia Hospital Complex, Royal Market',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462001',
        latitude: 23.2620,
        longitude: 77.3915,
        opening_hours: '8:00 AM - 9:00 PM',
        is_24_hours: false,
        home_delivery: false,
        is_active: true
      },
      {
        name: 'Sanjivani Medical Store 24/7 Shahpura',
        phone: '0755-4081234',
        email: 'sanjivani.shahpura@gmail.com',
        address: 'Shop 5, C-Sector Market, Opposite Bansal Hospital, Shahpura',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462016',
        latitude: 23.1975,
        longitude: 77.4290,
        opening_hours: '24 Hours Open',
        is_24_hours: true,
        home_delivery: true,
        is_active: true
      },
      {
        name: 'Wellness Forever Chemist & Druggist 24/7 Arera Colony',
        phone: '0755-4256789',
        email: 'arera.bhopal@wellnessforever.in',
        address: 'E-3/45, 10 Number Market, Arera Colony',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462016',
        latitude: 23.2190,
        longitude: 77.4340,
        opening_hours: '24 Hours Open',
        is_24_hours: true,
        home_delivery: true,
        is_active: true
      },
      {
        name: 'Amrit Pharmacy 24/7 (AIIMS Bhopal Campus)',
        phone: '0755-2982600',
        email: 'amrit.aiimsbpl@gov.in',
        address: 'Ground Floor, OPD Building, AIIMS Campus, Saket Nagar',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462020',
        latitude: 23.2070,
        longitude: 77.4530,
        opening_hours: '24 Hours Open',
        is_24_hours: true,
        home_delivery: false,
        is_active: true
      },
      {
        name: 'Noble Chemist & Surgicals 24/7 New Market',
        phone: '0755-2554433',
        email: 'noblechemist.bhopal@gmail.com',
        address: 'Topkhana Road, Near Roshanpura Square, New Market',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462003',
        latitude: 23.2380,
        longitude: 77.4010,
        opening_hours: '24 Hours Open',
        is_24_hours: true,
        home_delivery: true,
        is_active: true
      }
    ];

    for (const p of bhopalPharmaciesData) {
      let [pharm] = await Pharmacy.findOrCreate({
        where: { name: p.name },
        defaults: p
      });
      await pharm.update({
        latitude: p.latitude,
        longitude: p.longitude,
        city: 'Bhopal',
        state: 'Madhya Pradesh'
      });
    }

    console.log('✅ Bhopal hospitals, doctors, and pharmacies successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Bhopal data:', error);
    process.exit(1);
  }
}

seedBhopal();
