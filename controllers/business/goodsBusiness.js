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
const DistritubeExtraTranction = require('componet-service-framework').distritubeExtraTranction;

const deliveryOrdersProxy = require('../proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_DeliveryOrders);





class GoodsBusiness{
    constructor(){}

    async sortGoods(data){

        console.log('GoodsBusiness->sortGoods  begin packageId:', data.packageId);

        let disTran = new DistritubeExtraTranction();

        if(_.isEmpty(data.packageId) || !_.isArray(data.goods) || (_.isArray(data.goods) && data.goods.length <= 0))
        {
            console.error('sortGoods packageId or goods is null!!!');
            devUtils.Error('Error',404,1599,`no packageid: ${data.packageId} or goods :${data.goods} `);
        }

        /** 2018/4/23  检查包裹是否存在。
         lpy-modifyed  */
        let goodsPackageRet =await goodsPackageProxy.list({packageId:data.packageId});
        if(goodsPackageRet.items.length <= 0)
        {
            console.error('sortGoods packageId not found !!!');
            devUtils.Error('Error',404,1599,` packageid: ${data.packageId} not found `);
        }

        let goodsPackageObj = goodsPackageRet.items[0];
        console.log('sortGoods find goodsPackage goodsPackageObj:',JSON.stringify(goodsPackageObj,null,2));

        /** 2018/4/26   不能判断包裹分拣状态，因为一个包裹可能多次分拣。
         lpy-modifyed  */
        /*        if(goodsPackageObj.status == 'sorted')
                {
                    console.error('sortGoods packageId has been sorted !!!,');
                    devUtils.Error('Error',404,5000,` packageid: ${data.packageId} has been sorted `);
                }*/

        let goodsPackageUUID = utils.getLastResourceUUIDInURL(goodsPackageObj.href);

        /** 2018/4/23  检查包裹订单是否存在。
         lpy-modifyed  */
        let deliveryOrderRet =await deliveryOrdersProxy.list({goodsPackageUUID:goodsPackageUUID});
        if(deliveryOrderRet.items.length <= 0 )
        {
            console.error('sortGoods deliveryOrder not found !!!');
            devUtils.Error('Error',404,1599,` packageid: ${data.packageId} deliveryOrder not found `);
        }
        let deliveryOrderObj = deliveryOrderRet.items[0];
        console.log('sortGoods find deliveryOrder deliveryOrderObj:',JSON.stringify(deliveryOrderObj,null,2));

        /** 2018/4/26  不能判断投递单分拣状态，因为一个包裹可能多次分拣。
         lpy-modifyed  */
        /*        if(deliveryOrderObj.status == 'sorted' && deliveryOrderObj.status == 'commented')
                {
                    console.error('sortGoods packageId deliveryOrder has been sorted !!!');
                    devUtils.Error('Error',404,5000,` packageid: ${data.packageId} deliveryOrder has been sorted `);
                }*/

        /** 2018/4/23  检查货物类型是否合法。
         lpy-modifyed  */
        let goodsTypeIds = [];
        data.goods.map(good=>{
            if(goodsTypeIds.indexOf(good.type) < 0)
            {
                goodsTypeIds.push(good.type);
            }
        });

        let goodsTypeRet = await goodsTypeProxy.list({typeCode:goodsTypeIds});
        if(goodsTypeRet.items.length < goodsTypeIds.length)
        {
            console.error('sortGoods goodsTypeIds not found !!!');
            devUtils.Error('Error',404,1599,` goodsTypeIds: ${goodsTypeIds} not found `);
        }

        let goodsTypeObj = {};
        goodsTypeRet.items.map(goodsTypeItem=>{
            if(_.isEmpty(goodsTypeObj[goodsTypeItem.typeCode]))
            {
                goodsTypeObj[goodsTypeItem.typeCode] = goodsTypeItem;
            }
        });

        let retObj = {};

        try
        {
            let sortRecords = {
                sortedAddress: data.sortedAddress,
                sortedOperator: data.sortedOperator,
                sortedAt: data.sortedAt,
                sortedPlace: data.sortedPlace,
                goodsPackageUUID:goodsPackageUUID,
            };
            let sortRecordCreatesRet = await sortRecordsProxy.create(sortRecords,disTran);
            let sortRecordHref = sortRecordCreatesRet.href;
            console.log('GoodsBusiness->sortGoods  create sortRecords success sortRecordHref:'+sortRecordHref);


            /** 2018/4/23  批量创建货物。
             lpy-modifyed  */
            let goodsData = data.goods.map(gdItem=>{
                let singleItem = {
                    goodsTypeHref: goodsTypeObj[gdItem.type].href,
                    weight: gdItem.weight,
                    cost: (gdItem.weight*goodsTypeObj[gdItem.type].costRadio).toFixed(2) ,
                    carbin:(gdItem.weight*goodsTypeObj[gdItem.type].carbinRadio).toFixed(2) ,
                    water: (gdItem.weight*goodsTypeObj[gdItem.type].waterRadio).toFixed(2),
                    goodsPackageUUID:goodsPackageUUID,
                    name: goodsTypeObj[gdItem.type].name,
                    sortedRecordHref:sortRecordHref,
                };

                return singleItem;
            });

            console.log('GoodsBusiness->sortGoods will create goods goodsData:',
                JSON.stringify(goodsData,null,2));

            let goodsDataCreateRet = await goodsProxy.batchCreate(goodsData,disTran);
            if(goodsDataCreateRet.length < data.goods.length)
            {
                console.error('sortGoods batchCreate goods error !!!');
                devUtils.Error('Error',404,5000,` goodsTypeIds: ${goodsData} create error `);
            }


            console.log('GoodsBusiness->sortGoods  create goods success goodsDataRet:');

            if(goodsPackageObj.status != 'sorted')
            {
                let updateGoodsPackageStatusRes = await goodsPackageProxy.update(goodsPackageObj.href,{status:'sorted'},
                    disTran,{status:'created'});
                console.log('GoodsBusiness->sortGoods  update goods package status updateGoodsPackageStatusRes:');
            }


            /** 2018/4/23  修改投递单状态。
             lpy-modifyed  */
            let updateDeliveryStatusRes = await deliveryOrdersProxy.update(deliveryOrderObj.href + '/updateStatus',
                {
                    status:'sorted',
                    "remark" : "货物分拣",
                    "data": sortRecords,
                });
           // console.log('GoodsBusiness->sortGoods  update goods package status updateDeliveryStatusRes:');

            console.log('GoodsBusiness->sortGoods  success packageid:',data.packageId);
        }
        catch (e) {
            console.log('GoodsBusiness->sortGoods error,will rollback:', e);
            await disTran.rollBack();
            throw  e;
        }

/*        return {
            packageId:data.packageId,
            retCode:'success',
        };*/

        return true;
        

    }







}

let goodsBusiness= new GoodsBusiness();
module.exports = goodsBusiness;

