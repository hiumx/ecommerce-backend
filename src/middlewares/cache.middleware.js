'use strict';

const { CACHE_PRODUCT } = require("../constants");
const { getCacheIO } = require("../models/repositories/cache.repo");

const getCache = async (req, res, next) => {
    const { product_id, sku_id } = req;
    if (product_id < 0 || sku_id < 0)
        return null;

    const keyCacheSku = `${CACHE_PRODUCT.SKU}${sku_id}`;
    const cacheValue = await getCacheIO({ key: keyCacheSku });

    if (!cacheValue) {
        req.keyCacheSku = keyCacheSku;
        return next();
    }

    return res.status(200).json({
        ...JSON.parse(cacheValue),
        toLoad: 'cache'
    });
}

module.exports = {
    getCache
}