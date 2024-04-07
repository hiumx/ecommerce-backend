'use strict';

const RoleModel = require('../../models/role.model');

const findRoleByRoleName = async({ roleName}) => {
    const role = await RoleModel.findOne({ role_name: roleName }).lean();
    return role;
}

module.exports = {
    findRoleByRoleName
}