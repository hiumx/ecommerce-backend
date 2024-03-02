'use strict';

const { checkApiKey, checkPermission } = require('../auth/checkAuth');

const router = (app) => {
    app.use(checkApiKey);
    app.use(checkPermission('0000'));

    app.use('/api/v1/product', require('./product'));
    app.use('/api/v1/discount', require('./discount'));
    app.use('/api/v1/cart', require('./cart'));
    
    app.use('/api/v1', require('./access'));
    // app.use('/api/v1', require('./site'));
}

module.exports = router;