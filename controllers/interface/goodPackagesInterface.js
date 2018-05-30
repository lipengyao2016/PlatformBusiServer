
const _ = require('lodash');
const devUtils = require('develop-utils');

const goodPackageBusiness = require('../business/goodPackageBusiness');

const jwtTokenResource = require('../../common/jwtTokenResource');


exports.createGoodPackages = async (ctx, next) => {
    try {

         let body = _.clone(ctx.request.body);
         let params = ctx.params;
         let query = ctx.request.query;

         jwtTokenResource.setTokenMerchantData(ctx,body);

         let ret = await goodPackageBusiness.createGoodPackages(body);

         ctx.body = ret;
         ctx.status = 201;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
    }
};


exports.listGoodPackages = async (ctx, next) => {
    try {

        let body = _.clone(ctx.request.body);
        let params = ctx.params;
        let query = _.clone(ctx.request.query);

        jwtTokenResource.setTokenMerchantData(ctx,query);

        let ret = await goodPackageBusiness.listGoodPackages(query);

        ctx.body = ret;
        ctx.status = 200;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
    }
};


exports.getPackageDetails = async (ctx, next) => {
    try {

        let body = _.clone(ctx.request.body);
        let params = ctx.params;
        let query = _.clone(ctx.request.query);

        jwtTokenResource.setTokenMerchantData(ctx,query);

        let ret = await goodPackageBusiness.getPackageDetails(query.packageId);

        ctx.body = ret;
        ctx.status = 200;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
    }
};