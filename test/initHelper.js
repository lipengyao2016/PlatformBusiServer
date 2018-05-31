const _ = require('lodash');
const utils = require('componet-service-framework').utils;
const devUtils = require('develop-utils');
const ResourceType = require('../controllers/proxy/baseProxyFactory').ResourceType;
const merchantProxy = require('../controllers/proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_Merchant);
const request = require('common-request').request;
const config = require('../config/config');
const applicationProxy = require('../controllers/proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_Applications);
const menuGroupProxy = require('../controllers/proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_MenuGroups);
const menuProxy = require('../controllers/proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_Menu);

const roleProxy = require('../controllers/proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_Roles);
const accountProxy = require('../controllers/proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_Accounts);
const userProxy = require('../controllers/proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_Users);


class InitHelper{
    constructor(){
        this.initData = {
            merchant: {
                name:'平台开发商',
            },
            application:{
                name:'LaiKoo-Platform',
            },
            menu:{
              group: [
                  {
                      name:'平台管理',
                      uiOrder:0,
                      subMenus:[
                          {
                              name: '菜单管理',
                              menuId: '5350A6A5-F274-4CCE-AD2A-866D04579CE8',
                              uiOrder:0,
                          },
                          {
                              name: '角色管理',
                              menuId: '28D504B6-91A8-45AF-AD4B-09A9B55EADDB',
                              uiOrder:1,
                          },
                      ],
                  },
                 ]
            },
            role:{
                 uuid:'GUu4Zz0788NughRrzYh7dw',
                 name:'超级管理员',
            },
            account:{
                "name": "admin",          // 账户名
                "mobile": "13800138000",         // 手机号
                "number": "000001",              // 账户号
                "email": "admin@sina.com",        // 电子邮件
                "password": new Buffer("superadmin").toString('base64'),
            },
            user:{
                name: 'admin',
                email: 'admin@sina.com',
                sex: 'man',
                mobile: '13800138000',
            },
        };
    }

    async init(data)
    {
       let merchantObj = await merchantProxy.create(data.merchant);
       console.log(merchantObj);
       let applicationObj = await applicationProxy.create(data.application);

       for(let i = 0 ;i < data.menu.group.length; i++)
       {
           let groupItem = data.menu.group[i];
           let menuGroupObj = await menuGroupProxy.create({name:groupItem.name,uiOrder:groupItem.uiOrder,
               applicationHref:applicationObj.href});
           for(let j = 0; j < groupItem.subMenus.length;j++)
           {
               let menuItem = groupItem.subMenus[j];
               menuItem.menuGroupHref = menuGroupObj.href;
               let menuObj = await menuProxy.create(menuItem);
           }
       }

       data.role.applicationHref = applicationObj.href;
       data.role.merchantHref=merchantObj.href;
       let roleObj = await roleProxy.create(data.role);

       data.account.applicationName = data.application.name;
       data.account.merchantNumber = merchantObj.number;
       let accountObj = await accountProxy.execute('signup',data.account,'POST');

       data.user.roleHref = roleObj.href;
       data.user.applicationHref=applicationObj.href;
       data.user.merchantHref=merchantObj.href;
       data.user.accountHref = accountObj.href;
        let userObj = await userProxy.create(data.user);
        console.log('init end');


        return userObj;
    }

}

let initHelper= new InitHelper();

initHelper.init(initHelper.initData).then(data=>{
    console.log('end,' + data);
});

