/**
 * Created by Administrator on 2017/2/20.
 */
"use strict";
const request = require('common-request').request;
const _ = require('lodash');


class MerchantProxy {
    constructor() {

    };

    fillMerchantHref(merchantObj,subMerchants)
    {
        if(merchantObj.items && merchantObj.items.length > 0)
        {
            merchantObj.items.map(singleMerchant=>{
                subMerchants.push(singleMerchant.href);
                this.fillMerchantHref(singleMerchant.subMerchants,subMerchants);
            });
        }
    }

    async getSubMerchants(merchantHref)
    {
        let qs = {expand:'{subMerchants}'};

        /*{statusCode,body,headers,request}*/

        let ret = await request.get(merchantHref,qs);
        if(ret.statusCode == 200)
        {
            let merchantRes =  ret.body;
            let subMerchants = [];
            subMerchants.push(merchantHref);
            this.fillMerchantHref(merchantRes.subMerchants,subMerchants);
            return subMerchants;
        }
        else
        {
            console.log('MerchantService-->getSubMerchants err:',ret.body);
            return null;
        }
    }

}

let merchantProxy = new MerchantProxy();
module.exports = merchantProxy;