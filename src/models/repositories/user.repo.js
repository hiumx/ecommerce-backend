'use strict';

const UserModel = require('../../models/user.model');

const createNewUser = async ({
    userId = 1,
    userSlug  = 'abcde',
    userEmail,
    username,
    userPassword,
    userRole,
}) => {
    try {
        const user = await UserModel.create({
            usr_id: userId,
            usr_email: userEmail,
            usr_slug: userSlug,
            usr_name: username,
            usr_password: userPassword,
            usr_role: userRole
        });
        return user;
    } catch (error) {
        console.error('Error create new user ', error);
    }
}

module.exports = {
    createNewUser
}