'use strict';

const { NotFoundError } = require("../core/error.response");
const { transporter } = require("../dbs/init.nodemailer");
const { replaceHolderSendEmail } = require("../utils");
const OtpService = require("./otp.service");
const TemplateService = require("./template.service");

class EmailService {

    static async sendEmailLinkVerify({
        toEmail, html, subject, text = 'Xác nhận...'
    }) {
        const mailOptions = {
            form: ' "ShopDEV" <maixuanhieu250123@gmail.com>',
            to: toEmail,
            subject,
            html,
            text
        };
        
        transporter.sendMail(mailOptions, (err, info) => {
            console.log(mailOptions);
            if(err) return console.error(err);
            console.log('Message sended ', info.messageId);
        });
    }

    static async sendEmailToken({ email = null }) {

        try {
            const token = await OtpService.createNewOtp({ email });

            const templateHtml = await TemplateService.getTemplate({
                templateName: 'Template confirm email'
            });

            if(!templateHtml) throw new NotFoundError('Template not found')

            const content = replaceHolderSendEmail(templateHtml.tem_html, {
                link_verify: `http://localhost:3456/cpg/welcome-back?token=${token.otp_token}`
            })

            console.log(content);

            this.sendEmailLinkVerify({
                toEmail: email,
                html: content,
                subject: 'Vui lòng xác nhận email đăng kí SHOPDEV'
            }).catch(err => console.error(err));

            return 1;

        } catch (error) {
            console.error('Error send email ', error);
            return error;
        }
    }
}

module.exports = EmailService