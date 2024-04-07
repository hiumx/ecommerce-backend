'use strict';

const { BadRequestError, ConflictRequestError } = require("../core/error.response");
const { findRoleByRoleName } = require("../models/repositories/role.repo");
const { createNewUser } = require("../models/repositories/user.repo");
const UserModel = require("../models/user.model");
const EmailService = require("./email.service");
const keyTokenService = require("./keyToken.service");
const OtpService = require("./otp.service");
const { createTokensPair, verifyJWT } = require('../auth/authUtils');
const bcrypt = require('bcrypt');
const { getPubPriPairKey, getInfoData } = require("../utils");

class UserServicer {

    static async newUser({ email = null, captcha = null }) {

        const foundUser = await UserModel.findOne({ usr_email: email });
        if (foundUser) throw new BadRequestError('Email already exist');

        const result = await EmailService.sendEmailToken({ email });

        return result;
    }

    static async checkTokenEmail({ token }) {
        const { otp_email: email } = await OtpService.checkOtpValid({ token });
        
        const user = await this.findUserByEmailToken(email);
        if(user) throw new BadRequestError('Email already exists');

        const hashPassword = await bcrypt.hash(email, 10);

        const {_id: roleId} = await findRoleByRoleName({ roleName: 'user'})

        const newUser = await createNewUser({
            userId: 1,
            userSlug: 'abcdefgh',
            userEmail: email,
            userPassword: hashPassword,
            username: email,
            userRole: roleId
        });

        if (newUser) {
            const { publicKey, privateKey } = getPubPriPairKey();

            const keyStore = await keyTokenService.createKeyToken({
                userId: newUser.usr_id,
                publicKey,
                privateKey
            });

            if (!keyStore) {
                throw new ConflictRequestError('Public key string error!');
            }

            const tokens = createTokensPair(
                { userId: newUser.usr_id, email }, privateKey, publicKey
            );

            return {
                code: 201,
                metadata: {
                    userInfo: getInfoData({
                        fields: ['usr_id', 'usr_slug', 'usr_name', 'usr_email'],
                        object: newUser
                    }),
                    tokens
                }
            }
        }
    }

    static async findUserByEmailToken (email) {
        const user = await UserModel.findOne({ usr_email: email});
        return user;
    }

}

module.exports = UserServicer;