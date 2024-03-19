'use strict';

const NotifyModel = require('../models/notification.model');

class NotificationService {
    static async pushNotifyToSystem({
        type = 'SHOP-001',
        senderId = 1,
        receiverId = 1,
        options = {}
    }) {
        let notify_content;

        if (type === 'SHOP-001') {
            notify_content = '@@@ vừa thêm một sản phẩm mới: @@@@';
        } else if (type === 'PROMOTION-001') {
            notify_content = '@@@ vừa thêm mới một voucher: @@@@@';
        }

        const notify = await NotifyModel.create({
            notify_type: type,
            notify_content,
            notify_senderId: senderId,
            notify_receiverId: receiverId,
            notify_options: options
        });

        return notify;
    }

    static async listNotifiesByUser({
        userId = 1, type = 'ALL', isRead = 0
    }) {
        const match = { notify_receiverId: userId };

        if (type !== 'ALL')
            match['notify_type'] = type;

        return await NotifyModel.aggregate([{
            $match: match
        }, {
            $project: {
                notify_type: 1,
                notify_content: 1,
                notify_senderId: 1,
                notify_receivedId: 1,
                notify_options: 1
            }
        }
        ]);

    }
}

module.exports = NotificationService;