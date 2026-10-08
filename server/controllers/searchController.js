const { Hospital, Doctor, Disease, Medicine, User, DoctorSpecialization } = require('../models');
const { Op } = require('sequelize');
const apiResponse = require('../utils/apiResponse');

exports.unifiedSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return apiResponse.success(res, { hospitals: [], doctors: [], diseases: [], medicines: [] });
    }

    const query = q.trim();

    const [hospitals, doctors, diseases, medicines] = await Promise.all([
      Hospital.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { city: { [Op.like]: `%${query}%` } }
          ]
        },
        limit: 5
      }),
      Doctor.findAll({
        include: [
          {
            model: User,
            where: {
              [Op.or]: [
                { name: { [Op.like]: `%${query}%` } },
                { city: { [Op.like]: `%${query}%` } }
              ]
            },
            attributes: ['name', 'city', 'avatar']
          },
          {
            model: DoctorSpecialization
          }
        ],
        limit: 5
      }),
      Disease.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { name_hindi: { [Op.like]: `%${query}%` } },
            { specialty: { [Op.like]: `%${query}%` } }
          ]
        },
        limit: 5
      }),
      Medicine.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { generic_name: { [Op.like]: `%${query}%` } },
            { uses: { [Op.like]: `%${query}%` } }
          ]
        },
        limit: 5
      })
    ]);

    apiResponse.success(res, {
      hospitals,
      doctors,
      diseases,
      medicines
    }, 'Unified search results');
  } catch (error) {
    next(error);
  }
};
