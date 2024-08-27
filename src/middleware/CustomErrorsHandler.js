const { CustomError } = require("./errors");

const customErrorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
  }

  res.status(500).json({
    error: {
      message: "Internal Server Error",
      statusCode: 500,
    },
  });
};

module.exports = customErrorHandler;
