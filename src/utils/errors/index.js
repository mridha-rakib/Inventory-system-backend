class BaseError extends Error {
  constructor(message, statusCode, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class BadRequestError extends BaseError {
  constructor(message = "Bad Request", errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class ForbiddenError extends BaseError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

class NotFoundError extends BaseError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

class ConflictError extends BaseError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

class InternalServerError extends BaseError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}

export {
  BaseError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};
