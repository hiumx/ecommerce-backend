const inventoryModel = require('../inventory.model');

const insertInventory = async ({ productId, shopId, stock, location = 'Unknown' }) => {
    return await inventoryModel.create({
        inventory_productId: productId,
        inventory_shopId: shopId,
        inventory_stock: stock,
        inventory_location: location
    })
};

const reservationInventory = async ({ cartId, productId, quantity }) => {
    const query = {
        inventory_productId: productId,
        inventory_stock: {$gte: quantity}
    }, updateSet = {
        $inc: {
            inventory_stock: -quantity
        },
        $push: {
            inventory_reservations: {
                cartId,
                quantity,
                createOn: new Date()
            }
        }
    }

    return await inventoryModel.updateOne(query, updateSet);
}

module.exports = {
    insertInventory,
    reservationInventory
}