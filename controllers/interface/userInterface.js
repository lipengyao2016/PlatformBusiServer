const _ = require('lodash');
const devUtils = require('develop-utils');

const userBusiness = require('../business/userBusiness');



exports.registerUser = async (ctx, next) => {
    try {

        let body = _.clone(ctx.request.body);
        let params = ctx.params;
        let query = _.clone(ctx.request.query);
        let ret = await userBusiness.registerUser(body.user,body.account);
        ctx.body = ret;
        ctx.status = 201;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
    }
};