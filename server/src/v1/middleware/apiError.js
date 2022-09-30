const mongoose = require("mongoose");
const httpStatus = require("http-status");
const errors = require("../config/errors");

class ApiError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode).json({
    status: "error",
    ...err,
  });
};

const errorConverter = (err, req, res, next) => {
  if (!(err instanceof ApiError)) {
    const statusCode =
      err.statusCode || err instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;

    const message = err.message
      ? { en: err.message, ar: err.message }
      : {
          en: httpStatus[statusCode],
          ar: httpStatus[statusCode],
        };

    err = new ApiError(statusCode, message);
  }

  next(err);
};

const unsupportedRouteHandler = (req, res, next) => {
  const statusCode = httpStatus.NOT_FOUND;
  const message = errors.system.unsupportedRoute;
  throw new ApiError(statusCode, message);
};

module.exports = {
  ApiError,
  errorHandler,
  errorConverter,
  unsupportedRouteHandler,
};
