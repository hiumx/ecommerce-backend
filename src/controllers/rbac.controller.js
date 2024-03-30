'use strict';

const { SuccessResponse } = require("../core/success.response");
const RBACService = require("../services/rbac.service");

class RBACController {
    async createRole(req, res, next) {
        new SuccessResponse({
            message: 'Create new role success',
            metadata: await RBACService.createRole(req.body)
        }).send(res);
    }

    async createResource(req, res, next) {
        new SuccessResponse({
            message: 'Create new resource success',
            metadata: await RBACService.createResource(req.body)
        }).send(res);
    }

    async listRoles(req, res, next) {
        new SuccessResponse({
            message: 'list roles success',
            metadata: await RBACService.listRoles(req.query)
        }).send(res);
    }

    async listResources(req, res, next) {
        new SuccessResponse({
            message: 'List resources success',
            metadata: await RBACService.listResources(req.query)
        }).send(res);
    }
}

module.exports = new RBACController();