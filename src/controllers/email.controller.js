'use strict';

const { SuccessResponse } = require("../core/success.response");
const TemplateService = require("../services/template.service");

class EmailController {

    async createTemplate(req, res, next) {
        new SuccessResponse({
            message: 'Create new template success',
            metadata: await TemplateService.newTemplate(req.body)
        }).send(res);
    }

}

module.exports = new EmailController();