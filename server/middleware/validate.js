const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  // If called as a higher-order factory: validate([rules])
  if (Array.isArray(req)) {
    const validations = req;
    return async (reqActual, resActual, nextActual) => {
      await Promise.all(validations.map(v => v.run(reqActual)));
      const errors = validationResult(reqActual);
      if (errors.isEmpty()) return nextActual();
      return resActual.status(400).json({
        success: false,
        message: errors.array()[0]?.msg || 'Validation failed',
        errors: errors.array()
      });
    };
  }

  // If called as standard middleware after rules array in route:
  // router.post('/route', [rules], validate, handler)
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(400).json({
    success: false,
    message: errors.array()[0]?.msg || 'Validation failed',
    errors: errors.array()
  });
};

module.exports = validate;