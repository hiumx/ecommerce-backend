'use strict';

const { BadRequestError } = require('../core/error.response');
const inventoryModel = require('../models/inventory.model');
const { findProductById } = require('../models/repositories/product.repo');

class InventoryService {

    static async addStockToInventory({ stock, productId, shopId, location = 'Da Nang' }) {
        const foundProduct = await findProductById(productId);
        if (!foundProduct) throw new BadRequestError('Product invalid!');

        const query = {
            inventory_productId: productId,
            inventory_shopId: shopId
        }, updateSet = {
            $inc: {
                inventory_stock: stock
            },
            $set: {
                inventory_location: location
            }
        }, options = { upsert: true, new: true };

        return await inventoryModel.findOneAndUpdate(query, updateSet, options);
    }
}

module.exports = InventoryService;