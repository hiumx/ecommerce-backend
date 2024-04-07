'use strict';

const { SuccessResponse } = require('../core/success.response');
const UserServicer = require('../services/user.service');

class UserController {
    async newUser(req, res, next) {
        new SuccessResponse({
            message: 'New user successfully',
            metadata: await UserServicer.newUser(req.body)
        }).send(res);
    }

    async verifyTokenEmailLogin(req, res, next) {
        new SuccessResponse({
            message: 'Verify token user successfully',
            metadata: await UserServicer.checkTokenEmail({token: req.query.token})
        }).send(res);
    }
}

module.exports = new UserController();