'use strict';

const validation = (req, res, next) => {
    const { productId, skuId } = req.query;
    if (productId < 0 || skuId < 0) {
        return res.status(401).json({
            code: 401,
            message: "SPU or SKU invalid"
        });
    }

    req.product_id = productId;
    req.sku_id = skuId;
    return next();
}

module.exports = {
    validation
}