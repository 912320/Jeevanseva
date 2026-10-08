module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { DataTypes } = Sequelize;
    
    await queryInterface.createTable('users', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      phone: { type: DataTypes.STRING(15), unique: true, allowNull: true },
      password_hash: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM('patient', 'doctor', 'hospital', 'admin'), defaultValue: 'patient' },
      name: { type: DataTypes.STRING, allowNull: false },
      avatar: { type: DataTypes.STRING, allowNull: true },
      is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      latitude: { type: DataTypes.FLOAT, allowNull: true },
      longitude: { type: DataTypes.FLOAT, allowNull: true },
      address: { type: DataTypes.TEXT, allowNull: true },
      city: { type: DataTypes.STRING, allowNull: true },
      state: { type: DataTypes.STRING, allowNull: true },
      preferred_language: { type: DataTypes.STRING(5), defaultValue: 'en' },
      last_login: { type: DataTypes.DATE, allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('patients', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, unique: true, references: { model: 'users', key: 'id' } },
      date_of_birth: { type: DataTypes.DATEONLY },
      gender: { type: DataTypes.ENUM('male', 'female', 'other') },
      blood_group: { type: DataTypes.STRING(5) },
      medical_history: { type: DataTypes.TEXT },
      emergency_contact: { type: DataTypes.STRING(15) },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('doctors', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, unique: true, references: { model: 'users', key: 'id' } },
      registration_number: { type: DataTypes.STRING, unique: true },
      qualification: { type: DataTypes.STRING },
      experience_years: { type: DataTypes.INTEGER },
      bio: { type: DataTypes.TEXT },
      consultation_fee: { type: DataTypes.DECIMAL(10, 2) },
      languages_spoken: { type: DataTypes.STRING },
      is_available: { type: DataTypes.BOOLEAN, defaultValue: true },
      is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      rating: { type: DataTypes.FLOAT, defaultValue: 0 },
      total_reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('hospitals', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, unique: true, references: { model: 'users', key: 'id' } },
      name: { type: DataTypes.STRING },
      registration_number: { type: DataTypes.STRING, unique: true },
      type: { type: DataTypes.ENUM('government', 'private', 'clinic', 'phc', 'chc') },
      description: { type: DataTypes.TEXT },
      image_url: { type: DataTypes.STRING },
      has_emergency: { type: DataTypes.BOOLEAN },
      emergency_contact: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      website: { type: DataTypes.STRING },
      opening_hours: { type: DataTypes.STRING },
      latitude: { type: DataTypes.FLOAT },
      longitude: { type: DataTypes.FLOAT },
      address: { type: DataTypes.TEXT },
      city: { type: DataTypes.STRING },
      state: { type: DataTypes.STRING },
      pincode: { type: DataTypes.STRING },
      is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      rating: { type: DataTypes.FLOAT, defaultValue: 0 },
      total_reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('hospital_departments', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      hospital_id: { type: DataTypes.INTEGER, references: { model: 'hospitals', key: 'id' } },
      name: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
      head_doctor: { type: DataTypes.STRING },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('doctor_specializations', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      doctor_id: { type: DataTypes.INTEGER, references: { model: 'doctors', key: 'id' } },
      specialization: { type: DataTypes.STRING },
      is_primary: { type: DataTypes.BOOLEAN, defaultValue: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('doctor_hospitals', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      doctor_id: { type: DataTypes.INTEGER, references: { model: 'doctors', key: 'id' } },
      hospital_id: { type: DataTypes.INTEGER, references: { model: 'hospitals', key: 'id' } },
      is_primary: { type: DataTypes.BOOLEAN },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });
    
    await queryInterface.addIndex('doctor_hospitals', ['doctor_id', 'hospital_id'], { unique: true });

    await queryInterface.createTable('doctor_availabilities', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      doctor_id: { type: DataTypes.INTEGER, references: { model: 'doctors', key: 'id' } },
      day_of_week: { type: DataTypes.ENUM('monday','tuesday','wednesday','thursday','friday','saturday','sunday') },
      start_time: { type: DataTypes.TIME },
      end_time: { type: DataTypes.TIME },
      break_start: { type: DataTypes.TIME },
      break_end: { type: DataTypes.TIME },
      slot_duration_minutes: { type: DataTypes.INTEGER, defaultValue: 15 },
      max_patients_per_slot: { type: DataTypes.INTEGER, defaultValue: 1 },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('doctor_time_slots', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      doctor_id: { type: DataTypes.INTEGER, references: { model: 'doctors', key: 'id' } },
      availability_id: { type: DataTypes.INTEGER, references: { model: 'doctor_availabilities', key: 'id' } },
      slot_date: { type: DataTypes.DATEONLY },
      start_time: { type: DataTypes.TIME },
      end_time: { type: DataTypes.TIME },
      max_bookings: { type: DataTypes.INTEGER, defaultValue: 1 },
      current_bookings: { type: DataTypes.INTEGER, defaultValue: 0 },
      status: { type: DataTypes.ENUM('available', 'full', 'blocked'), defaultValue: 'available' },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('appointments', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      patient_id: { type: DataTypes.INTEGER, references: { model: 'patients', key: 'id' } },
      doctor_id: { type: DataTypes.INTEGER, references: { model: 'doctors', key: 'id' } },
      hospital_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'hospitals', key: 'id' } },
      time_slot_id: { type: DataTypes.INTEGER, references: { model: 'doctor_time_slots', key: 'id' } },
      appointment_date: { type: DataTypes.DATEONLY },
      appointment_time: { type: DataTypes.TIME },
      status: { type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show'), defaultValue: 'pending' },
      reason: { type: DataTypes.TEXT },
      notes: { type: DataTypes.TEXT },
      fee: { type: DataTypes.DECIMAL(10, 2) },
      payment_status: { type: DataTypes.ENUM('pending', 'paid', 'refunded'), defaultValue: 'pending' },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('diseases', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, unique: true },
      name_hindi: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
      description_hindi: { type: DataTypes.TEXT },
      category: { type: DataTypes.STRING },
      severity: { type: DataTypes.STRING },
      specialty: { type: DataTypes.STRING },
      precautions: { type: DataTypes.TEXT },
      when_to_see_doctor: { type: DataTypes.TEXT },
      is_emergency: { type: DataTypes.BOOLEAN, defaultValue: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('symptoms', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, unique: true },
      name_hindi: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
      body_part: { type: DataTypes.STRING },
      severity: { type: DataTypes.STRING },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('disease_symptoms', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      disease_id: { type: DataTypes.INTEGER, references: { model: 'diseases', key: 'id' } },
      symptom_id: { type: DataTypes.INTEGER, references: { model: 'symptoms', key: 'id' } },
      relevance: { type: DataTypes.ENUM('high', 'medium', 'low'), defaultValue: 'medium' },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('medicines', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, unique: true },
      generic_name: { type: DataTypes.STRING },
      name_hindi: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
      uses: { type: DataTypes.TEXT },
      side_effects: { type: DataTypes.TEXT },
      precautions: { type: DataTypes.TEXT },
      category: { type: DataTypes.STRING },
      prescription_required: { type: DataTypes.BOOLEAN, defaultValue: true },
      manufacturer: { type: DataTypes.STRING },
      drug_class: { type: DataTypes.STRING },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('disease_medicines', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      disease_id: { type: DataTypes.INTEGER, references: { model: 'diseases', key: 'id' } },
      medicine_id: { type: DataTypes.INTEGER, references: { model: 'medicines', key: 'id' } },
      usage_notes: { type: DataTypes.TEXT },
      safety_warning: { type: DataTypes.TEXT },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('pharmacies', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      address: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING },
      state: { type: DataTypes.STRING },
      pincode: { type: DataTypes.STRING },
      latitude: { type: DataTypes.FLOAT },
      longitude: { type: DataTypes.FLOAT },
      opening_hours: { type: DataTypes.STRING },
      is_24_hours: { type: DataTypes.BOOLEAN, defaultValue: false },
      home_delivery: { type: DataTypes.BOOLEAN, defaultValue: false },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('reviews', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
      reviewable_type: { type: DataTypes.ENUM('doctor', 'hospital', 'pharmacy') },
      reviewable_id: { type: DataTypes.INTEGER },
      rating: { type: DataTypes.INTEGER },
      comment: { type: DataTypes.TEXT },
      is_approved: { type: DataTypes.BOOLEAN, defaultValue: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('favorites', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
      favorable_type: { type: DataTypes.ENUM('doctor', 'hospital', 'pharmacy') },
      favorable_id: { type: DataTypes.INTEGER },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });
    
    await queryInterface.addIndex('favorites', ['user_id', 'favorable_type', 'favorable_id'], { unique: true });

    await queryInterface.createTable('notifications', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
      title: { type: DataTypes.STRING },
      message: { type: DataTypes.TEXT },
      type: { type: DataTypes.ENUM('appointment', 'system', 'alert', 'reminder') },
      is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
      data: { type: DataTypes.JSON },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('emergency_services', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      type: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
      coverage_area: { type: DataTypes.STRING },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable('admin_logs', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      admin_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
      action: { type: DataTypes.STRING },
      entity_type: { type: DataTypes.STRING },
      entity_id: { type: DataTypes.INTEGER },
      old_values: { type: DataTypes.JSON },
      new_values: { type: DataTypes.JSON },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('admin_logs');
    await queryInterface.dropTable('emergency_services');
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('favorites');
    await queryInterface.dropTable('reviews');
    await queryInterface.dropTable('pharmacies');
    await queryInterface.dropTable('disease_medicines');
    await queryInterface.dropTable('medicines');
    await queryInterface.dropTable('disease_symptoms');
    await queryInterface.dropTable('symptoms');
    await queryInterface.dropTable('diseases');
    await queryInterface.dropTable('appointments');
    await queryInterface.dropTable('doctor_time_slots');
    await queryInterface.dropTable('doctor_availabilities');
    await queryInterface.dropTable('doctor_hospitals');
    await queryInterface.dropTable('doctor_specializations');
    await queryInterface.dropTable('hospital_departments');
    await queryInterface.dropTable('hospitals');
    await queryInterface.dropTable('doctors');
    await queryInterface.dropTable('patients');
    await queryInterface.dropTable('users');
  }
};