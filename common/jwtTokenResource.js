/**
 * Created by licp on 2016-11-17.
 */
const _ = require('lodash');
const utils = require('componet-service-framework').utils;

exports.setTokenMerchantData=function(context,data)
{
    if( !data.merchantHref )
    {
        let tokenData = context.jwt;
        if(tokenData && tokenData.merchant)
        {
            let merchantHref = tokenData.merchant.href;
            console.log('setTokenMerchantData jwt method:' + context.method +
                ' token url:' + utils.getUrlPath(context.originalUrl) + ' merchantHref:' + merchantHref);
            data.merchantHref = merchantHref;
        }
    }
}

exports.setTokenUserData=function(context,data)
{
    if(  !data.userHref )
    {
        let tokenData = context.jwt;
        if(tokenData && tokenData.user)
        {
            let userHref = tokenData.user.href;
            console.log('setTokenUserData jwt method:' + context.method +
                ' token url:' + utils.getUrlPath(context.originalUrl) + ' userHref:' + userHref);
            data.userHref = userHref;
        }
    }
}


exports.setCreaterFromDataAuthorityJwt = function (context, authorityUUID, data) {
    let tokenData = context.jwt;
    if (tokenData && tokenData.role && tokenData.role.dataAuthoritys && tokenData.role.dataAuthoritys.length > 0) {
        let authorityObj = _.find(tokenData.role.dataAuthoritys, item => _.isEqual(item.uuid, authorityUUID));

        console.log('getDataAuthorityFromJwt jwt method:' + context.method +
            ' authorityUUID:' + authorityUUID);

        /** 2017/3/1  如果权限等级不存在或者小于等于0，则只能看自身，那就都只取自身的数据。
         * 如果权限等级大于0，则可以看全部的数据。
         lpy-modifyed  */
        if (authorityObj && authorityObj.grade > 0) {
            console.log('getDataAuthorityFromJwt authority is max 1,will look all data,grade:', authorityObj.grade);
            data.hasCarOwnerAuthority = 1;
        }
        else {
            console.log('getDataAuthorityFromJwt not found authority,or grade is 0,will look self data!!');
            data.hasCarOwnerAuthority = 0;
          /*  if (!data.creater && tokenData.user && tokenData.user.name) {
                data.creater = tokenData.user.name;
            }*/
        }

    }
}
