'use strict';

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
}

module.exports = OtpService;