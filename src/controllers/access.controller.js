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
        const objBody = Object.assign({
            requestId: req.requestId
        }, req.body);
        new SuccessResponse(await AccessService.login(objBody)).send(res);
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
            metadata: await AccessService.handleRefreshToken({
                user: req.user,
                refreshToken: req.refreshToken,
                keyStore: req.keyStore
            })
        }).send(res);
    }
}

module.exports = new AccessController();