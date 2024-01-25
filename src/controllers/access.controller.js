'use strict';

const AccessService = require("../services/access.service");

class AccessController {
    async signUp(req, res, next) {
        try {
            const response = await AccessService.signUp(req.body);
            return res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AccessController();