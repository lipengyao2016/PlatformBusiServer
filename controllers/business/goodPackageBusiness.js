const _ = require('lodash');
const utils = require('componet-service-framework').utils;
const DirectoryType = require('../proxy/directoryProxyFactory').DirectoryType;
const goodsDirectoryProxy = require('../proxy/directoryProxyFactory').getDirectory(DirectoryType.Dir_Good);
const devUtils = require('develop-utils');
const ResourceType = require('../proxy/baseProxyFactory').ResourceType;
const goodsPackageProxy = require('../proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_GoodsPackage);

const goodsTypeProxy = require('../proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_GoodsType);
const goodsProxy = require('../proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_Goods);
const sortRecordsProxy = require('../proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_SortRecords);

class GoodPackageBusiness{
    constructor(){}

    buildPackageId(cardTypeNO)
    {

        let dateTimestamp = new Date().getTime() + '';
        console.log('dateTime:' + dateTimestamp);

        let rand = _.pad(_.random(0,999),3,'0');
        console.log('rand:'+rand);

        let dateStr =  dateTimestamp.substring(1)+rand;

        return cardTypeNO ? cardTypeNO : '2' + dateStr;
    }

    async createGoodPackages(data){
        if(data.merchantHref)
        {
            let directoryUrl =await goodsDirectoryProxy.checkDirectory(data.merchantHref);
            if(!directoryUrl)
            {
                console.error('createGoodPackages directory is null!!!');
                devUtils.Error('Error',404,1599,`no goodsdirectory find by ${data.merchantHref}`);
            }
            delete data.merchantHref;
            data.directoryUUID = utils.getLastResourceUUIDInURL(directoryUrl);
        }

        if(_.isEmpty(data.packageId))
        {
            data.packageId = this.buildPackageId();
        }

        let goodPackageData  = await  goodsPackageProxy.create(data);
        return goodPackageData;
    }


    async listGoodPackages(qs){
        if(qs.merchantHref)
        {
            let directoryUrl =await goodsDirectoryProxy.getDirectoryByHref(qs.merchantHref);
            if(!directoryUrl)
            {
                console.error('createGoodPackages directory is null!!!');
                devUtils.Error('Error',404,1599,`no goodsdirectory find by ${qs.merchantHref}`);
            }
            delete qs.merchantHref;
            qs.directoryUUID = utils.getLastResourceUUIDInURL(directoryUrl);
        }

        let goodPackageData  = await  goodsPackageProxy.list(qs);
        return goodPackageData;
    }


    async getPackageDetails(packageId)
    {
        if(_.isEmpty(packageId))
        {
            console.error('getPackageDetails packageId  is null!!!');
            devUtils.Error('Error',404,1599,`no packageid: ${packageId}  `);
        }

        /** 2018/4/23  检查包裹是否存在。
         lpy-modifyed  */
        let goodsPackageRet =await goodsPackageProxy.list({packageId:packageId,expand:'delivery'});
        if(goodsPackageRet.items.length <= 0)
        {
            console.error('sortGoods packageId not found !!!');
            devUtils.Error('Error',404,1599,` packageid: ${packageId} not found `);
        }

        let goodsPackageObj = goodsPackageRet.items[0];
        console.log('sortGoods find goodsPackage goodsPackageObj:',JSON.stringify(goodsPackageObj,null,2));

        let goodsPackageUUID = utils.getLastResourceUUIDInURL(goodsPackageObj.href);

        let goodsTypeRet = await goodsTypeProxy.listAll();
        if(goodsTypeRet.items.length <= 0)
        {
            console.error('sortGoods goodsTypeIds not found !!!');
            devUtils.Error('Error',404,1599,` goodsTypeIds: not found `);
        }

        let goodsTypeUUIDObj = {};
        goodsTypeRet.items.map(goodsTypeItem=>{
            let goodTypeUUID = utils.getLastResourceUUIDInURL(goodsTypeItem.href);
            if(_.isEmpty(goodsTypeUUIDObj[goodTypeUUID]))
            {
                goodsTypeUUIDObj[goodTypeUUID] = goodsTypeItem;
            }
        });

        let sortRecordRet = await sortRecordsProxy.listAll({goodsPackageUUID:goodsPackageUUID});

        let retObj = {};

        let goodsRet = await  goodsProxy.listAll({goodsPackageUUID:goodsPackageUUID});
        let goodsLists = goodsRet.items.map(goodItem=>{
            let goodsTypeUUID = utils.getLastResourceUUIDInURL(goodItem.goodsType.href);
            return {
                type : goodsTypeUUIDObj[goodsTypeUUID].typeCode,
                weight:goodItem.weight,
            };
        });

        let goodsItemByTypes = _.groupBy(goodsLists,'type');

        let totalWeight = 0.0;
        let goodsDetails = _.keys(goodsItemByTypes).map(type=>{
            let sumWeight = goodsItemByTypes[type].reduce((c,s)=>c+s.weight,0).toFixed(4);
            totalWeight = (totalWeight + parseFloat(sumWeight));
            return {type,sumWeight:parseFloat(sumWeight)};
        });

        retObj.goodsPackage = goodsPackageObj;
        retObj.sortedRecords = sortRecordRet.items;
        retObj.goods = goodsRet.items;
        retObj.total = {
             sortRecordCnt:sortRecordRet.items.length,
             totalWeight:parseFloat(new Number(totalWeight).toFixed(4)),
             details:goodsDetails,
        };
        return retObj;
    }

}

let goodPackageBusiness= new GoodPackageBusiness();
module.exports = goodPackageBusiness;

