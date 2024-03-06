'use strict';

const { SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
    async addStockToInventory(req, res, next) {
        new SuccessResponse({
            message: 'Add stock to inventory success',
            metadata: await InventoryService.addStockToInventory(req.body)
        })
    }
}

module.exports = new InventoryController();