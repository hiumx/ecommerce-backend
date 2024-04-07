'use strict';

const { NotFoundError } = require('../core/error.response');
const OtpModel = require('../models/otp.model');
const { createTokenSendEmail } = require('../utils');

class OtpService {

    static async createNewOtp({ email }) {
        const token = createTokenSendEmail();
        try {
            const newOtp = await OtpModel.create({
                otp_token: token,
                otp_email: email
            });
            return newOtp;
        } catch (error) {
            console.error(error);
        }
    }

    static async checkOtpValid({ token }) {

        try {
            const foundToken = await OtpModel.findOne({ otp_token: token });
            if (!foundToken) throw new NotFoundError('Token not found');

            await OtpModel.deleteOne({ otp_token: token });
            
            return foundToken;
        } catch (error) {
            console.error(error);
        }
    }

}

module.exports = OtpService;