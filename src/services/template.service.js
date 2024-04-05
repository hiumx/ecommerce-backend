'use strict';

const TemplateModel = require('../models/template.model');
const { getTemplateEmailToken } = require('../utils/template.html');

class TemplateService {
    static async newTemplate({ templateId, templateName, templateHtml }) {
        const template = await TemplateModel.create({
            tem_id: templateId,
            tem_name: templateName,
            tem_html: getTemplateEmailToken()
        });
        return template;
    }

    static async getTemplate({ templateName }) {
        const foundTemp = await TemplateModel.findOne({ tem_name: templateName }).lean();
        return foundTemp;
    }
}

module.exports = TemplateService;