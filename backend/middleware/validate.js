import { validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    try {
      await Promise.all(validations.map((validation) => validation.run(req)));
      
      const errors = validationResult(req);
      
      if (errors.isEmpty()) {
        return next();
      }

      const formattedErrors = errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      }));

      return res.status(400).json({
        success: false,
        errors: formattedErrors,
      });
    } catch (error) {
      next(error);
    }
  };
};
