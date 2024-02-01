
const SUCCESS_CODE = {
    OK: 200,
    CREATED: 201
}

const SUCCESS_MESSAGE = {
    OK: 'OK',
    CREATED: 'CREATED'
}

class SuccessResponse {
    constructor({ name, statusCode = SUCCESS_CODE.OK, message = SUCCESS_MESSAGE.OK, metadata = {} }) {
        this.name = name ? name : message;
        this.statusCode = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        res.status(this.statusCode).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ name, metadata }) {
        super({name, metadata});
    }
}

class CREATED extends SuccessResponse {
    constructor({ name, statusCode = SUCCESS_CODE.CREATED, message = SUCCESS_MESSAGE.CREATED, metadata, options = {} }) {
        super({ name, statusCode, message, metadata});
        this.options = options
    }
}

module.exports = {
    OK,
    CREATED
}
