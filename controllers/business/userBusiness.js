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
const resourceURI = require('../resource/resourceURI');
const URIParser = resourceURI.v1;

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

    async deleteUser(userHref)
    {
        console.log('UserBusiness->deleteUser  userHref :',userHref );
        let userRet = await request.get(userHref,{expand:'account'});
        if(userRet.statusCode != 200)
        {
            console.error('deleteUser get user data error!!!',userHref);
            devUtils.Error('Error',404,1599,`get user data error: ${userHref}  `);
        }
        let accountHref = userRet.body.account.href;

        let accountObj = userRet.body.account;

        let disTran = new DistritubeExtraTranction();

        let retObj = {};
        try
        {
            if(accountHref)
            {
                let accountRet = await request.delete(accountHref);
                if(accountRet.statusCode != 204)
                {
                    console.error('deleteUser delete account error!!!',accountHref);
                    devUtils.Error('Error',404,1599,` delete account error: ${accountHref}  `);
                }
                let accountUrl = URIParser.baseResourcesURI(config.serverIndexs.Account_Server,'accounts');
                disTran.addSingleFaileReq(accountUrl,{
                    uuid:devUtils.getLastResourceUUIDInURL(accountObj.href),
                    merchantNumber: accountObj.merchantNumber,
                    name: accountObj.name,
                    number: accountObj.number,
                    mobile: accountObj.mobile,
                    email: accountObj.email,
                    applicationHref:accountObj.application.href,
                },disTran.getHttpMethod().httpCreate);
            }

            let userRet = await request.delete(userHref);
            if(userRet.statusCode != 204)
            {
                console.error('deleteUser delete user error!!!',userHref);
                devUtils.Error('Error',404,1599,` delete user error: ${userHref}  `);
            }
            console.log('UserBusiness->deleteUser  success ');
        }
        catch (e) {
            console.log('UserBusiness->deleteUser error,will rollback:', e);
            await disTran.rollBack();
            throw  e;
        }

        return true;
    }



}

let userBusiness= new UserBusiness();
module.exports = userBusiness;

