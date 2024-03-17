const { ReasonPhrases, StatusCodes } = require("../utils/httpStatusCode");

const ERROR_CODE = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const ERROR_MESSAGE = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error'
}

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ERROR_MESSAGE.FORBIDDEN, statusCode = ERROR_CODE.FORBIDDEN) {
        super(message, statusCode);
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ERROR_MESSAGE.CONFLICT, statusCode = ERROR_CODE.CONFLICT) {
        super(message, statusCode);
    }
}

class UnauthorizedError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode);
    }
}

class RedisResponseError extends ErrorResponse {
    constructor(message = ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message, statusCode);
    }
}

module.exports = {
    BadRequestError,
    ConflictRequestError,
    UnauthorizedError,
    NotFoundError, 
    ForbiddenError,
    RedisResponseError
}