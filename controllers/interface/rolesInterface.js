const _ = require('lodash');
const devUtils = require('develop-utils');

const roleBusiness = require('../business/roleBusiness');



exports.getRoleDetails = async (ctx, next) => {
    try {

        let body = _.clone(ctx.request.body);
        let params = ctx.params;
        let query = _.clone(ctx.request.query);
        let ret = await roleBusiness.getRoleDetails(query.roleHref,query.applicationHref);
        ctx.body = ret;
        ctx.status = 200;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
    }
};