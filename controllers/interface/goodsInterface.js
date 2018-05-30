
const _ = require('lodash');
const devUtils = require('develop-utils');

const goodsBusiness = require('../business/goodsBusiness');

const jwtTokenResource = require('../../common/jwtTokenResource');

const strUtils = require('../../common/strUtils');

const config = require('../../config/config');

const verify = require('develop-utils').verify;
const goodPackageBusiness = require('../business/goodPackageBusiness');


exports.sortGoods = async (ctx, next) => {

    let body = _.clone(ctx.request.body);

    try {

        /** 2018/4/26  暂时屏蔽签名校验。
         lpy-modifyed  */
            // verify(body.sign,config.signKey,body);

         let params = ctx.params;
         let query = ctx.request.query;

         if(_.isString(body.goods))
         {
             console.log(' sortGoods Api body.goods is str ,will convert to array!!!');
            /* body.goods = strUtils.parseArrayStr(body.goods);
             body.goods.map(goods=>{
                 goods.weight = parseFloat(goods.weight);
             })*/
            body.goods = JSON.parse(body.goods);
         }

         //jwtTokenResource.setTokenMerchantData(ctx,body);

         let ret = await goodsBusiness.sortGoods(body);
         let retObj = {packageId:body.packageId};
         if(ret)
         {
             let goodsPackageDetailRes = await  goodPackageBusiness.getPackageDetails(body.packageId);
             retObj.retCode = 'success';
             retObj.customerName = goodsPackageDetailRes.goodsPackage.delivery.name;
             retObj.statistics = goodsPackageDetailRes.total;
         }
         else
         {
             retObj.retCode = 'failed';
         }

         ctx.body = retObj;
         ctx.status = 200;
    }
    catch (e) {
        devUtils.handlerError(ctx, e);
        ctx.body.packageId = body.packageId;
    }
};


