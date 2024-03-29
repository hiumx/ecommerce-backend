'use strict';

const {SuccessResponse} = require('../core/success.response');

const dataProfiles = [
    {
        usr_id: 1,
        usr_name: 'abc',
        usr_avatar: 'avatar/user/1'
    },
    {
        usr_id: 2,
        usr_name: 'bdf',
        usr_avatar: 'avatar/user/2'
    },
    {
        usr_id: 3,
        usr_name: 'xyz',
        usr_avatar: 'avatar/user/3'
    },
];
class ProfileController {

    async profiles(req, res, next) {
        new SuccessResponse({
            message: 'Get alls profiles success',
            metadata: dataProfiles
        }).send(res);
    }

    async profile(req, res, next) {
        new SuccessResponse({
            message: 'Get info profile success',
            metadata: {
                usr_id: 1,
                usr_name: 'abc',
                usr_avatar: 'avatar/user/1'
            }
        }).send(res);
    }
}

module.exports = new ProfileController();