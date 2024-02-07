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

    async logout(req, res, next) {
        
        new SuccessResponse({
            message: 'Logout successfully',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);
    }

    async handleRefreshToken (req, res, next) {
        new SuccessResponse({
            message: 'Get tokens successfully',
            metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
        }).send(res);
    }
}

module.exports = new AccessController();