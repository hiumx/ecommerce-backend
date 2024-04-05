'use strict';

const getTemplateEmailToken = () => {
    return '<a href="{{link_verify}}">Xác nhận email</a>';
}

module.exports = {
    getTemplateEmailToken
}