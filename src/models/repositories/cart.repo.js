const { convertToObjectIdMongoDb } = require('../../utils');
const cartModel = require('../cart.model');
const { findProductById } = require('./product.repo');

const checkProductValid = async product => {
    const { productId, name, price} = product;
    const foundProduct = await findProductById(productId);

    if (!foundProduct) throw new NotFoundError('Product not found!');

    return foundProduct.product_name === name && foundProduct.product_price === price;
}


const createUserCart = async ({ userId, product }) => {
    const query = {
        cart_userId: userId, cart_state: 'active'
    }, updateOrInsert = {
        $addToSet: {
            cart_products: product
        }
    }, options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
}

const updateUserCartQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_state: 'active'
    }, updateSet = {
        $inc: {
            'cart_products.$.quantity': quantity
        }
    }, options = {
        upsert: true, new: true
    };

    return await cartModel.findOneAndUpdate(query, updateSet, options);
}

const addNewProductToCart = async ({userId, product}) => {
    const query = {
        cart_userId: userId,
        cart_state: 'active'
    }, updateSet = {
        $addToSet: {
            cart_products: product
        }
    }, options = {
        upsert: true, new: true
    };

    return await cartModel.findOneAndUpdate(query, updateSet, options);
}


const findCartByUserId = async userId =>
    await cartModel.findOne({
        cart_userId: +userId,
        cart_state: 'active'
    });

const checkCartValid = async (cardId, userId) => 
    await cartModel.findOne({
        _id: convertToObjectIdMongoDb(cardId),
        cart_userId: +userId,
        cart_state: 'active'
    });

module.exports = {
    createUserCart,
    updateUserCartQuantity,
    findCartByUserId,
    checkProductValid,
    addNewProductToCart,
    checkCartValid
}