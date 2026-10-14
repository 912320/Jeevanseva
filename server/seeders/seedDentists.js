const {
  User, Doctor, Hospital, DoctorSpecialization, DoctorHospital, DoctorAvailability, sequelize
} = require('../models');
const bcrypt = require('bcryptjs');

async function seedDentists() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database for seeding Dentistry doctors...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Find local hospitals for affiliation
    const aiims = await Hospital.findOne({ where: { name: { [require('sequelize').Op.like]: '%AIIMS Bhopal%' } } }) || await Hospital.findOne();
    const hamidia = await Hospital.findOne({ where: { name: { [require('sequelize').Op.like]: '%Hamidia%' } } }) || aiims;
    const bansal = await Hospital.findOne({ where: { name: { [require('sequelize').Op.like]: '%Bansal%' } } }) || aiims;
    const sagar = await Hospital.findOne({ where: { name: { [require('sequelize').Op.like]: '%Sagar%' } } }) || aiims;

    const dentistsData = [
      {
        name: 'Dr. Pooja Sharma',
        email: 'dr.pooja.dentist@jeevanseva.org',
        phone: '9826190001',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.2320,
        longitude: 77.4320, // MP Nagar
        qualification: 'BDS, MDS (Conservative Dentistry & Endodontics)',
        specialization: 'Dentistry',
        experience_years: 12,
        consultation_fee: 300,
        bio: 'Senior consultant dental surgeon and root canal specialist in MP Nagar Zone-II. Specializes in painless single-sitting RCT, cosmetic smile designing, and dental implants.',
        languages_spoken: 'Hindi, English',
        rating: 4.9,
        total_reviews: 215,
        hospitalId: bansal ? bansal.id : null
      },
      {
        name: 'Dr. Aman Verma',
        email: 'dr.aman.verma.dentist@jeevanseva.org',
        phone: '9826190002',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.2066,
        longitude: 77.4533, // Saket Nagar / AIIMS area
        qualification: 'BDS, MDS (Oral & Maxillofacial Surgery - AIIMS)',
        specialization: 'Dentistry',
        experience_years: 15,
        consultation_fee: 400,
        bio: 'Associate Professor & Chief Dental Specialist affiliated with AIIMS Bhopal. Expertise in wisdom tooth surgery, dental trauma, jaw correction, and full-mouth rehabilitation.',
        languages_spoken: 'Hindi, English',
        rating: 4.9,
        total_reviews: 320,
        hospitalId: aiims ? aiims.id : null
      },
      {
        name: 'Dr. Sneha Rathore',
        email: 'dr.sneha.rathore.dentist@jeevanseva.org',
        phone: '9826190003',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.2185,
        longitude: 77.4330, // Arera Colony
        qualification: 'BDS, MDS (Pediatric Dentistry & Orthodontics)',
        specialization: 'Dentistry',
        experience_years: 10,
        consultation_fee: 350,
        bio: 'Pediatric dental specialist (Pedodontist) & Orthodontist at Arera Colony. Specializes in child dental cavities, braces, clear aligners, and preventive fluoride treatments.',
        languages_spoken: 'Hindi, English',
        rating: 4.8,
        total_reviews: 180,
        hospitalId: hamidia ? hamidia.id : null
      },
      {
        name: 'Dr. Rohan Saxena',
        email: 'dr.rohan.saxena.dentist@jeevanseva.org',
        phone: '9826190004',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.2650,
        longitude: 77.4720, // Ayodhya Bypass
        qualification: 'BDS, MDS (Periodontics & Implantology)',
        specialization: 'Dentistry',
        experience_years: 11,
        consultation_fee: 250,
        bio: 'Senior Dental Surgeon at Sagar Multi-Specialty Hospital. Expert in laser gum treatment, teeth whitening, scaling, dental bridges, and crown placement.',
        languages_spoken: 'Hindi, English',
        rating: 4.8,
        total_reviews: 165,
        hospitalId: sagar ? sagar.id : null
      },
      {
        name: 'Dr. Ankit Chouhan',
        email: 'dr.ankit.chouhan.dentist@jeevanseva.org',
        phone: '9826190005',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        latitude: 23.2618,
        longitude: 77.3912, // Sultania Road / Old City
        qualification: 'BDS, Fellow in Aesthetic Dentistry',
        specialization: 'Dentistry',
        experience_years: 9,
        consultation_fee: 200,
        bio: 'General dental practitioner with gentle patient care. Affordable dental fillings, dentures, scaling, tooth extraction, and routine dental checkups for families.',
        languages_spoken: 'Hindi, English',
        rating: 4.7,
        total_reviews: 140,
        hospitalId: hamidia ? hamidia.id : null
      }
    ];

    for (const d of dentistsData) {
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
          registration_number: `DCI-MP-${Math.floor(10000 + Math.random() * 90000)}`,
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
      } else {
        await doctor.update({
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
      }

      await DoctorSpecialization.findOrCreate({
        where: { doctor_id: doctor.id, specialization: 'Dentistry' },
        defaults: { doctor_id: doctor.id, specialization: 'Dentistry', is_primary: true }
      });

      if (d.hospitalId) {
        await DoctorHospital.findOrCreate({
          where: { doctor_id: doctor.id, hospital_id: d.hospitalId },
          defaults: { doctor_id: doctor.id, hospital_id: d.hospitalId, is_primary: true }
        });
      }

      // Add availability slots Monday to Saturday
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      for (const day of days) {
        await DoctorAvailability.findOrCreate({
          where: { doctor_id: doctor.id, day_of_week: day },
          defaults: {
            doctor_id: doctor.id,
            day_of_week: day,
            start_time: '10:00:00',
            end_time: '18:00:00',
            break_start: '13:30:00',
            break_end: '14:30:00',
            slot_duration_minutes: 20,
            max_patients_per_slot: 2,
            is_active: true
          }
        });
      }
    }

    console.log(`✅ Successfully seeded ${dentistsData.length} Dentistry doctors!`);
  } catch (error) {
    console.error('Error seeding dentists:', error);
  }
}

seedDentists().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
