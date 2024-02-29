
const { BadRequestError } = require('../../core/error.response');
const { getDataSelect, getDataUnSelect } = require('../../utils');
const { productModel, clothingModel, electronicModel, furnitureModel } = require('../product.model');
const shopModel = require('../shop.model');
const { Types } = require('mongoose');

const findAllDraftProductByShop = async ({ query, limit, skip }) => {
    return await findProduct({ query, limit, skip });
}

const findAllPublishedProductByShop = async ({ query, limit, skip }) => {
    const result = await findProduct({ query, limit, skip });
    console.log(result);

    return await findProduct({ query, limit, skip });
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await shopModel.findOne({
        _id: new Types.ObjectId(product_shop)
    });

    if (!foundShop) return null;

    const foundProduct = await productModel.findOne({
        _id: new Types.ObjectId(product_id),
        product_shop: foundShop._id
    });

    if (!foundProduct) return null;
    console.log(foundProduct);

    foundProduct.isDraft = false;
    foundProduct.isPublished = true;

    const { modifiedCount } = await foundProduct.updateOne(foundProduct);
    return modifiedCount;
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await shopModel.findOne({
        _id: new Types.ObjectId(product_shop)
    });

    if (!foundShop) return null;

    const foundProduct = await productModel.findOne({
        _id: new Types.ObjectId(product_id),
        product_shop: foundShop._id
    });

    if (!foundProduct) return null;
    console.log(foundProduct);

    foundProduct.isDraft = true;
    foundProduct.isPublished = false;

    const { modifiedCount } = await foundProduct.updateOne(foundProduct);
    return modifiedCount;
}

const findProduct = async ({ query, limit, skip }) => {
    return await productModel.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updatedAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
}

const searchProductsByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    return await productModel.find({
        isPublished: true,
        $text: { $search: regexSearch }
    }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .lean();
}

const findAllProducts = async ({ limit, page, sort, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    return await productModel.find(filter)
        .select(getDataSelect(select))
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .lean()
}

const findProductByUser = async ({ product_id, unSelect }) => {
    return await productModel.findById(product_id).select(getDataUnSelect(unSelect)).lean();
}

const updateProduct = async ({
    productId,
    shopId,
    bodyUpdate,
    model,
    isNew = true
}) => {
        return await model.findOneAndUpdate(
        { _id: new Types.ObjectId(productId), product_shop: new Types.ObjectId(shopId) },
        bodyUpdate,
        { new: isNew }
    );
}

module.exports = {
    findAllDraftProductByShop,
    findProduct,
    publishProductByShop,
    findAllPublishedProductByShop,
    unPublishProductByShop,
    searchProductsByUser,
    findAllProducts,
    findProductByUser,
    updateProduct,
}