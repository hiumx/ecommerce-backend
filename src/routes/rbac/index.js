'use strict';

const express = require('express');
const router = express.Router();

const rbacController = require('../../controllers/rbac.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { grantAccess } = require('../../middlewares/role.middleware');

router.post('/role', asyncHandler(rbacController.createRole));
router.get('/roles', asyncHandler(rbacController.listRoles));

router.post('/resource', asyncHandler(rbacController.createResource));
router.get('/resources', asyncHandler(rbacController.listResources));

module.exports = router;