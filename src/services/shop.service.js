const { BadRequestError, UnauthorizedError } = require("../core/error.response");
const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');

class ShopService {
    static async findByEmail(email, select = { name: 1, email: 1, password: 1, roles: 1 }) {
        return await shopModel.findOne({ email }).select(select).lean();
    }

}

module.exports = {
    ShopService
}