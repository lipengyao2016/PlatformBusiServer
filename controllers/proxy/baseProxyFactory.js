const BaseProxy = require('./baseProxy');
const resourceURI = require('../resource/resourceURI');
const URIParser = resourceURI.v1;
const config = require('../../config/config');

let ResourceType =
    {
        Resource_Menu:0,
/*        Resource_GoodsType:1,
        Resource_Goods:2,
        Resource_SortRecords:3,
        Resource_DeliveryOrders:4,*/
    };


let proxyResourceMap = [
    {
        name:'menus',
        index:ResourceType.Resource_Menu,
        serverIndex:config.serverIndexs.Menu_Server,
    },
    /*{
        name:'goodsTypes',
        index:ResourceType.Resource_GoodsType,
        serverIndex:config.serverIndexs.Goods_Server,
    },
    {
        name:'goods',
        index:ResourceType.Resource_Goods,
        serverIndex:config.serverIndexs.Goods_Server,
    },
    {
        name:'sortedRecords',
        index:ResourceType.Resource_SortRecords,
        serverIndex:config.serverIndexs.Goods_Server,
    },

    {
        name:'deliveryOrders',
        index:ResourceType.Resource_DeliveryOrders,
        serverIndex:config.serverIndexs.DeliveryOrder_Server,
    },*/

];

let resourceProxys = {};

proxyResourceMap.map(proxyResource=>{
    let proxy = new BaseProxy(proxyResource.name,proxyResource.serverIndex);
    resourceProxys[proxyResource.index] = proxy;
});


function getResourceProxy(type) {
      return resourceProxys[type];
}


exports.getResourceProxy = getResourceProxy;
exports.ResourceType = ResourceType;