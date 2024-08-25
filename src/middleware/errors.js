// errors.js

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Error 401: Unauthorized
class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

// Error 403: Forbidden
class ForbiddenError extends CustomError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

// Error 404: Not found
class NotFoundError extends CustomError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}
// Error 500: Server error
class ServerError extends CustomError {
  constructor(message = "Server Error") {
    super(message, 500);
  }
}

// Other...

module.exports = {
  CustomError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ServerError,
};
