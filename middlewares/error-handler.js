const { StatusCodes } = require('http-status-codes');
const { ValidationError } = require('mongoose').MongooseError;
const { CustomAPIError } = require('../errors/custom-api');

const errorHandlerMiddleware = (err, req, res,next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ ERROR:err.errMessage,message: err.message });
  }

  if (err instanceof ValidationError) {
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(StatusCodes.BAD_REQUEST).json({ message: errors });
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ERROR:"Internal Server Error",message: 'Something went wrong. Please try again later.' });
};

module.exports = errorHandlerMiddleware;
