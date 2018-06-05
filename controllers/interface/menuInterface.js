const _ = require('lodash');
const devUtils = require('develop-utils');

const menuBusiness = require('../business/menuBusiness');
const resourceURI = require('../resource/resourceURI');
const URIParser = resourceURI.v1;
const config = require('../../config/config');

exports.syncAppMenus = async (ctx, next) => {
    try {

        let body = _.clone(ctx.request.body);
        let params = ctx.params;
        let query = _.clone(ctx.request.query);


        let ret = await menuBusiness.syncAppMenus(body);
        ctx.body = ret;
        ctx.status = 200;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
    }
};