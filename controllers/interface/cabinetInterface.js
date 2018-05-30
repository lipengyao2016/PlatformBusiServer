
const _ = require('lodash');
const devUtils = require('develop-utils');

const cabinetBusiness = require('../business/cabinetBusiness');

// 二维码
exports.openCabinetQRCodes = async (ctx, next) => {
    try {
        // utils.checkRequiredParams(this.request.body,['contacts','phone','bookedTime'/*,'placeHref'*/]);

        // let body = ctx.request.body;
        // let params = ctx.params;
        let query = ctx.request.query;

        let {cabinetNumber,boxNumber} = query;

        let ret = await cabinetBusiness.genOpenCabinetQRCodes(cabinetNumber,boxNumber);
        ctx.body = ret;
        ctx.status = 200;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
    }
};
// 注册柜子
exports.registerCabinet = async (ctx, next)=>{
    try {
        // utils.checkRequiredParams(this.request.body,['contacts','phone','bookedTime'/*,'placeHref'*/]);

        let body = ctx.request.body;
        // let params = ctx.params;
        // let query = ctx.request.query;

        let {cabinetNumber, registrationId,boxCount=0,usedCount=0,address='深圳市宝安区创业二路创锦一号'} = body;

        let ret = await cabinetBusiness.register(cabinetNumber, registrationId,{boxCount,usedCount,address});
        ctx.body = ret;
        ctx.status = 201;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
    }
};

exports.scanQRCodeOpenBox = async (ctx, next)=>{
    try {
        // utils.checkRequiredParams(this.request.body,['contacts','phone','bookedTime'/*,'placeHref'*/]);

        let body = ctx.request.body;
        let params = ctx.params;
        let query = ctx.request.query;

        let {weixinNumber,openId,QRCodeData} = body;

        let ret = await cabinetBusiness.scanQRCodeOpenBox(weixinNumber,openId,QRCodeData);
        ctx.body = ret;
        ctx.status = 200;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
    }
};
exports.openAllBoxes = async (ctx, next)=>{
    try {
        // utils.checkRequiredParams(this.request.body,['contacts','phone','bookedTime'/*,'placeHref'*/]);

        let body = ctx.request.body;
        let params = ctx.params;
        let query = ctx.request.query;

        let {cabinetNumber} = body;

        let ret = await cabinetBusiness.openAllBoxes(cabinetNumber);
        ctx.body = ret;
        ctx.status = 200;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
    }
};

exports.uploadCabinetStatus = async (ctx, next)=>{
    try {
        // utils.checkRequiredParams(this.request.body,['contacts','phone','bookedTime'/*,'placeHref'*/]);

        let body = ctx.request.body;
        let params = ctx.params;
        let query = ctx.request.query;

        let {cabinetNumber, boxCount=0,usedCount=0} = body;

        let ret = await cabinetBusiness.uploadCabinetStatus({number:cabinetNumber, boxCount,usedCount});
        ctx.body = ret;
        ctx.status = 200;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
    }
};
exports.listByUserUUID = async (ctx, next)=>{
    try {
        // utils.checkRequiredParams(this.request.body,['contacts','phone','bookedTime'/*,'placeHref'*/]);

        let body = ctx.request.body;
        let params = ctx.params;
        let query = ctx.request.query;

        let userUUID = params.userUUID;

        let ret = await cabinetBusiness.listByUserUUID(userUUID,query);
        ctx.body = ret;
        ctx.status = 200;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
    }
};
