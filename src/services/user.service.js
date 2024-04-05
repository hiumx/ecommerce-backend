'use strict';

const { BadRequestError } = require("../core/error.response");
const UserModel = require("../models/user.model");
const EmailService = require("./email.service");

class UserServicer {

    static async newUser({ email = null, captcha = null }) {
        
        const foundUser = await UserModel.findOne({ usr_email: email });
        if (foundUser) throw BadRequestError('Email already exist');

        const result = await EmailService.sendEmailToken({ email });

        return result;
    }

}

module.exports = UserServicer;