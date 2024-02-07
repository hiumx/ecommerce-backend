'use strict';

const AccessService = require("../services/access.service");
const { CREATED, SuccessResponse } = require('../core/success.response');

class AccessController {
    async signUp(req, res, next) {
        new CREATED({
            name: 'Sign up successfully',
            metadata:  await AccessService.signUp(req.body),
            options: {
                limits: 10
            }
        }).send(res);
    }

    async login(req, res, next) {
        new SuccessResponse(await AccessService.login(req.body)).send(res);
    }
}

module.exports = new AccessController();