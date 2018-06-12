const _ = require('lodash');
const utils = require('componet-service-framework').utils;
const devUtils = require('develop-utils');

const qs = require('querystring');

const ResourceType = require('../controllers/proxy/baseProxyFactory').ResourceType;
const applicationProxy = require('../controllers/proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_Applications);
const resourceURI = require('../controllers/resource/resourceURI');
const URIParser = resourceURI.v1;
const config = require('../config/config');



async function convertApplicationNameToHref(data)
{
    if( data.applicationName)
    {
        let applicationObj = await  applicationProxy.list({name: `${data.applicationName}`});
        if(applicationObj.items.length > 0)
        {
            data.applicationHref = applicationObj.items[0].href;
        }
        else
        {
            data.applicationHref = 'http://unknown:6000/***/****/unknown/unknownUUID';
        }
        delete  data.applicationName;
    }

    return data.applicationHref;
}


async function convertOwnerUUIDToHref(data)
{
    let ownerHref = data.ownerHref;
    if( (data.ownerType && data.ownerUUID) )
    {
        if(data.ownerType == 'businessFormat')
        {
            data.ownerHref = URIParser.baseResourcesURI(config.serverIndexs.Shop_Server,'businessFormat') + `/${data.ownerUUID}`;
        }
        delete data.ownerType;
        delete data.ownerUUID;
    }

    return data.ownerHref;
}


var ResourceUrlParamMapTable= {
    'menuGroups': {
        convertParams: [
            {
                key: 'applicationName',
                func: convertApplicationNameToHref,
            },
            {
                key: 'ownerUUIDAndType',
                func: convertOwnerUUIDToHref,
            },
        ],
    },
    'treeMenus': {
        convertParams: [
            {
                key: 'applicationName',
                func: convertApplicationNameToHref,
            },
            {
                key: 'ownerUUIDAndType',
                func: convertOwnerUUIDToHref,
            },
        ],
    },
    'metaMenus': {
        convertParams: [
            {
                key: 'applicationName',
                func: convertApplicationNameToHref,
            },
            {
                key: 'ownerUUIDAndType',
                func: convertOwnerUUIDToHref,
            },
        ],
    },

};



class RequestFilter{
    constructor(){

    }

    async convertParams(obj,params)
    {
        for(let i = 0;i< params.length;i++)
        {
            let param = params[i];
            let key = param.key;
            let func = param.func;

            let ret = await func.call(null,obj);
        }

        return obj;
    }

    async filter(ctx){

        let url = ctx.url;

        let path = ctx.path;

        let bMatch = false;
        let convertParams = [] ;

        let pathArrays = path.split('/');
        let action = '';
        if(pathArrays.length > 0)
        {
            action = pathArrays[pathArrays.length-1];
        }

        console.log('RequestFilter->filter  begin path:' + path + ',action:' + action);


        if(ResourceUrlParamMapTable[action])
        {
            bMatch = true;
            convertParams = ResourceUrlParamMapTable[action].convertParams;
        }

        if(bMatch)
        {
            if(ctx.method == 'POST' || ctx.method == 'PUT')
            {
                console.log(`request filter prev body:\n${JSON.stringify(ctx.request.body,null,2)}`);

                await this.convertParams(ctx.request.body,convertParams);
            }
            else if(ctx.method == 'GET' || ctx.method == 'DELETE')
            {
                if(_.isEmpty(ctx.query))
                {
                    ctx.query = {};
                }

                console.log(`request filter prev query:\n${JSON.stringify(ctx.query,null,2)}`);

                ctx.query =  await this.convertParams(ctx.query,convertParams);
            }
        }

        return true;
    }

}

let requestFilter= new RequestFilter();
module.exports = requestFilter;

