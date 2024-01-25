'use strict';

const router = (app) => {
    app.use('/api/v1', require('./access'));
    // app.use('/api/v1', require('./site'));
}

module.exports = router;