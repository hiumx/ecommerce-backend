'use strict';

const rbac = require('./rbac');
const { UnauthorizedError } = require('../core/error.response');
const RBACService = require('../services/rbac.service');

/**
 * 
 * @param {string} action // read | create| update | delete
 * @param {string} resource // resource access
 * @returns 
 */
const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            const role = req.query.role;
            rbac.setGrants(await RBACService.listRoles({
                userId: 2501
            }));
            const permission = rbac.can(role)[action](resource);

            if (!permission.granted) throw new UnauthorizedError('You are not have permission');

            next();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = {
    grantAccess
}