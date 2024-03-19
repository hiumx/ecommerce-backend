'use strict';

const {SuccessResponse} = require('../core/success.response');
const NotificationService = require('../services/notification.service');

class NotificationController {
    async listNotifiesByUser(req, res, next) {
        new SuccessResponse({
            message: 'List notifies by user success',
            metadata: await NotificationService.listNotifiesByUser(req.query)
        }).send(res);
    }
}

module.exports = new NotificationController();