const { Medicine, Disease } = require('../models');
const { Op } = require('sequelize');
const apiResponse = require('../utils/apiResponse');

exports.getAllMedicines = async (req, res, next) => {
  try {
    const { search, category, prescription } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { generic_name: { [Op.like]: `%${search}%` } },
        { uses: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } }
      ];
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (prescription !== undefined && prescription !== '') {
      where.prescription_required = prescription === 'true';
    }

    const medicines = await Medicine.findAll({
      where,
      include: [{ model: Disease, through: { attributes: [] }, required: false }],
      order: [['name', 'ASC']]
    });

    apiResponse.success(res, medicines, 'Medicines fetched successfully');
  } catch (error) {
    next(error);
  }
};

exports.getMedicineById = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id, {
      include: [{ model: Disease, through: { attributes: ['usage_notes', 'safety_warning'] } }]
    });

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    apiResponse.success(res, medicine, 'Medicine details fetched');
  } catch (error) {
    next(error);
  }
};
