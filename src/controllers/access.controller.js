'use strict';

const AccessService = require("../services/access.service");
const { CREATED } = require('../core/success.response');

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
}

module.exports = new AccessController();