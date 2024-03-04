const { NotFoundError, BadRequestError } = require("../core/error.response");
const { checkCartValid } = require("../models/repositories/cart.repo");
const { checkProductsServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

class CheckoutService {
    static async checkoutReview({
        cartId, userId, shopOrderIds
    }) {
        const foundCart = await checkCartValid(cartId, userId);
        if (!foundCart) throw new NotFoundError('Cart not found!');

        const checkoutOrder = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }, shopOrderIdsNew = [];

        for (let i = 0; i < shopOrderIds.length; i++) {
            const { shopId, shopDiscounts = [], itemProducts = [] } = shopOrderIds[i];
            const checkProductServer = await checkProductsServer(itemProducts);

            if (!checkProductServer[0]) throw new BadRequestError('order failed!');

            const totalPrice = checkProductServer.reduce(
                (acc, product) => acc + (product.price * product.quantity), 0
            );

            checkoutOrder.totalPrice += totalPrice;

            const itemCheckout = {
                shopId,
                shopDiscounts,
                priceRaw: totalPrice,
                priceCheckout: totalPrice,
                itemProducts
            };

            if (shopDiscounts.length > 0) {
                const { totalOrder = 0, discountAmount = 0 } = await getDiscountAmount({
                    discountCode: shopDiscounts[0].codeId,
                    shopId,
                    userId,
                    products: itemProducts
                });

                if(discountAmount > 0) {
                    checkoutOrder.totalDiscount += discountAmount;
                    itemCheckout.priceCheckout = totalPrice - discountAmount;
                }

                checkoutOrder.totalCheckout += itemCheckout.priceCheckout;
            }

            shopOrderIdsNew.push(itemCheckout);
        }

        return {
            shopOrderIds,
            shopOrderIdsNew,
            checkoutOrder
        }

    }
}

module.exports = CheckoutService;