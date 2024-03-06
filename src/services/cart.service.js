'use strict';

const { NotFoundError, BadRequestError } = require('../core/error.response');
const cartModel = require('../models/cart.model');
const { createUserCart, updateUserCartQuantity, findCartByUserId, checkProductValid, addNewProductToCart } = require('../models/repositories/cart.repo');
const { findProductById } = require('../models/repositories/product.repo');

class CartService {
    static async addToCart({ userId, product = {} }) {

        const isValidProduct = await checkProductValid(product);
        if (!isValidProduct)
            throw new BadRequestError('Product invalid!');

        const userCart = await findCartByUserId(userId);

        if (!userCart) {
            return await createUserCart({ userId, product });
        }

        if (!userCart.cart_products.length) {
            userCart.cart_products = [product];
            return await userCart.save();
        }

        const foundProduct = userCart.cart_products.find(item => item.productId === product.productId);

        if (foundProduct) {
            return await updateUserCartQuantity({ userId, product });
        }

        return await addNewProductToCart({ userId, product });

    }

    /*
    shop_cart_ids : [
        {
            shopId: ,
            item_products : [
                {
                    productId ,
                    quantity,
                    old_quantity
                    name: ,
                    price
                }
            ]
        }
    ]
    */

    static async updateToCart({ userId, shopOrderIds }) {

        const userCart = await findCartByUserId(userId);
        if (!userCart) throw new NotFoundError('User cart not found!');

        if (!checkProductValid(shopOrderIds[0]?.item_products[0]))
            throw new BadRequestError('Product invalid!');

        const { productId, quantity, old_quantity } = shopOrderIds[0]?.item_products[0];

        const foundProduct = await findProductById(productId);


        if (!foundProduct) throw new NotFoundError('Product not found!');

        if (foundProduct.product_shop.toString() !== shopOrderIds[0]?.shopId)
            throw new NotFoundError('Product not belong to the shop!');

        if (quantity === 0) {
            this.deleteToCart({ userId, productId });
        }
        return await updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        });
    }

    static async deleteToCart({ userId, productId }) {

        const userCart = findCartByUserId(userId);

        if (!userCart) throw new NotFoundError('Not found cart!');

        const query = {
            cart_userId: userId,
            cart_state: 'active'
        }, updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        };

        const deleteItem = await cartModel.updateOne(query, updateSet);

        return deleteItem;
    }

    static async listToCart({ userId }) {
        return cartModel.findOne({
            cart_userId: +userId
        }).lean();
    }
}

module.exports = CartService;