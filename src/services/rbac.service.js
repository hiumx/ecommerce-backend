'use strict';

const RoleModel = require('../models/role.model'); 
const ResourceModel = require('../models/resource.model'); 

class RBACService {

    static async createRole({
        name = 'user',
        slug = 's0001',
        description = 'extend from user',
        grants = []
    }) {
        // 1. Check user valid

        try {
            const role = await RoleModel.create({
                role_name: name,
                role_slug: slug,
                role_description: description,
                role_grants: grants
            });
    
            return role;
        } catch (error) {
            console.error(error);
        }
        
    }

    static async createResource({
        name = 'profile', slug = 'p0001', description = 'Profile resource'
    }) {
        try {
            const resource = await ResourceModel.create({
                src_name: name,
                src_slug: slug,
                src_description: description
            });

            return resource;
        } catch (error) {
            console.error(error);
        }
    }

    static async listRoles({
        userId = 1,
        limit = 30, 
        offset = 0,
        search = ''
    }) {
        try {
            const roles = await RoleModel.aggregate([
                {
                    $unwind: '$role_grants'
                },
                {
                    $lookup: {
                        from: 'Resources',
                        localField: 'role_grants.resource',
                        foreignField: '_id',
                        as: 'resource'
                    }
                },
                {
                    $project: {
                        _id: 0,
                        role: '$role_name',
                        resource: '$resource.src_name',
                        action: '$role_grants.actions',
                        attributes: '$role_grants.attributes',
                    }
                }, 
                {
                    $unwind: '$action'
                },
                {
                    $unwind: '$resource'
                },
                {
                    $project: {
                        role: 1,
                        resource: 1, 
                        action: 1,
                        attributes: 1
                    }
                }
            ]);
            return roles;
        } catch (error) {
            console.error(error);
        }
    }

    static async listResources({
        userId = 1,
        limit = 30, 
        offset = 0,
        search = ''
    }) {
        try {
            const resources = await ResourceModel.aggregate([
                {
                    $project: {
                        _id: 0,
                        name: '$src_name',
                        slug: '$src_slug',
                        description: '$src_description',
                        resourceId: '$_id',
                        createdAt: 1
                    }
                }
            ]);
            return resources;
        } catch (error) {
            console.error(error);
        }
    }

}

module.exports = RBACService;