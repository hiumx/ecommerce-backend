'use strict';

const { NotFoundError } = require("../core/error.response");
const { findShopById } = require("../models/repositories/shop.repo");
const SPU_MODEL = require("../models/spu.model");
const { randomSpuId } = require("../utils");
const SkuService = require("./sku.service");
const { newSku } = require("./sku.service");

const _ = require('lodash');

class SpuService {

    static async newSpu({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_category,
        product_slug = 'abcde23',
        product_shop,
        product_attributes,
        product_variations,
        sku_list = []
    }) {

        try {
            const foundShop = await findShopById(product_shop);
            if (!foundShop) throw new NotFoundError('Shop not found');

            const spu = await SPU_MODEL.create({
                product_id: randomSpuId(),
                product_name,
                product_thumb,
                product_description,
                product_price,
                product_quantity,
                product_category,
                product_slug,
                product_shop,
                product_attributes,
                product_variations
            });

            if (spu && sku_list.length > 0) {
                await newSku({ product_id: spu.product_id, sku_list });
            }

            return !!spu;
        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    static async findSpu({ product_id }) {
        const spuFound = await SPU_MODEL.findOne({ product_id }).lean();

        if (!spuFound) throw new NotFoundError('Spu not found');

        const listSkus = await SkuService.findListSkus({ product_id });

        return {
            spu_info: _.omit(spuFound, ['__v', 'createdAt', 'updatedAt', 'isDeleted']),
            sku_list: listSkus.map(sku => _.omit(sku, ['__v', 'createdAt', 'updatedAt', 'isDeleted']))
        }
    }
}

module.exports = SpuService;