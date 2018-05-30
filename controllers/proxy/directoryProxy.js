/**
 * Created by licp on 2016-10-13.
 */

"use strict";
const config = require('../../config/config');
const request = require('common-request').request;
const utils = require('componet-service-framework').utils;
const _ = require('lodash');

const url = require('url');
const merchantService = require('./merchantProxy');


class DirectoryProxy {
    constructor(directoryUrl) {
        this.DirectoryURL = directoryUrl;
        console.log('DirectoryService constructor DirectoryURL:' + this.DirectoryURL);
    };

    async getDirectoryByHref(merchantHref)
    {
        let   merchantUUID = utils.getResourceUUIDInURL(merchantHref,'merchants');
        return await this.getDirectory(merchantUUID);
    }


    async getDirectory(merchantUUID)
    {
        let qs = {
            merchantUUID :  merchantUUID
        };
        let userOragzList =  await request.get(this.DirectoryURL,qs);
        let userResult = userOragzList.body;
        if(userResult && userResult.items && userResult.items.length > 0)
        {
            return userResult.items[0].href;
        }
        return null;
    }

    async createDirectory(merchantURL)
    {
        /** 2017/2/15   判断只有当商户链接是正常的URL时，才能创建目录。
         lpy-modifyed  */
        let urlParse = url.parse(merchantURL);
        if(urlParse && urlParse.protocol)
        {
            let   merchantUUID = utils.getResourceUUIDInURL(merchantURL,'merchants');

            let qs = {
                name: merchantUUID + '_Directory',
                merchantHref:merchantURL,
            };
            let userOragzList =  await request.post(this.DirectoryURL,qs);
            let userResult = userOragzList.body;
            if(userResult && userResult.href)
            {
                return userResult.href;
            }
        }
        else
        {
            return null;
        }

    }


    async getAllDirectorys(merchantURL)
    {
        if(merchantURL.indexOf('?') >= 0)
        {
            merchantURL = utils.getSubStrs(merchantURL,'http://', '?');
        }
        let subMerchantRes = await merchantService.getSubMerchants(merchantURL);
        if(!subMerchantRes || subMerchantRes.length <= 0)
        {
            console.log('CarService -> getAllDirectorys found sub merchants failed!!');
            return null;
        }
        else
        {
            return await this.getDirectoryUUIDsByMerchantList(subMerchantRes);
        }

    }


    async checkDirectory(merchantURL) {
        /** 2017/2/20  滤掉查询字符串。
         lpy-modifyed  */
        if (merchantURL.indexOf('?') >= 0) {
            merchantURL = utils.getSubStrs(merchantURL,'http://', '?');
        }

        let merchantUUID = utils.getResourceUUIDInURL(merchantURL, 'merchants');
        if (!merchantUUID) {
            console.log('CarService -> checkDirectory merchantUUID is null!!');
            return null;
        }
        let DirectoryURL = await this.getDirectory(merchantUUID);
        if (!DirectoryURL) {
            console.log('CarService -> checkDirectory not fund DirectoryURL!!!');
            DirectoryURL = await  this.createDirectory(merchantURL);
            console.log('CarService -> checkDirectory create DirectoryURL:', DirectoryURL);
        }
        return DirectoryURL;

    }

    async getDirectoryList(merchantURLs)
    {
        let qs = {
            merchantURL : merchantURLs,
        };
        let customDirectoryRes =  await request.get(this.DirectoryURL,qs);
        if(customDirectoryRes.res.statusCode == 200)
        {
            return customDirectoryRes.body;
        }
        else
        {
            return null;
        }
    }

    async getDirectoryUUIDsByMerchantList(merchantURLs)
    {
        let customDirectUUIDs = [];
        let  customDirectoryResult = await this.getDirectoryList(merchantURLs);
        if(customDirectoryResult && customDirectoryResult.items.length > 0)
        {
            customDirectUUIDs = customDirectoryResult.items.map(customDirectItem=>{
               let directUUID = utils.getResourceUUIDInURL(customDirectItem.href,'adviserDirectorys');
                return directUUID;
           });
        }
        return customDirectUUIDs;
    }

    async getQueryURL(query,globalURL,directFunc)
    {
        let queryURL;
        let isGetSubData = ( query.hasOwnProperty('isGetSubData')  && query.isGetSubData == 1) ? true : false;

        if(isGetSubData && !query.merchantHref)
        {
            console.log('DirectoryService-> getQueryURL error for  isGetSubData && !query.merchantHref!!!');
            return null;
        }

        if(!query.merchantHref || isGetSubData)
        {
            queryURL = globalURL;
            if(isGetSubData)
            {
                let directUUIDS = await this.getAllDirectorys(query.merchantHref);
                if(directUUIDS.length <= 0)
                {
                    directUUIDS.push('unknown directory UUID');
                }
                query.directoryUUID = directUUIDS;
            }
        }
        else
        {
            let merchantHref = query.merchantHref;
            let CarWorkOrderDirectoryURL = await this.checkDirectory(merchantHref);
            if(!CarWorkOrderDirectoryURL)
            {
                console.log('DirectoryService->  getQueryURL error for  directoryURL!!!');
                return null;
            }
            delete query.merchantHref;
            queryURL = directFunc.call(this,CarWorkOrderDirectoryURL);
        }
        return queryURL;
    }

}
module.exports = DirectoryProxy;