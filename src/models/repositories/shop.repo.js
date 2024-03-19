'use strict';

const ShopModel = require('../../models/shop.model');

const findShopById = async shopId => {
    return await ShopModel.findById(shopId);
}

module.exports = {
    findShopById
}