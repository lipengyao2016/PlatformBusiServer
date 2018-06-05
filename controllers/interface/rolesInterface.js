const _ = require('lodash');
const devUtils = require('develop-utils');

const roleBusiness = require('../business/roleBusiness');
const resourceURI = require('../resource/resourceURI');
const URIParser = resourceURI.v1;
const config = require('../../config/config');

exports.getRoleDetails = async (ctx, next) => {
    try {

        let body = _.clone(ctx.request.body);
        let params = ctx.params;
        let query = _.clone(ctx.request.query);

        let roleHref = query.roleHref;
        if(!roleHref && query.roleUUID)
        {
            roleHref = URIParser.baseResourcesURI(config.serverIndexs.Role_Server,'roles') + `/${query.roleUUID}`;
        }

        let ret = await roleBusiness.getRoleDetails(roleHref,query.applicationHref);
        ctx.body = ret;
        ctx.status = 200;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
    }
};

exports.create = async (ctx, next) => {
    try {

        let body = _.clone(ctx.request.body);
        let params = ctx.params;
        let query = _.clone(ctx.request.query);

        let ret = await roleBusiness.create(body);
        ctx.body = ret;
        ctx.status = 201;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
    }
};

exports.update = async (ctx, next) => {
    try {

        let body = _.clone(ctx.request.body);
        let params = ctx.params;
        let query = _.clone(ctx.request.query);

        let ret = await roleBusiness.update(params.roleUUID,body);
        ctx.body = ret;
        ctx.status = 200;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
    }
};


exports.list = async (ctx, next) => {
    try {

        let body = _.clone(ctx.request.body);
        let params = ctx.params;
        let query = _.clone(ctx.request.query);

        let ret = await roleBusiness.list(query);
        ctx.body = ret;
        ctx.status = 200;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
    }
};