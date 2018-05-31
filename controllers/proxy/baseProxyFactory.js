const BaseProxy = require('./baseProxy');
const resourceURI = require('../resource/resourceURI');
const URIParser = resourceURI.v1;
const config = require('../../config/config');

let ResourceType =
    {
        Resource_Menu:0,
        Resource_Merchant:1,
        Resource_Applications:2,
        Resource_MenuGroups:3,
        Resource_Roles:4,
        Resource_Users:5,
        Resource_Accounts:6,
    };


let proxyResourceMap = [
    {
        name:'menus',
        index:ResourceType.Resource_Menu,
        serverIndex:config.serverIndexs.Menu_Server,
    },
    {
        name:'merchants',
        index:ResourceType.Resource_Merchant,
        serverIndex:config.serverIndexs.Merchant_Server,
    },
      {
          name:'applications',
          index:ResourceType.Resource_Applications,
          serverIndex:config.serverIndexs.Account_Server,
      },
      {
          name:'menuGroups',
          index:ResourceType.Resource_MenuGroups,
          serverIndex:config.serverIndexs.Menu_Server,
      },

      {
          name:'roles',
          index:ResourceType.Resource_Roles,
          serverIndex:config.serverIndexs.Role_Server,
      },

    {
        name:'users',
        index:ResourceType.Resource_Users,
        serverIndex:config.serverIndexs.User_Server,
    },

    {
        name:'accounts',
        index:ResourceType.Resource_Accounts,
        serverIndex:config.serverIndexs.Account_Server,
    },

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