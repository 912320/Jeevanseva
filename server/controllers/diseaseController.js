const { Disease, Symptom, Medicine } = require('../models');
const { Op } = require('sequelize');
const apiResponse = require('../utils/apiResponse');

exports.getAllDiseases = async (req, res, next) => {
  try {
    const { search, category, severity, is_emergency } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { name_hindi: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { specialty: { [Op.like]: `%${search}%` } }
      ];
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (severity && severity !== 'all') {
      where.severity = severity;
    }

    if (is_emergency === 'true') {
      where.is_emergency = true;
    }

    const diseases = await Disease.findAll({
      where,
      include: [
        { model: Symptom, through: { attributes: ['relevance'] }, required: false },
        { model: Medicine, through: { attributes: ['usage_notes', 'safety_warning'] }, required: false }
      ],
      order: [['is_emergency', 'DESC'], ['name', 'ASC']]
    });

    apiResponse.success(res, diseases, 'Diseases fetched successfully');
  } catch (error) {
    next(error);
  }
};

exports.getDiseaseById = async (req, res, next) => {
  try {
    const disease = await Disease.findByPk(req.params.id, {
      include: [
        { model: Symptom, through: { attributes: ['relevance'] } },
        { model: Medicine, through: { attributes: ['usage_notes', 'safety_warning'] } }
      ]
    });

    if (!disease) {
      return res.status(404).json({ success: false, message: 'Disease not found' });
    }

    apiResponse.success(res, disease, 'Disease details fetched');
  } catch (error) {
    next(error);
  }
};
