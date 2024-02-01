'use strict';

const { checkApiKey, checkPermission } = require('../auth/checkAuth');

const router = (app) => {
    app.use(checkApiKey);
    app.use(checkPermission('0000'));
    app.use('/api/v1', require('./access'));
    // app.use('/api/v1', require('./site'));
}

module.exports = router;