'use strict';

const { checkApiKey, checkPermission } = require('../auth/checkAuth');
const { pushLogsToDiscord } = require('../middlewares');

const router = (app) => {
    app.use(checkApiKey);
    app.use(checkPermission('0000'));
    app.use(pushLogsToDiscord);
    
    app.use('/api/v1/rbac', require('./rbac'));
    app.use('/api/v1/product', require('./product'));
    app.use('/api/v1/inventory', require('./inventory'));
    app.use('/api/v1/checkout', require('./checkout'));
    app.use('/api/v1/discount', require('./discount'));
    app.use('/api/v1/comment', require('./comment'));
    app.use('/api/v1/notification', require('./notification'));
    app.use('/api/v1/cart', require('./cart'));
    app.use('/api/v1/upload', require('./upload'));
    app.use('/api/v1/profile', require('./profile'));
    
    app.use('/api/v1', require('./access'));
    // app.use('/api/v1', require('./site'));
}

module.exports = router;