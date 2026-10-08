const {
  User, Patient, Doctor, Hospital, HospitalDepartment,
  DoctorSpecialization, DoctorHospital, Disease, Symptom,
  DiseaseSymptom, Medicine, DiseaseMedicine, Pharmacy,
  EmergencyService, sequelize
} = require('../models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected for seeding...');

    // Hash common password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Seed Hospitals
    console.log('Seeding Hospitals...');
    const hospitalData = [
      {
        name: 'AIIMS - All India Institute of Medical Sciences',
        type: 'government',
        registration_number: 'AIIMS-DEL-001',
        description: 'Premier medical institute offering tertiary and multi-specialty care with state-of-the-art trauma centre.',
        has_emergency: true,
        emergency_contact: '011-26588700',
        phone: '011-26588500',
        email: 'info@aiims.edu',
        opening_hours: '24 Hours',
        address: 'Sri Aurobindo Marg, Ansari Nagar',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110029',
        latitude: 28.5672,
        longitude: 77.2100,
        rating: 4.8,
        total_reviews: 1420,
        is_verified: true
      },
      {
        name: 'Safdarjung Hospital',
        type: 'government',
        registration_number: 'GOV-SJD-002',
        description: 'One of the largest central government multi-specialty hospitals with a dedicated burns and emergency unit.',
        has_emergency: true,
        emergency_contact: '011-26165060',
        phone: '011-26165060',
        email: 'contact@safdarjung.gov.in',
        opening_hours: '24 Hours',
        address: 'Ring Road, Opposite AIIMS',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110029',
        latitude: 28.5700,
        longitude: 77.2080,
        rating: 4.2,
        total_reviews: 890,
        is_verified: true
      },
      {
        name: 'Apollo Multi-Speciality Hospital',
        type: 'private',
        registration_number: 'PVT-APL-003',
        description: 'World-class healthcare facility offering advanced cardiac, oncology, neurology, and robotic surgery treatments.',
        has_emergency: true,
        emergency_contact: '1066',
        phone: '011-26925858',
        email: 'assistance@apollohospitals.com',
        opening_hours: '24 Hours',
        address: 'Sarita Vihar, Delhi Mathura Road',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110076',
        latitude: 28.5360,
        longitude: 77.2910,
        rating: 4.6,
        total_reviews: 1150,
        is_verified: true
      },
      {
        name: 'District Primary Health Centre (PHC) - Najafgarh',
        type: 'phc',
        registration_number: 'PHC-DL-004',
        description: 'Community government health post providing maternal, immunization, malaria testing, and primary outpatient care.',
        has_emergency: false,
        emergency_contact: '011-28012345',
        phone: '011-28012345',
        email: 'phc.najafgarh@delhihealth.gov.in',
        opening_hours: '8:00 AM - 4:00 PM',
        address: 'Main Najafgarh Road, Rural Block',
        city: 'Najafgarh',
        state: 'Delhi',
        pincode: '110043',
        latitude: 28.6120,
        longitude: 76.9850,
        rating: 4.0,
        total_reviews: 140,
        is_verified: true
      },
      {
        name: 'Community Health Centre (CHC) - Kanjhawala',
        type: 'chc',
        registration_number: 'CHC-DL-005',
        description: 'Secondary care rural hospital with 30 beds, 24/7 labor room, emergency stabilization and basic surgical units.',
        has_emergency: true,
        emergency_contact: '011-25951234',
        phone: '011-25951234',
        email: 'chc.kanjhawala@delhihealth.gov.in',
        opening_hours: '24 Hours',
        address: 'Rural District Block, Kanjhawala',
        city: 'North West Delhi',
        state: 'Delhi',
        pincode: '110081',
        latitude: 28.7250,
        longitude: 77.0120,
        rating: 4.1,
        total_reviews: 210,
        is_verified: true
      },
      {
        name: 'KEM Hospital & Seth GS Medical College',
        type: 'government',
        registration_number: 'KEM-MUM-006',
        description: 'Leading civic tertiary hospital with 1800+ beds, advanced intensive care, pediatrics, and trauma surgery.',
        has_emergency: true,
        emergency_contact: '022-24107000',
        phone: '022-24107000',
        email: 'info@kem.edu',
        opening_hours: '24 Hours',
        address: 'Acharya Donde Marg, Parel',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400012',
        latitude: 19.0020,
        longitude: 72.8420,
        rating: 4.5,
        total_reviews: 1650,
        is_verified: true
      },
      {
        name: 'Lilavati Hospital & Research Centre',
        type: 'private',
        registration_number: 'PVT-LLV-007',
        description: 'Premier multi-specialty institution providing cardiac, cancer, joint replacement, and round-the-clock emergency services.',
        has_emergency: true,
        emergency_contact: '022-26751000',
        phone: '022-26751000',
        email: 'info@lilavatihospital.com',
        opening_hours: '24 Hours',
        address: 'A-791, Bandra Reclamation, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        latitude: 19.0520,
        longitude: 72.8310,
        rating: 4.7,
        total_reviews: 980,
        is_verified: true
      },
      {
        name: 'Sanjay Gandhi Postgraduate Institute (SGPGIMS)',
        type: 'government',
        registration_number: 'SGPGI-LKO-008',
        description: 'Super-specialty medical institute delivering cardiology, nephrology, gastroenterology, and emergency trauma care.',
        has_emergency: true,
        emergency_contact: '0522-2668700',
        phone: '0522-2668004',
        email: 'contact@sgpgi.ac.in',
        opening_hours: '24 Hours',
        address: 'Raebareli Road',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        pincode: '226014',
        latitude: 26.7480,
        longitude: 80.9380,
        rating: 4.6,
        total_reviews: 730,
        is_verified: true
      }
    ];

    const createdHospitals = [];
    for (const h of hospitalData) {
      let [hosp] = await Hospital.findOrCreate({
        where: { registration_number: h.registration_number },
        defaults: h
      });
      createdHospitals.push(hosp);

      // Add departments
      const depts = ['General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Emergency & Trauma'];
      for (const d of depts) {
        await HospitalDepartment.findOrCreate({
          where: { hospital_id: hosp.id, name: d },
          defaults: { hospital_id: hosp.id, name: d, is_active: true }
        });
      }
    }

    // 2. Seed Doctors
    console.log('Seeding Doctors...');
    const doctorsData = [
      {
        name: 'Dr. Rajesh Sharma',
        email: 'dr.rajesh@jeevanseva.org',
        phone: '9811223344',
        city: 'New Delhi',
        state: 'Delhi',
        qualification: 'MBBS, MD (General Medicine)',
        specialization: 'General Medicine',
        experience_years: 15,
        consultation_fee: 500,
        bio: 'Senior consultant specializing in fever, hypertension, diabetes control, and infectious diseases in rural and urban clinics.',
        languages_spoken: 'Hindi, English, Punjabi',
        rating: 4.8,
        total_reviews: 215,
        hospitalIndex: 0
      },
      {
        name: 'Dr. Sunita Verma',
        email: 'dr.sunita@jeevanseva.org',
        phone: '9822334455',
        city: 'New Delhi',
        state: 'Delhi',
        qualification: 'MBBS, DCH, MD (Pediatrics)',
        specialization: 'Pediatrics',
        experience_years: 12,
        consultation_fee: 400,
        bio: 'Dedicated child specialist experienced in newborn care, vaccinations, childhood asthma, and pediatric nutrition.',
        languages_spoken: 'Hindi, English',
        rating: 4.9,
        total_reviews: 180,
        hospitalIndex: 1
      },
      {
        name: 'Dr. Amitav Mukherjee',
        email: 'dr.amitav@jeevanseva.org',
        phone: '9833445566',
        city: 'New Delhi',
        state: 'Delhi',
        qualification: 'MBBS, MD, DM (Cardiology)',
        specialization: 'Cardiology',
        experience_years: 18,
        consultation_fee: 900,
        bio: 'Interventional cardiologist handling heart conditions, ECG analysis, hypertension, and post-angioplasty recovery.',
        languages_spoken: 'Hindi, English, Bengali',
        rating: 4.9,
        total_reviews: 310,
        hospitalIndex: 2
      },
      {
        name: 'Dr. Priya Deshmukh',
        email: 'dr.priya@jeevanseva.org',
        phone: '9844556677',
        city: 'Mumbai',
        state: 'Maharashtra',
        qualification: 'MBBS, MS (Obstetrics & Gynecology)',
        specialization: 'Gynecology',
        experience_years: 14,
        consultation_fee: 600,
        bio: 'Compassionate women healthcare expert providing maternal care, prenatal checkups, PCOS guidance, and safe delivery support.',
        languages_spoken: 'Marathi, Hindi, English',
        rating: 4.8,
        total_reviews: 195,
        hospitalIndex: 5
      },
      {
        name: 'Dr. Vikram Rathore',
        email: 'dr.vikram@jeevanseva.org',
        phone: '9855667788',
        city: 'Mumbai',
        state: 'Maharashtra',
        qualification: 'MBBS, MS (Orthopedics)',
        specialization: 'Orthopedics',
        experience_years: 11,
        consultation_fee: 550,
        bio: 'Bone and joint specialist focusing on fracture treatment, arthritis pain management, knee rehabilitation, and back pain.',
        languages_spoken: 'Hindi, English, Gujarati',
        rating: 4.7,
        total_reviews: 140,
        hospitalIndex: 6
      },
      {
        name: 'Dr. Ananya Srivastava',
        email: 'dr.ananya@jeevanseva.org',
        phone: '9866778899',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        qualification: 'MBBS, MD (Dermatology)',
        specialization: 'Dermatology',
        experience_years: 9,
        consultation_fee: 450,
        bio: 'Skin and hair specialist addressing eczema, fungal infections, allergic rashes, psoriasis, and acne management.',
        languages_spoken: 'Hindi, English',
        rating: 4.7,
        total_reviews: 110,
        hospitalIndex: 7
      },
      {
        name: 'Dr. Manoj Patel',
        email: 'dr.manoj@jeevanseva.org',
        phone: '9877889900',
        city: 'Najafgarh',
        state: 'Delhi',
        qualification: 'MBBS (Rural Health Physician)',
        specialization: 'General Medicine',
        experience_years: 8,
        consultation_fee: 200,
        bio: 'Community and primary health doctor offering low-cost healthcare consultations for seasonal infections, fever, and digestive issues.',
        languages_spoken: 'Hindi, Haryanvi, English',
        rating: 4.6,
        total_reviews: 95,
        hospitalIndex: 3
      }
    ];

    for (const d of doctorsData) {
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
          is_verified: true,
          is_active: true
        });
      }

      let doctor = await Doctor.findOne({ where: { user_id: user.id } });
      if (!doctor) {
        doctor = await Doctor.create({
          user_id: user.id,
          registration_number: `MCI-${Math.floor(10000 + Math.random() * 90000)}`,
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

        const targetHospital = createdHospitals[d.hospitalIndex];
        if (targetHospital) {
          await DoctorHospital.findOrCreate({
            where: { doctor_id: doctor.id, hospital_id: targetHospital.id },
            defaults: { doctor_id: doctor.id, hospital_id: targetHospital.id, is_primary: true }
          });
        }
      }
    }

    // 3. Seed Diseases & Symptoms
    console.log('Seeding Diseases & Symptoms...');
    const diseaseData = [
      {
        name: 'Viral Fever / Influenza',
        name_hindi: 'वायरल बुखार / इन्फ्लूएंजा',
        category: 'Infectious Disease',
        severity: 'Moderate',
        specialty: 'General Medicine',
        description: 'A common viral infection of the respiratory system causing elevated body temperature, body aches, and fatigue.',
        description_hindi: 'एक आम वायरल संक्रमण जिसके कारण तेज बुखार, शरीर में दर्द और अत्यधिक थकान होती है।',
        precautions: 'Take adequate rest, drink plenty of warm fluids (water, soups, coconut water), and avoid crowded places.',
        when_to_see_doctor: 'If temperature stays above 102°F (39°C) for more than 3 days, difficulty in breathing occurs, or severe vomiting persists.',
        is_emergency: false,
        symptoms: ['High Fever', 'Body Ache', 'Headache', 'Fatigue', 'Cough', 'Sore Throat']
      },
      {
        name: 'Dengue Fever',
        name_hindi: 'डेंगू बुखार',
        category: 'Vector-borne Disease',
        severity: 'Severe',
        specialty: 'General Medicine',
        description: 'A mosquito-borne tropical viral disease transmitted by Aedes mosquitoes, often characterized by sudden high fever and severe joint pain.',
        description_hindi: 'मच्छर जनित वायरल बीमारी जो अचानक तेज बुखार, जोड़ों में तेज दर्द और प्लेटलेट्स की कमी का कारण बनती है।',
        precautions: 'Use mosquito repellents, ensure no standing water near homes, stay well hydrated.',
        when_to_see_doctor: 'Immediately seek medical attention if severe abdominal pain, persistent vomiting, bleeding from gums/nose, or extreme weakness occurs.',
        is_emergency: true,
        symptoms: ['High Fever', 'Severe Joint Pain', 'Behind Eye Pain', 'Skin Rash', 'Nausea']
      },
      {
        name: 'Type 2 Diabetes Mellitus',
        name_hindi: 'मधुमेह / शुगर की बीमारी',
        category: 'Chronic Metabolic Disorder',
        severity: 'Moderate to High',
        specialty: 'Endocrinology / General Medicine',
        description: 'A chronic metabolic disorder where the body cannot effectively use insulin, leading to elevated blood glucose levels.',
        description_hindi: 'एक दीर्घकालिक चयापचय रोग जिसमें शरीर इंसुलिन का ठीक से उपयोग नहीं कर पाता और रक्त शर्करा बढ़ जाती है।',
        precautions: 'Follow a balanced low-sugar diet, exercise 30 minutes daily, monitor blood sugar levels regularly.',
        when_to_see_doctor: 'If extreme thirst, sudden vision blurriness, non-healing wounds, or sudden confusion/drowsiness occurs.',
        is_emergency: false,
        symptoms: ['Frequent Urination', 'Excessive Thirst', 'Unexplained Weight Loss', 'Blurry Vision', 'Slow Healing Wounds']
      },
      {
        name: 'Acute Hypertension / High Blood Pressure',
        name_hindi: 'उच्च रक्तचाप / हाई ब्लड प्रेशर',
        category: 'Cardiovascular Disease',
        severity: 'Moderate to Severe',
        specialty: 'Cardiology',
        description: 'Long-term condition where the force of the blood against the artery walls is high enough to potentially lead to heart complications.',
        description_hindi: 'एक ऐसी स्थिति जिसमें रक्त वाहिकाओं की दीवारों पर रक्त का दबाव अत्यधिक बढ़ जाता है।',
        precautions: 'Reduce salt intake, manage mental stress, avoid tobacco/smoking, take prescribed medication consistently.',
        when_to_see_doctor: 'CRITICAL: If blood pressure exceeds 180/120 mmHg, or accompanied by chest pain, shortness of breath, or numbness in limbs.',
        is_emergency: true,
        symptoms: ['Chest Pain', 'Shortness of Breath', 'Dizziness', 'Severe Headache', 'Heart Palpitations']
      },
      {
        name: 'Acute Pediatric Asthma & Bronchitis',
        name_hindi: 'बच्चों में दमा / श्वसन संक्रमण',
        category: 'Respiratory Disease',
        severity: 'Moderate to High',
        specialty: 'Pediatrics',
        description: 'Chronic inflammation of the airways making it difficult to breathe, especially triggered by dust, pollen, or cold air.',
        description_hindi: 'श्वास नलियों में सूजन जिससे सांस लेने में कठिनाई, घरघराहट और खांसी होती है।',
        precautions: 'Keep child away from dust, smoke, and cold triggers. Ensure proper use of inhalers if recommended by a pediatrician.',
        when_to_see_doctor: 'EMERGENCY: If child exhibits blue lips/fingers, rapid chest retractions, or struggles to speak a full sentence.',
        is_emergency: true,
        symptoms: ['Wheezing', 'Shortness of Breath', 'Dry Cough', 'Chest Tightness', 'Rapid Breathing']
      }
    ];

    for (const d of diseaseData) {
      let [disease] = await Disease.findOrCreate({
        where: { name: d.name },
        defaults: d
      });

      for (const symName of d.symptoms) {
        let [symptom] = await Symptom.findOrCreate({
          where: { name: symName },
          defaults: { name: symName, severity: 'Medium' }
        });

        await DiseaseSymptom.findOrCreate({
          where: { disease_id: disease.id, symptom_id: symptom.id },
          defaults: { disease_id: disease.id, symptom_id: symptom.id, relevance: 'high' }
        });
      }
    }

    // 4. Seed Medicines
    console.log('Seeding Medicines...');
    const medicinesData = [
      {
        name: 'Paracetamol 650mg (Dolo / Calpol)',
        generic_name: 'Paracetamol / Acetaminophen',
        name_hindi: 'पैरासिटामोल 650mg',
        category: 'Antipyretic & Analgesic',
        drug_class: 'Analgesic',
        prescription_required: false,
        uses: 'Temporary relief of mild to moderate fever and body aches associated with viral infections or headache.',
        precautions: 'Do not exceed 3,000mg within 24 hours. Avoid combining with alcohol or other paracetamol-containing medications.',
        side_effects: 'Rare in standard doses; excessive doses can cause severe liver damage.',
        manufacturer: 'Micro Labs / GSK'
      },
      {
        name: 'Azithromycin 500mg',
        generic_name: 'Azithromycin Dihydrate',
        name_hindi: 'एजिथ्रोमाइसिन 500mg',
        category: 'Antibiotic (Macrolide)',
        drug_class: 'Antibiotic',
        prescription_required: true,
        uses: 'Used under doctor direction for bacterial respiratory tract infections, tonsillitis, and community-acquired pneumonia.',
        precautions: 'PRESCRIPTION ONLY. Always complete the prescribed duration. Do not take for simple viral colds or without medical advice.',
        side_effects: 'Nausea, diarrhea, stomach cramps, temporary dizziness.',
        manufacturer: 'Cipla / Lupin'
      },
      {
        name: 'Metformin 500mg (Glycomet)',
        generic_name: 'Metformin Hydrochloride',
        name_hindi: 'मेटफॉर्मिन 500mg',
        category: 'Antidiabetic (Biguanide)',
        drug_class: 'Oral Hypoglycemic',
        prescription_required: true,
        uses: 'First-line medication to improve glucose tolerance and reduce hepatic glucose production in Type 2 Diabetes.',
        precautions: 'PRESCRIPTION ONLY. Take with meals to minimize gastrointestinal discomfort. Regular kidney function monitoring required.',
        side_effects: 'Nausea, mild abdominal upset, metallic taste in mouth.',
        manufacturer: 'USV / Sun Pharma'
      },
      {
        name: 'Telmisartan 40mg (Telma)',
        generic_name: 'Telmisartan',
        name_hindi: 'टेल्मिसार्टन 40mg',
        category: 'Antihypertensive (ARB)',
        drug_class: 'Angiotensin Receptor Blocker',
        prescription_required: true,
        uses: 'Manages high blood pressure and reduces cardiovascular risks in adult hypertensive patients.',
        precautions: 'PRESCRIPTION ONLY. Must NOT be taken during pregnancy. Monitor potassium levels and blood pressure periodically.',
        side_effects: 'Dizziness, low blood pressure when standing, mild fatigue.',
        manufacturer: 'Glenmark'
      },
      {
        name: 'Oral Rehydration Salts (ORS WHO Formula)',
        generic_name: 'Electrolytes with Dextrose',
        name_hindi: 'ओआरएस (जीवन रक्षक घोल)',
        category: 'Rehydration Electrolytes',
        drug_class: 'Electrolyte Replenisher',
        prescription_required: false,
        uses: 'Restores essential water and electrolytes lost during diarrhea, vomiting, fever, or heat exhaustion.',
        precautions: 'Dissolve one packet in exactly 1 liter of clean drinking water. Use the prepared solution within 24 hours.',
        side_effects: 'None when mixed with the correct proportion of water.',
        manufacturer: 'FDC Ltd'
      }
    ];

    for (const m of medicinesData) {
      await Medicine.findOrCreate({
        where: { name: m.name },
        defaults: m
      });
    }

    // 5. Seed Pharmacies
    console.log('Seeding Pharmacies...');
    const pharmacyData = [
      {
        name: 'Apollo Pharmacy 24/7',
        phone: '011-41001234',
        email: 'delhi.apollo@apollopharmacy.org',
        address: 'Shop 12, Main Ring Road, Near AIIMS Metro Station',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110029',
        latitude: 28.5680,
        longitude: 77.2090,
        opening_hours: '24 Hours Open',
        is_24_hours: true,
        home_delivery: true,
        is_active: true
      },
      {
        name: 'Jan Aushadhi Kendra (Govt Affordable Medicine Store)',
        phone: '011-26514455',
        email: 'janaushadhi.delhi@gov.in',
        address: 'Safdarjung Hospital Complex Gate 2',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110029',
        latitude: 28.5710,
        longitude: 77.2070,
        opening_hours: '8:00 AM - 9:00 PM',
        is_24_hours: false,
        home_delivery: false,
        is_active: true
      },
      {
        name: 'MedPlus Chemist & Druggist',
        phone: '022-24128899',
        email: 'parel@medplusindia.com',
        address: 'Acharya Donde Marg, Opp KEM Hospital',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400012',
        latitude: 19.0030,
        longitude: 72.8430,
        opening_hours: '24 Hours Open',
        is_24_hours: true,
        home_delivery: true,
        is_active: true
      },
      {
        name: 'Kisan Medical Store (Rural PHC Link)',
        phone: '011-28019988',
        email: 'kisan.med@gmail.com',
        address: 'Main Chowk, Najafgarh Village Block',
        city: 'Najafgarh',
        state: 'Delhi',
        pincode: '110043',
        latitude: 28.6130,
        longitude: 76.9860,
        opening_hours: '7:00 AM - 10:00 PM',
        is_24_hours: false,
        home_delivery: true,
        is_active: true
      }
    ];

    for (const p of pharmacyData) {
      await Pharmacy.findOrCreate({
        where: { name: p.name },
        defaults: p
      });
    }

    // 6. Seed Emergency Services
    console.log('Seeding Emergency Services...');
    const emergencyData = [
      { name: '112 National Emergency Helpline', phone: '112', type: 'All Services', description: 'Central pan-India police, medical and fire distress response.', coverage_area: 'Pan India', is_active: true },
      { name: '108 Ambulance Response Service', phone: '108', type: 'Ambulance', description: 'Free emergency ambulance dispatch for critical accidents and medical emergencies.', coverage_area: 'Pan India', is_active: true },
      { name: '102 Janani Shishu Helpline', phone: '102', type: 'Maternal Transport', description: 'Dedicated free transport service for pregnant women and sick neonates.', coverage_area: 'Pan India', is_active: true },
      { name: '1075 National Health Helpline', phone: '1075', type: 'Health Advice', description: 'Ministry of Health national health queries and epidemic helpline.', coverage_area: 'Pan India', is_active: true }
    ];

    for (const em of emergencyData) {
      await EmergencyService.findOrCreate({
        where: { name: em.name },
        defaults: em
      });
    }

    console.log('✅ ALL SEED DATA POPULATED SUCCESSFULLY!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await sequelize.close();
  }
}

seed();
