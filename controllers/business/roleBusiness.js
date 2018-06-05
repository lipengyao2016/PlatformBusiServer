const _ = require('lodash');
const utils = require('componet-service-framework').utils;
const devUtils = require('develop-utils');
const ResourceType = require('../proxy/baseProxyFactory').ResourceType;
const menuProxy = require('../proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_Menu);
const request = require('common-request').request;
const config = require('../../config/config');
const menuBusiness = require('./menuBusiness');
const resourceURI = require('../resource/resourceURI');
const URIParser = resourceURI.v1;
const roleProxy = require('../proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_Roles);

class RoleBusiness{
    constructor(){}

    async getRoleDetails(roleHref,applicationHref)
    {
        if(_.isEmpty(roleHref) || _.isEmpty(applicationHref))
        {
            console.error('getRoleDetails no roleHref ,or applicationHref!!!');
            devUtils.Error('Error',404,1599,`no roleHref: ${roleHref} or applicationHref :${applicationHref} `);
        }
        let roleUUID = devUtils.getResourceUUIDInURL(roleHref,'roles');
        let bPlatAdmin = roleUUID == config.platDevMerchantRoleUUID;
        let applicationUUID = devUtils.getResourceUUIDInURL(applicationHref,'applications');

        let roleRet = await request.get(roleHref,{expand:`permissions(limit:100,applicationUUID:${applicationUUID})`});
        if(roleRet.statusCode != 200 )
        {
            console.error('getRoleDetails get role data is null!!!');
            devUtils.Error('Error',404,1599,`no role permission data roleHref: ${roleHref} `);
        }
        let roleData = roleRet.body;
        let roleObj = roleData;
        let permissions = roleObj.permissions;
        delete roleObj.permissions;

        let menuObj = await menuProxy.execute('treeMenus',{applicationHref});
        if(bPlatAdmin)
        {
            roleObj.subMenuGroups = menuObj.subMenuGroups;
        }
        else
        {
            let permissonData = this.convertPermissions(permissions.items);
            if(permissonData.menus.length > 0)
            {
                menuBusiness.filterMenuList(menuObj,permissonData.menus,permissonData.operators);
                roleObj.subMenuGroups = menuObj.subMenuGroups;
            }
            else
            {
                roleObj.subMenuGroups = [];
            }
        }

        return roleObj;
    }

    convertPermissions(permissions)
    {
        let roleMenuHref = [];
        let roleOperatorHrefs = [];
        permissions.map(permissionItem =>
        {
            let objectUUID = devUtils.getLastResourceUUIDInURL(permissionItem.object.href);
            if(permissionItem.objectType == 'menu')
            {
                if (!_.find(roleMenuHref, item => _.isEqual(item, objectUUID))) {
                    roleMenuHref.push(objectUUID);
                    console.log('convertPermissonToMenuOperator  push menu permisson  objectUUID:' + objectUUID);
                }
            }
            else  if(permissionItem.objectType == 'operator')
            {
                if (!_.find(roleOperatorHrefs, item => _.isEqual(item, objectUUID))) {
                    roleOperatorHrefs.push(objectUUID);
                    console.log('convertPermissonToMenuOperator  push operator permisson  objectUUID:' + objectUUID);
                }
            }
        });

        return {
            menus:      roleMenuHref,
            operators:  roleOperatorHrefs,
        };
    }

    convertObjectUUIDToHref(permissions)
    {
        let menuUrl = URIParser.baseResourcesURI(config.serverIndexs.Menu_Server,'menus');
        let operatorUrl = URIParser.baseResourcesURI(config.serverIndexs.Menu_Server,'operators');
        permissions.map(permissionItem=>{
            if(permissionItem.objectUUID && !permissionItem.objectHref)
            {
                if(permissionItem.objectType =='menu')
                {
                    permissionItem.objectHref = `${menuUrl}/${permissionItem.objectUUID}`;
                }
                else if(permissionItem.objectType =='operator')
                {
                    permissionItem.objectHref = `${operatorUrl}/${permissionItem.objectUUID}`;
                }
                delete permissionItem.objectUUID;
            }
        });
    }


    async create(data)
    {
        this.convertObjectUUIDToHref(data.permissions);
        let roleObj =await roleProxy.create(data);
        return roleObj;
    }

    async update(roleUUID,data)
    {
        this.convertObjectUUIDToHref(data.permissions);
        let roleObj =await roleProxy.execute(`roles/${roleUUID}`,data,'POST');
        return roleObj;
    }

}

let roleBusiness= new RoleBusiness();
module.exports = roleBusiness;

