const _ = require('lodash');
const utils = require('componet-service-framework').utils;
const devUtils = require('develop-utils');
const ResourceType = require('../proxy/baseProxyFactory').ResourceType;
const menuProxy = require('../proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_Menu);
const request = require('common-request').request;
const config = require('../../config/config');
const userProxy = require('../proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_Users);
const accountProxy = require('../proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_Accounts);
const DistritubeExtraTranction = require('componet-service-framework').distritubeExtraTranction;


class UserBusiness{
    constructor(){}

    async registerUser(userData,accountData)
    {
        console.log('UserBusiness->registerUser  accountData :', accountData);

        let disTran = new DistritubeExtraTranction();

        let retObj = {};
        try
        {
            let accountObj = await accountProxy.execute('signup',accountData,'POST');
            disTran.addSingleFaileReq(accountObj.href,{},disTran.getHttpMethod().httpDelete);

            retObj.account = accountObj;

            userData.accountHref = accountObj.href;
            let userObj = await userProxy.create(userData,disTran);

            retObj.user = userObj;
            console.log('UserBusiness->registerUser  success ');
        }
        catch (e) {
            console.log('UserBusiness->registerUser error,will rollback:', e);
            await disTran.rollBack();
            throw  e;
        }

        return retObj;
    }



}

let userBusiness= new UserBusiness();
module.exports = userBusiness;

