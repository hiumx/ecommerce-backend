'use strict';

const rbac = require('./rbac');
const { UnauthorizedError } = require('../core/error.response');

/**
 * 
 * @param {string} action // read | create| update | delete
 * @param {string} resource // resource access
 * @returns 
 */
const grantAccess = (action, resource) => {
    return (req, res, next) => {
        try {
            const role = req.query.role;
            const permission = rbac.can(role)[action](resource);

            if (!permission.granted) throw new UnauthorizedError('You are not permission');

            next();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = {
    grantAccess
}