const {
  User, Doctor, Hospital, HospitalDepartment,
  DoctorSpecialization, DoctorHospital, Pharmacy, Medicine,
  EmergencyService, sequelize
} = require('../models');
const bcrypt = require('bcryptjs');

async function seedRegional200km() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database for 200km regional seeding...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Regional Hospitals within 200 km
    console.log('Seeding 200km Regional Hospitals...');
    const regionalHospitals = [
      // Bhopal Additional Major Centres
      {
        name: 'People’s College of Medical Sciences & Research Centre',
        type: 'private',
        registration_number: 'PVT-BPL-PPL-011',
        description: '1000-bed multispecialty teaching hospital with advanced intensive care, neurosurgery, trauma unit, and dialysis center.',
        has_emergency: true,
        emergency_contact: '0755-4005111',
        phone: '0755-4005000',
        email: 'peopleshospital@peoplesuniversity.edu.in',
        opening_hours: '24 Hours',
        address: 'Bhanpur Bypass Road, Karond',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462037',
        latitude: 23.3050,
        longitude: 77.4280,
        rating: 4.4,
        total_reviews: 420,
        is_verified: true
      },
      {
        name: 'Kasturba Hospital BHEL',
        type: 'government',
        registration_number: 'GOV-BPL-KST-012',
        description: 'Comprehensive 450-bed PSU hospital serving public and industrial workers with modular OTs, burns unit, and emergency care.',
        has_emergency: true,
        emergency_contact: '0755-2505222',
        phone: '0755-2505000',
        email: 'kasturba.hospital@bhel.in',
        opening_hours: '24 Hours',
        address: 'Habibganj BHEL Township, Gautam Nagar',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462024',
        latitude: 23.2250,
        longitude: 77.4680,
        rating: 4.3,
        total_reviews: 310,
        is_verified: true
      },
      {
        name: 'Jawaharlal Nehru Cancer Hospital & Research Centre',
        type: 'private',
        registration_number: 'PVT-BPL-JNC-013',
        description: 'Premier oncology hospital specializing in radiation therapy, surgical oncology, bone marrow transplants, and palliative care.',
        has_emergency: true,
        emergency_contact: '0755-2665720',
        phone: '0755-2665720',
        email: 'info@jncancerhospital.org',
        opening_hours: '24 Hours',
        address: 'Idgah Hills, Near TB Hospital',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462001',
        latitude: 23.2720,
        longitude: 77.3820,
        rating: 4.6,
        total_reviews: 540,
        is_verified: true
      },
      {
        name: 'Miracles Children & Multi-Speciality Hospital',
        type: 'private',
        registration_number: 'PVT-BPL-MRC-014',
        description: 'Dedicated mother and child hospital equipped with Level-III NICU/PICU, pediatric surgery, and round-the-clock emergency casualty.',
        has_emergency: true,
        emergency_contact: '0755-4921000',
        phone: '0755-4921000',
        email: 'contact@miracleshospital.in',
        opening_hours: '24 Hours',
        address: 'Hoshangabad Road, Near Misrod Square',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462047',
        latitude: 23.1610,
        longitude: 77.4720,
        rating: 4.7,
        total_reviews: 290,
        is_verified: true
      },

      // Sehore (~38 km from Bhopal)
      {
        name: 'District Civil Hospital Sehore',
        type: 'government',
        registration_number: 'GOV-SEH-015',
        description: 'Key district health centre with 300 beds, blood bank, maternity wards, and 24/7 emergency casualty for highway accidents.',
        has_emergency: true,
        emergency_contact: '07562-224222',
        phone: '07562-224222',
        email: 'civilhospital.sehore@mphealth.gov.in',
        opening_hours: '24 Hours',
        address: 'Bhopal-Indore Road, Near Bus Stand',
        city: 'Sehore',
        state: 'Madhya Pradesh',
        pincode: '466001',
        latitude: 23.2010,
        longitude: 77.0850,
        rating: 4.1,
        total_reviews: 210,
        is_verified: true
      },
      {
        name: 'Crescent Multispeciality Hospital & Heart Centre',
        type: 'private',
        registration_number: 'PVT-SEH-016',
        description: 'Modern private healthcare facility offering cardiology, orthopedic trauma, laparoscopy, and intensive care on the highway.',
        has_emergency: true,
        emergency_contact: '07562-251000',
        phone: '07562-251000',
        email: 'info@crescenthospital.com',
        opening_hours: '24 Hours',
        address: 'Crescent Square, Sehore Bypass',
        city: 'Sehore',
        state: 'Madhya Pradesh',
        pincode: '466001',
        latitude: 23.2050,
        longitude: 77.0780,
        rating: 4.4,
        total_reviews: 180,
        is_verified: true
      },

      // Raisen (~45 km from Bhopal)
      {
        name: 'District Hospital Raisen',
        type: 'government',
        registration_number: 'GOV-RSN-017',
        description: 'District civil hospital offering emergency casualty, neonatal unit, free generic medicine dispensary, and diagnostic pathology.',
        has_emergency: true,
        emergency_contact: '07482-222100',
        phone: '07482-222100',
        email: 'dh.raisen@mphealth.gov.in',
        opening_hours: '24 Hours',
        address: 'Civil Lines, Near Collectorate',
        city: 'Raisen',
        state: 'Madhya Pradesh',
        pincode: '464551',
        latitude: 23.3320,
        longitude: 77.7810,
        rating: 4.0,
        total_reviews: 160,
        is_verified: true
      },
      {
        name: 'Community Health Centre (CHC) Sanchi',
        type: 'chc',
        registration_number: 'CHC-RSN-018',
        description: '30-bed secondary healthcare unit providing round-the-clock emergency medical assistance, deliveries, and vaccination drives.',
        has_emergency: true,
        emergency_contact: '07482-266200',
        phone: '07482-266200',
        email: 'chc.sanchi@mphealth.gov.in',
        opening_hours: '24 Hours',
        address: 'Main Vidisha Road, Sanchi Block',
        city: 'Sanchi',
        state: 'Madhya Pradesh',
        pincode: '464661',
        latitude: 23.4860,
        longitude: 77.7390,
        rating: 4.2,
        total_reviews: 95,
        is_verified: true
      },

      // Vidisha (~55 km from Bhopal)
      {
        name: 'Atal Bihari Vajpayee Govt Medical College & Hospital',
        type: 'government',
        registration_number: 'GOV-VDS-019',
        description: '750-bed state government medical college hospital featuring modern trauma ICU, cardiology, pediatrics, and surgical theaters.',
        has_emergency: true,
        emergency_contact: '07592-251100',
        phone: '07592-251100',
        email: 'dean.abvgmc@mp.gov.in',
        opening_hours: '24 Hours',
        address: 'Bhopal-Vidisha Highway, Khasra 113',
        city: 'Vidisha',
        state: 'Madhya Pradesh',
        pincode: '464001',
        latitude: 23.5350,
        longitude: 77.8180,
        rating: 4.5,
        total_reviews: 380,
        is_verified: true
      },

      // Narmadapuram / Hoshangabad (~75 km from Bhopal)
      {
        name: 'District Hospital Narmadapuram',
        type: 'government',
        registration_number: 'GOV-HSH-020',
        description: 'Major regional civil hospital serving Narmada river valley with 400 beds, blood bank, trauma unit, and dialysis wing.',
        has_emergency: true,
        emergency_contact: '07574-252100',
        phone: '07574-252100',
        email: 'dh.narmadapuram@mphealth.gov.in',
        opening_hours: '24 Hours',
        address: 'Kothi Bazaar, Hospital Road',
        city: 'Narmadapuram',
        state: 'Madhya Pradesh',
        pincode: '461001',
        latitude: 22.7510,
        longitude: 77.7280,
        rating: 4.2,
        total_reviews: 260,
        is_verified: true
      },
      {
        name: 'Narmada Valley Multi-Speciality Hospital',
        type: 'private',
        registration_number: 'PVT-HSH-021',
        description: 'Comprehensive private hospital offering 24/7 cardiac ICU, joint replacement, neurology, and advanced laparoscopic surgery.',
        has_emergency: true,
        emergency_contact: '07574-278000',
        phone: '07574-278000',
        email: 'info@narmadavalleyhospital.com',
        opening_hours: '24 Hours',
        address: 'Bhopal-Jabalpur Highway, Meenakshi Chowk',
        city: 'Narmadapuram',
        state: 'Madhya Pradesh',
        pincode: '461001',
        latitude: 22.7480,
        longitude: 77.7350,
        rating: 4.6,
        total_reviews: 210,
        is_verified: true
      },

      // Itarsi (~90 km from Bhopal)
      {
        name: 'Dr. Shyama Prasad Mukherjee Civil Hospital Itarsi',
        type: 'government',
        registration_number: 'GOV-ITR-022',
        description: 'Important railway junction hospital offering 24/7 casualty trauma stabilization, surgical wing, and maternity care.',
        has_emergency: true,
        emergency_contact: '07572-232111',
        phone: '07572-232111',
        email: 'hospital.itarsi@mphealth.gov.in',
        opening_hours: '24 Hours',
        address: 'Over Bridge Road, Near Railway Colony',
        city: 'Itarsi',
        state: 'Madhya Pradesh',
        pincode: '461111',
        latitude: 22.6130,
        longitude: 77.7580,
        rating: 4.1,
        total_reviews: 190,
        is_verified: true
      },

      // Dewas (~150 km from Bhopal)
      {
        name: 'Amaltas Institute of Medical Sciences & Hospital',
        type: 'private',
        registration_number: 'PVT-DWS-023',
        description: '750-bed multi-specialty medical college hospital providing emergency trauma care, neurosurgery, nephrology, and neonatal ICU.',
        has_emergency: true,
        emergency_contact: '07272-426500',
        phone: '07272-426500',
        email: 'info@amaltashospital.in',
        opening_hours: '24 Hours',
        address: 'Village Bangar, Dewas-Ujjain Highway',
        city: 'Dewas',
        state: 'Madhya Pradesh',
        pincode: '455001',
        latitude: 22.9230,
        longitude: 76.0120,
        rating: 4.5,
        total_reviews: 310,
        is_verified: true
      },

      // Ujjain (~190 km from Bhopal)
      {
        name: 'R.D. Gardi Medical College & Charitable Hospital',
        type: 'private',
        registration_number: 'PVT-UJN-024',
        description: '850-bed charitable teaching hospital providing low-cost tertiary healthcare, 24/7 cardiac ICU, and regional trauma care.',
        has_emergency: true,
        emergency_contact: '0734-2526000',
        phone: '0734-2526000',
        email: 'rdgardi@rdgmc.com',
        opening_hours: '24 Hours',
        address: 'Surasa, Agar Road',
        city: 'Ujjain',
        state: 'Madhya Pradesh',
        pincode: '456006',
        latitude: 23.1580,
        longitude: 75.8310,
        rating: 4.4,
        total_reviews: 490,
        is_verified: true
      },

      // Indore (~195 km from Bhopal)
      {
        name: 'Medanta Super Specialty Hospital Indore',
        type: 'private',
        registration_number: 'PVT-IND-025',
        description: '500-bed world-class super-specialty hospital with heart institute, cancer center, organ transplant, and 24/7 air-ambulance readiness.',
        has_emergency: true,
        emergency_contact: '0731-4747000',
        phone: '0731-4747000',
        email: 'indore@medanta.org',
        opening_hours: '24 Hours',
        address: 'Plot No. 8, PU-4, Scheme 54, Vijay Nagar',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '452010',
        latitude: 22.7530,
        longitude: 75.8920,
        rating: 4.8,
        total_reviews: 1650,
        is_verified: true
      },
      {
        name: 'Maharaja Yeshwantrao (MY) Hospital',
        type: 'government',
        registration_number: 'GOV-IND-026',
        description: 'Largest government tertiary referral hospital in central India with 1200+ beds, level-1 trauma center, and advanced surgical specialties.',
        has_emergency: true,
        emergency_contact: '0731-2527383',
        phone: '0731-2527383',
        email: 'myhospital@mgmmedicalcollege.in',
        opening_hours: '24 Hours',
        address: 'MY Hospital Road, Sanyogitaganj',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '452001',
        latitude: 22.7160,
        longitude: 75.8740,
        rating: 4.3,
        total_reviews: 1420,
        is_verified: true
      }
    ];

    const savedHospitals = [];
    for (const h of regionalHospitals) {
      let [hosp] = await Hospital.findOrCreate({
        where: { registration_number: h.registration_number },
        defaults: h
      });
      await hosp.update({
        latitude: h.latitude,
        longitude: h.longitude,
        city: h.city,
        state: h.state
      });
      savedHospitals.push(hosp);
    }

    // 2. Regional Doctors within 200 km
    console.log('Seeding 200km Regional Doctors...');
    const regionalDoctors = [
      {
        name: 'Dr. Saurabh Shrivastava',
        email: 'dr.saurabh.shrivastava@jeevanseva.org',
        phone: '9826112233',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.3050,
        longitude: 77.4280,
        qualification: 'MBBS, MD, DM (Cardiology)',
        specialization: 'Cardiology',
        experience_years: 15,
        consultation_fee: 500,
        bio: 'Senior cardiologist at People’s Medical College. Expert in adult cardiology, heart rhythm disorders, and angiography.',
        languages_spoken: 'Hindi, English',
        rating: 4.8,
        total_reviews: 195,
        hospitalIndex: 0
      },
      {
        name: 'Dr. Neha Agnihotri',
        email: 'dr.neha.agnihotri@jeevanseva.org',
        phone: '9826123344',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.1610,
        longitude: 77.4720,
        qualification: 'MBBS, DNB (Pediatrics)',
        specialization: 'Pediatrics',
        experience_years: 11,
        consultation_fee: 350,
        bio: 'Pediatric intensivist and neonatologist at Miracles Children Hospital. Expert in infant nutrition, childhood asthma, and vaccinations.',
        languages_spoken: 'Hindi, English',
        rating: 4.9,
        total_reviews: 230,
        hospitalIndex: 3
      },
      {
        name: 'Dr. Pankaj Rathore',
        email: 'dr.pankaj.rathore@jeevanseva.org',
        phone: '9826134455',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.2720,
        longitude: 77.3820,
        qualification: 'MBBS, MS, MCh (Surgical Oncology)',
        specialization: 'Oncology',
        experience_years: 17,
        consultation_fee: 700,
        bio: 'Leading cancer surgeon at Jawaharlal Nehru Cancer Hospital. Specialized in breast cancer, head & neck tumors, and robotic cancer surgery.',
        languages_spoken: 'Hindi, English',
        rating: 4.9,
        total_reviews: 310,
        hospitalIndex: 2
      },
      {
        name: 'Dr. Arvind Meena',
        email: 'dr.arvind.meena@jeevanseva.org',
        phone: '9826145566',
        city: 'Sehore',
        state: 'Madhya Pradesh',
        latitude: 23.2010,
        longitude: 77.0850,
        qualification: 'MBBS, MD (General Medicine)',
        specialization: 'General Medicine',
        experience_years: 13,
        consultation_fee: 200,
        bio: 'Chief medical consultant at District Hospital Sehore. Treats chronic hypertension, diabetes mellitus, viral fevers, and dengue.',
        languages_spoken: 'Hindi, English',
        rating: 4.7,
        total_reviews: 140,
        hospitalIndex: 4
      },
      {
        name: 'Dr. Manish Malviya',
        email: 'dr.manish.malviya@jeevanseva.org',
        phone: '9826156677',
        city: 'Sehore',
        state: 'Madhya Pradesh',
        latitude: 23.2050,
        longitude: 77.0780,
        qualification: 'MBBS, MS (Orthopedics)',
        specialization: 'Orthopedics',
        experience_years: 12,
        consultation_fee: 350,
        bio: 'Orthopedic specialist at Crescent Hospital Sehore. Skilled in fracture fixation, knee arthroscopy, and arthritis management.',
        languages_spoken: 'Hindi, English',
        rating: 4.8,
        total_reviews: 165,
        hospitalIndex: 5
      },
      {
        name: 'Dr. Priyanka Baghel',
        email: 'dr.priyanka.baghel@jeevanseva.org',
        phone: '9826167788',
        city: 'Raisen',
        state: 'Madhya Pradesh',
        latitude: 23.3320,
        longitude: 77.7810,
        qualification: 'MBBS, MS (Obstetrics & Gynecology)',
        specialization: 'Gynecology',
        experience_years: 10,
        consultation_fee: 250,
        bio: 'Women health specialist at District Hospital Raisen. Focuses on safe institutional delivery, antenatal care, and anemia management.',
        languages_spoken: 'Hindi, English',
        rating: 4.8,
        total_reviews: 125,
        hospitalIndex: 6
      },
      {
        name: 'Dr. Harishankar Vyas',
        email: 'dr.harishankar.vyas@jeevanseva.org',
        phone: '9826178899',
        city: 'Vidisha',
        state: 'Madhya Pradesh',
        latitude: 23.5350,
        longitude: 77.8180,
        qualification: 'MBBS, MD (Medicine), DM (Neurology)',
        specialization: 'Neurology',
        experience_years: 14,
        consultation_fee: 450,
        bio: 'Neurologist at ABV Govt Medical College Vidisha. Expert in stroke rehabilitation, migraine, neuromuscular disorders, and seizures.',
        languages_spoken: 'Hindi, English',
        rating: 4.9,
        total_reviews: 180,
        hospitalIndex: 8
      },
      {
        name: 'Dr. Sanjay Chourey',
        email: 'dr.sanjay.chourey@jeevanseva.org',
        phone: '9826189900',
        city: 'Narmadapuram',
        state: 'Madhya Pradesh',
        latitude: 22.7510,
        longitude: 77.7280,
        qualification: 'MBBS, MD (Chest & Pulmonology)',
        specialization: 'General Medicine',
        experience_years: 16,
        consultation_fee: 300,
        bio: 'Chest and respiratory specialist at District Hospital Narmadapuram. Expert in asthma, COPD, pneumonia, and sleep apnea.',
        languages_spoken: 'Hindi, English',
        rating: 4.7,
        total_reviews: 155,
        hospitalIndex: 9
      },
      {
        name: 'Dr. Kavita Dubey',
        email: 'dr.kavita.dubey@jeevanseva.org',
        phone: '9826190011',
        city: 'Narmadapuram',
        state: 'Madhya Pradesh',
        latitude: 22.7480,
        longitude: 77.7350,
        qualification: 'MBBS, DCH (Pediatrics)',
        specialization: 'Pediatrics',
        experience_years: 11,
        consultation_fee: 300,
        bio: 'Pediatrician at Narmada Valley Hospital. Specializes in child fever, developmental milestones, and pediatric emergency care.',
        languages_spoken: 'Hindi, English',
        rating: 4.8,
        total_reviews: 140,
        hospitalIndex: 10
      },
      {
        name: 'Dr. Sunil Mahajan',
        email: 'dr.sunil.mahajan@jeevanseva.org',
        phone: '9826201122',
        city: 'Itarsi',
        state: 'Madhya Pradesh',
        latitude: 22.6130,
        longitude: 77.7580,
        qualification: 'MBBS, MS (General Surgery)',
        specialization: 'General Medicine',
        experience_years: 15,
        consultation_fee: 250,
        bio: 'Senior surgeon at SPM Civil Hospital Itarsi. Handles emergency trauma cases, appendicitis, hernia, and acute abdomen care.',
        languages_spoken: 'Hindi, English',
        rating: 4.6,
        total_reviews: 130,
        hospitalIndex: 11
      },
      {
        name: 'Dr. Bhupendra Parmar',
        email: 'dr.bhupendra.parmar@jeevanseva.org',
        phone: '9826212233',
        city: 'Dewas',
        state: 'Madhya Pradesh',
        latitude: 22.9230,
        longitude: 76.0120,
        qualification: 'MBBS, MD (Dermatology)',
        specialization: 'Dermatology',
        experience_years: 12,
        consultation_fee: 350,
        bio: 'Skin and laser specialist at Amaltas Hospital Dewas. Treats allergic rashes, fungal infections, vitiligo, and psoriasis.',
        languages_spoken: 'Hindi, English',
        rating: 4.7,
        total_reviews: 110,
        hospitalIndex: 12
      },
      {
        name: 'Dr. Rajesh Solanki',
        email: 'dr.rajesh.solanki@jeevanseva.org',
        phone: '9826223344',
        city: 'Ujjain',
        state: 'Madhya Pradesh',
        latitude: 23.1580,
        longitude: 75.8310,
        qualification: 'MBBS, MS (Orthopedics)',
        specialization: 'Orthopedics',
        experience_years: 17,
        consultation_fee: 400,
        bio: 'Senior joint replacement and spine surgeon at RD Gardi Medical College Ujjain. Specializes in knee resurfacing and complex fractures.',
        languages_spoken: 'Hindi, English',
        rating: 4.8,
        total_reviews: 260,
        hospitalIndex: 13
      },
      {
        name: 'Dr. Vikramaditya Somani',
        email: 'dr.vikramaditya.somani@jeevanseva.org',
        phone: '9826234455',
        city: 'Indore',
        state: 'Madhya Pradesh',
        latitude: 22.7530,
        longitude: 75.8920,
        qualification: 'MBBS, MD, DM (Cardiology - AIIMS)',
        specialization: 'Cardiology',
        experience_years: 19,
        consultation_fee: 800,
        bio: 'Director of Interventional Cardiology at Medanta Indore. Expert in primary angioplasty, TAVR, and complex heart failure therapy.',
        languages_spoken: 'Hindi, English',
        rating: 4.9,
        total_reviews: 420,
        hospitalIndex: 14
      },
      {
        name: 'Dr. Aarti Jhavar',
        email: 'dr.aarti.jhavar@jeevanseva.org',
        phone: '9826245566',
        city: 'Indore',
        state: 'Madhya Pradesh',
        latitude: 22.7160,
        longitude: 75.8740,
        qualification: 'MBBS, MS (Ophthalmology)',
        specialization: 'Ophthalmology',
        experience_years: 13,
        consultation_fee: 300,
        bio: 'Senior eye surgeon at MY Hospital Indore. Specializes in cataract phaco surgery, retinal disorders, and corneal transplant.',
        languages_spoken: 'Hindi, English',
        rating: 4.8,
        total_reviews: 290,
        hospitalIndex: 15
      }
    ];

    for (const d of regionalDoctors) {
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

        const targetHospital = savedHospitals[d.hospitalIndex];
        if (targetHospital) {
          await DoctorHospital.findOrCreate({
            where: { doctor_id: doctor.id, hospital_id: targetHospital.id },
            defaults: { doctor_id: doctor.id, hospital_id: targetHospital.id, is_primary: true }
          });
        }
      }
    }

    // 3. Regional Pharmacies within 200 km
    console.log('Seeding 200km Regional Pharmacies...');
    const regionalPharmacies = [
      {
        name: 'Apollo Pharmacy 24/7 BHEL Habibganj',
        phone: '0755-2507890',
        email: 'bhel.bhopal@apollopharmacy.org',
        address: 'Sector B, Chetak Bridge Road, Kasturba Hospital Gate',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462024',
        latitude: 23.2260,
        longitude: 77.4690,
        opening_hours: '24 Hours Open',
        is_24_hours: true,
        home_delivery: true,
        is_active: true
      },
      {
        name: 'MedPlus Chemist 24/7 Misrod Hoshangabad Rd',
        phone: '0755-4925678',
        email: 'misrod@medplusindia.com',
        address: 'Opposite Miracles Hospital, Hoshangabad Road',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462047',
        latitude: 23.1620,
        longitude: 77.4730,
        opening_hours: '24 Hours Open',
        is_24_hours: true,
        home_delivery: true,
        is_active: true
      },
      {
        name: 'Jan Aushadhi Kendra Civil Hospital Sehore',
        phone: '07562-224555',
        email: 'janaushadhi.sehore@mp.gov.in',
        address: 'Main Gate, Civil Hospital Campus',
        city: 'Sehore',
        state: 'Madhya Pradesh',
        pincode: '466001',
        latitude: 23.2015,
        longitude: 77.0855,
        opening_hours: '8:00 AM - 9:00 PM',
        is_24_hours: false,
        home_delivery: false,
        is_active: true
      },
      {
        name: 'Crescent 24/7 Medical & Surgical Sehore',
        phone: '07562-251234',
        email: 'crescent.chemist@gmail.com',
        address: 'Ground Floor, Crescent Hospital, Bypass Road',
        city: 'Sehore',
        state: 'Madhya Pradesh',
        pincode: '466001',
        latitude: 23.2052,
        longitude: 77.0785,
        opening_hours: '24 Hours Open',
        is_24_hours: true,
        home_delivery: true,
        is_active: true
      },
      {
        name: 'Sharma Medical Hall 24/7 Raisen',
        phone: '07482-222345',
        email: 'sharma.raisen@gmail.com',
        address: 'Opposite District Hospital, Hospital Square',
        city: 'Raisen',
        state: 'Madhya Pradesh',
        pincode: '464551',
        latitude: 23.3325,
        longitude: 77.7815,
        opening_hours: '24 Hours Open',
        is_24_hours: true,
        home_delivery: true,
        is_active: true
      },
      {
        name: 'Jan Aushadhi Kendra ABV Govt Medical College Vidisha',
        phone: '07592-251222',
        email: 'janaushadhi.vidisha@mp.gov.in',
        address: 'OPD Complex, Medical College Campus, Bhopal Road',
        city: 'Vidisha',
        state: 'Madhya Pradesh',
        pincode: '464001',
        latitude: 23.5355,
        longitude: 77.8185,
        opening_hours: '8:00 AM - 8:00 PM',
        is_24_hours: false,
        home_delivery: false,
        is_active: true
      },
      {
        name: 'LifeCare Chemist 24/7 Narmadapuram',
        phone: '07574-252555',
        email: 'lifecare.hoshangabad@gmail.com',
        address: 'Near District Hospital, Kothi Bazaar',
        city: 'Narmadapuram',
        state: 'Madhya Pradesh',
        pincode: '461001',
        latitude: 22.7515,
        longitude: 77.7285,
        opening_hours: '24 Hours Open',
        is_24_hours: true,
        home_delivery: true,
        is_active: true
      },
      {
        name: 'Gupta Medical Stores 24/7 Itarsi',
        phone: '07572-232999',
        email: 'guptamedical.itarsi@gmail.com',
        address: 'Station Road, Near Railway Over Bridge',
        city: 'Itarsi',
        state: 'Madhya Pradesh',
        pincode: '461111',
        latitude: 22.6135,
        longitude: 77.7585,
        opening_hours: '24 Hours Open',
        is_24_hours: true,
        home_delivery: true,
        is_active: true
      },
      {
        name: 'Apollo Pharmacy 24/7 Vijay Nagar Indore',
        phone: '0731-4045566',
        email: 'vijaynagar.indore@apollopharmacy.org',
        address: 'Scheme No. 54, Vijay Nagar Square, Near Medanta',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '452010',
        latitude: 22.7540,
        longitude: 75.8930,
        opening_hours: '24 Hours Open',
        is_24_hours: true,
        home_delivery: true,
        is_active: true
      },
      {
        name: 'Dawa Bazar 24/7 Central Chemist Indore',
        phone: '0731-2511222',
        email: 'dawabazar.indore@gmail.com',
        address: 'Shop 101, Central Dawa Bazar, RNT Marg',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '452001',
        latitude: 22.7180,
        longitude: 75.8760,
        opening_hours: '24 Hours Open',
        is_24_hours: true,
        home_delivery: true,
        is_active: true
      }
    ];

    for (const p of regionalPharmacies) {
      let [pharm] = await Pharmacy.findOrCreate({
        where: { name: p.name },
        defaults: p
      });
      await pharm.update({
        latitude: p.latitude,
        longitude: p.longitude,
        city: p.city,
        state: p.state
      });
    }

    // 4. Essential Medicine Catalog Expansion
    console.log('Seeding Expanded Medicine Catalog...');
    const additionalMedicines = [
      {
        name: 'Sorbitrate 5mg (Isosorbide Dinitrate)',
        generic_name: 'Isosorbide Dinitrate 5mg',
        name_hindi: 'सॉरबिट्रेट (हार्ट अटैक इमरजेंसी दवा)',
        category: 'Cardiovascular Emergency',
        drug_class: 'Vasodilator / Nitrate',
        prescription_required: true,
        uses: 'Used under the tongue (sublingual) for rapid relief of acute chest pain (angina pectoris) and suspected heart attack symptoms before reaching hospital.',
        precautions: 'CRITICAL EMERGENCY: Place tablet under tongue. Do not swallow whole. Do not take with Sildenafil/Viagra as it causes life-threatening drop in blood pressure.',
        side_effects: 'Throbbing headache, sudden low blood pressure, dizziness, facial flushing.',
        manufacturer: 'Abbott Healthcare'
      },
      {
        name: 'Clopidogrel 75mg (Plavix / Deplatt)',
        generic_name: 'Clopidogrel Bisulfate 75mg',
        name_hindi: 'क्लोपिडोग्रेल (खून पतला करने की दवा)',
        category: 'Antiplatelet Blood Thinner',
        drug_class: 'P2Y12 Platelet Inhibitor',
        prescription_required: true,
        uses: 'Prevents blood clots from forming inside stents and arteries after heart attack, stroke, or bypass surgery.',
        precautions: 'Do not discontinue without consulting cardiologist. Report unusual bruising, bleeding gums, or dark stool immediately.',
        side_effects: 'Prolonged bleeding time, bruising, gastrointestinal discomfort.',
        manufacturer: 'Torrent Pharmaceuticals'
      },
      {
        name: 'Atorvastatin 20mg (Atorva / Lipitor)',
        generic_name: 'Atorvastatin Calcium 20mg',
        name_hindi: 'एटोरवास्टेटिन (कोलेस्ट्रॉल कम करने की दवा)',
        category: 'Cardiovascular Statin',
        drug_class: 'HMG-CoA Reductase Inhibitor',
        prescription_required: true,
        uses: 'Lowers LDL bad cholesterol and triglycerides in blood to prevent artery plaque buildup and reduce risk of heart attack.',
        precautions: 'Usually taken at bedtime. Periodic liver function tests (LFT) recommended. Avoid heavy consumption of alcohol.',
        side_effects: 'Mild muscle ache, joint pain, mild digestive upset.',
        manufacturer: 'Zydus Cadila'
      },
      {
        name: 'Augmentin 625 Duo (Amoxicillin & Clavulanate)',
        generic_name: 'Amoxicillin 500mg + Clavulanic Acid 125mg',
        name_hindi: 'ऑगमेंटिन (ब्रॉड-स्पेक्ट्रम एंटीबायोटिक)',
        category: 'Antibiotics',
        drug_class: 'Penicillin with Beta-Lactamase Inhibitor',
        prescription_required: true,
        uses: 'Broad-spectrum antibiotic for bacterial chest infections, bronchitis, severe sinusitis, dental abscesses, and urinary tract infections.',
        precautions: 'Complete the full prescribed 5 to 7 day course even if feeling better. Take with meals to reduce stomach irritation.',
        side_effects: 'Mild loose motions, nausea, skin rash (if allergic to penicillin).',
        manufacturer: 'GSK (GlaxoSmithKline)'
      },
      {
        name: 'Cefixime 200mg (Zifi / Taxim-O)',
        generic_name: 'Cefixime Trihydrate 200mg',
        name_hindi: 'सेफिक्सिम (टाइफाइड व यूरिन इन्फेक्शन एंटीबायोटिक)',
        category: 'Antibiotics',
        drug_class: 'Third-Generation Cephalosporin',
        prescription_required: true,
        uses: 'Effective against typhoid fever, acute ear infections, pneumonia, and bacterial urinary infections.',
        precautions: 'PRESCRIPTION ONLY. Inform physician if you have kidney disease or allergy to cephalosporin antibiotics.',
        side_effects: 'Diarrhea, stomach cramping, indigestion.',
        manufacturer: 'FDC Ltd'
      },
      {
        name: 'Pantoprazole 40mg (Pan-40 / Pantocid)',
        generic_name: 'Pantoprazole Sodium 40mg',
        name_hindi: 'पैंटोप्रजोल (एसिडिटी व सीने में जलन की दवा)',
        category: 'Gastroenterology',
        drug_class: 'Proton Pump Inhibitor (PPI)',
        prescription_required: false,
        uses: 'Treats severe acidity, gastroesophageal reflux disease (GERD), stomach burning, and protects stomach from ulceration caused by pain relievers.',
        precautions: 'Best taken 30 minutes before morning breakfast with a full glass of water.',
        side_effects: 'Mild headache, dry mouth, mild abdominal fullness.',
        manufacturer: 'Alkem Laboratories'
      },
      {
        name: 'Combiflam (Ibuprofen + Paracetamol)',
        generic_name: 'Ibuprofen 400mg + Paracetamol 325mg',
        name_hindi: 'कॉम्बीफ्लेम (दर्द व सूजन निवारक गोली)',
        category: 'Pain Relief & Anti-inflammatory',
        drug_class: 'NSAID Combination',
        prescription_required: false,
        uses: 'Rapid relief for body ache, severe toothache, headache, joint pain, menstrual cramps, and high fever.',
        precautions: 'Always take after food. Do NOT take on empty stomach or if you have stomach ulcers, kidney impairment, or liver disease.',
        side_effects: 'Acidity, heartburn, nausea.',
        manufacturer: 'Sanofi India'
      },
      {
        name: 'Levocetirizine 5mg (Levocet / 1-AL)',
        generic_name: 'Levocetirizine Dihydrochloride 5mg',
        name_hindi: 'लेवोसेटिरिज़िन (एलर्जी व छींक की गोली)',
        category: 'Antihistamine / Allergy',
        drug_class: 'Second-Generation Antihistamine',
        prescription_required: false,
        uses: 'Relieves allergy symptoms such as continuous sneezing, runny nose, allergic rhinitis, watery itchy eyes, and skin hives.',
        precautions: 'May cause mild drowsiness in some individuals. Avoid driving or operating heavy machinery after consumption.',
        side_effects: 'Mild drowsiness, dry mouth, tiredness.',
        manufacturer: 'Cipla Ltd'
      },
      {
        name: 'Glycomet-GP 1 (Glimepiride 1mg + Metformin 500mg PR)',
        generic_name: 'Glimepiride 1mg + Metformin Hydrochloride 500mg',
        name_hindi: 'ग्लाइकोमेट जीपी (शुगर / डायबिटीज कंट्रोल गोली)',
        category: 'Anti-Diabetic',
        drug_class: 'Sulfonylurea + Biguanide Combination',
        prescription_required: true,
        uses: 'Comprehensive blood sugar control for adult patients with Type 2 Diabetes Mellitus.',
        precautions: 'Take with breakfast or main meal. Never skip meals to avoid low blood sugar (hypoglycemia). Keep candy/sugar handy.',
        side_effects: 'Risk of hypoglycemia, metallic taste, nausea.',
        manufacturer: 'USV Pvt Ltd'
      },
      {
        name: 'Amlodipine 5mg (Amlong / Stamlo)',
        generic_name: 'Amlodipine Besylate 5mg',
        name_hindi: 'एम्लोडिपिन (ब्लड प्रेशर की दवा)',
        category: 'Cardiovascular Antihypertensive',
        drug_class: 'Calcium Channel Blocker',
        prescription_required: true,
        uses: 'Lowers high blood pressure and improves blood flow to the heart muscle, preventing strokes and kidney damage.',
        precautions: 'Take once daily at the same time. Do not stop abruptly as it can cause sudden spike in blood pressure.',
        side_effects: 'Mild ankle or foot swelling (edema), flushing, dizziness.',
        manufacturer: 'Micro Labs'
      },
      {
        name: 'Budecort Inhaler 200mcg (Budesonide)',
        generic_name: 'Budesonide 200mcg CFC-free Inhaler',
        name_hindi: 'ब्यूडेकोर्ट इनहेलर (अस्थमा व सांस फूलने का इनहेलर)',
        category: 'Respiratory / Asthma',
        drug_class: 'Inhaled Corticosteroid',
        prescription_required: true,
        uses: 'Maintenance controller therapy for bronchial asthma and chronic obstructive pulmonary disease (COPD) to prevent breathing attacks.',
        precautions: 'Rinse mouth with water and spit it out after every inhalation to prevent fungal oral thrush.',
        side_effects: 'Hoarseness of voice, throat irritation.',
        manufacturer: 'Cipla Ltd'
      },
      {
        name: 'Asthalin 100mcg Inhaler (Salbutamol Rescue Inhaler)',
        generic_name: 'Salbutamol / Albuterol 100mcg',
        name_hindi: 'अस्थालिन इनहेलर (आपातकालीन सांस खोलने वाला इनहेलर)',
        category: 'Respiratory Emergency Rescue',
        drug_class: 'Short-Acting Beta-2 Agonist (SABA)',
        prescription_required: true,
        uses: 'Fast-acting emergency rescue bronchodilator for sudden asthma attacks, wheezing, and acute shortness of breath.',
        precautions: 'Keep this emergency inhaler easily accessible at all times. If breathing does not improve within 10 minutes, seek emergency room immediately.',
        side_effects: 'Tremor in hands, rapid heart palpitations, temporary nervousness.',
        manufacturer: 'Cipla Ltd'
      },
      {
        name: 'Calpol 250 Pead Oral Suspension (Paracetamol for Children)',
        generic_name: 'Paracetamol Paediatric Suspension 250mg/5ml',
        name_hindi: 'कालपोल 250 (बच्चों के बुखार व दर्द की सिरप)',
        category: 'Pediatric Care',
        drug_class: 'Antipyretic / Analgesic Syrup',
        prescription_required: false,
        uses: 'Reduces high fever, post-immunization temperature, teething pain, and viral illness symptoms in toddlers and young children.',
        precautions: 'Use calibrated measuring syringe or spoon. Dose strictly based on child body weight, not age alone. Never exceed 4 doses in 24 hours.',
        side_effects: 'None when given in accurate weight-based dosages.',
        manufacturer: 'GSK Consumer'
      },
      {
        name: 'Electral Powder WHO Formula (Electrolyte Replenisher)',
        generic_name: 'Oral Electrolyte Replacement Powder (WHO ORS Formula)',
        name_hindi: 'इलेक्ट्रल पाउडर (निर्जलीकरण व डिहाइड्रेशन सुरक्षा)',
        category: 'Rehydration Electrolytes',
        drug_class: 'Oral Rehydration Solution',
        prescription_required: false,
        uses: 'Treats and prevents severe dehydration, sunstroke, summer fatigue, and electrolyte loss caused by loose motions and vomiting.',
        precautions: 'Dissolve entire packet in 1000 ml (1 liter) of clean water. Do not boil or heat the prepared solution. Discard leftover solution after 24 hours.',
        side_effects: 'Safe for all age groups including infants and elderly.',
        manufacturer: 'FDC Limited'
      }
    ];

    for (const m of additionalMedicines) {
      await Medicine.findOrCreate({
        where: { name: m.name },
        defaults: m
      });
    }

    // 5. Regional Emergency Services & Helplines
    console.log('Seeding Regional Emergency Services...');
    const regionalEmergencyServices = [
      {
        name: 'MP 108 Emergency Ambulance (Central Command)',
        phone: '108',
        type: 'Ambulance Dispatch',
        description: '24/7 free government emergency ambulance service with GPS-tracked Basic Life Support (BLS) and Advanced Life Support (ALS) vehicles across all districts of Madhya Pradesh.',
        coverage_area: 'Madhya Pradesh Statewide (Bhopal, Sehore, Vidisha, Raisen, Hoshangabad, Dewas, Ujjain, Indore)',
        is_active: true
      },
      {
        name: '104 MP State Medical Advisory Helpline',
        phone: '104',
        type: 'Medical Tele-Triage',
        description: 'Round-the-clock government helpline providing qualified physician guidance, emergency first-aid triage, mental health counseling, and hospital bed availability.',
        coverage_area: 'All Districts of Madhya Pradesh',
        is_active: true
      },
      {
        name: 'AIIMS Bhopal 24/7 Advanced Trauma & Stroke Hotline',
        phone: '0755-2982607',
        type: 'Trauma & Stroke Care',
        description: 'Immediate golden-hour response for polytrauma accidents, acute stroke thrombolysis, and emergency cardiac cath lab activation.',
        coverage_area: 'Bhopal & Surrounding 100 km Radius',
        is_active: true
      },
      {
        name: 'Bhopal Red Cross 24/7 Blood Bank & Plasma Centre',
        phone: '0755-2550106',
        type: 'Blood Bank',
        description: 'Round-the-clock voluntary blood bank providing tested packed red cells, platelets, fresh frozen plasma, and rare blood group matching.',
        coverage_area: 'Bhopal & Central MP Region',
        is_active: true
      },
      {
        name: 'NH-46 Highway Emergency Ambulance Patrol',
        phone: '1033',
        type: 'Highway Accident Response',
        description: 'National Highways Authority of India (NHAI) rapid response ambulance and hydraulic rescue team for highway emergencies between Bhopal, Sehore, Dewas, and Indore.',
        coverage_area: 'NH-46 & Bhopal-Indore Highway Corridor',
        is_active: true
      },
      {
        name: 'Medanta Indore 24/7 Critical Air & Ground Ambulance',
        phone: '0731-4747108',
        type: 'Critical Care Transport',
        description: 'Specialized mobile ICU ambulance with portable ventilator, defibrillator, intra-aortic balloon pump, and critical care doctor on board.',
        coverage_area: 'Indore, Ujjain, Dewas, Bhopal Corridor (200 km)',
        is_active: true
      }
    ];

    for (const es of regionalEmergencyServices) {
      await EmergencyService.findOrCreate({
        where: { name: es.name },
        defaults: es
      });
    }

    console.log('✅ 200km regional healthcare network successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding 200km regional data:', error);
    process.exit(1);
  }
}

seedRegional200km();
