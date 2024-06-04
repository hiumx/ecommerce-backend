'use strict';

const { CACHE_PRODUCT } = require("../constants");
const { getCacheIO, setCacheIO, setCacheIOExpiration } = require("../models/repositories/cache.repo");
const SKU_MODEL = require("../models/sku.model");
const { randomSpuId } = require("../utils");
const _ = require('lodash');

class SkuService {

    static async newSku({
        product_id, sku_list
    }) {
        try {
            const listSku = sku_list.map(sku => ({
                ...sku, product_id, sku_id: `${product_id}.${randomSpuId()}`
            }));

            await SKU_MODEL.create(listSku);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async findOneSku({ product_id, sku_id, keyCacheSku }) {
        try {

            const sku = await SKU_MODEL.findOne({ product_id, sku_id }).lean();
            const cacheValue = sku ? sku : null;

            await setCacheIOExpiration({
                key: keyCacheSku,
                value: JSON.stringify(cacheValue),
                expirationOnSeconds: 30
            });

            const result = _.omit(sku, ['__v', 'createdAt', 'updatedAt', 'isDeleted']);
            
            return {
                ...result,
                toLoad: "dbs"
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async findListSkus({ product_id }) {
        try {
            const skus = await SKU_MODEL.find({ product_id }).lean();

            return skus;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}

module.exports = SkuService;