const redisPubSubService = require('../services/redisPubSub.service');

class InventoryServiceTest {
    constructor() {
        redisPubSubService.subscribe('purchase_event', (channel, message) => {
            const { productId, quantity } = JSON.parse(message);
            InventoryServiceTest.updateInventory({ productId, quantity });
        })
    }

    static updateInventory({ productId, quantity }) {
        console.log(`Updated inventory product: ${productId} with quantity: ${quantity}`);
    }
}

module.exports = new InventoryServiceTest();