/**
 * Created by licp on 2016-10-13.
 */
"use strict";
const config = require('../../config/config');
const _ = require('lodash');
const ResourceType = require('../proxy/baseProxyFactory').ResourceType;
const applicationProxy = require('../proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_Applications);
const menuProxy = require('../proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_Menu);
const menuOrganizationsProxy = require('../proxy/baseProxyFactory').getResourceProxy(ResourceType.Resource_MenuOrganizations);
const utils = require('componet-service-framework').utils;
const devUtils = require('develop-utils');


class MenuBusiness {


    filterOperaotrForMenuItem(menuItem,filterOperatorHrefs)
    {
           let existOperators = [];
           if(menuItem.operators.length > 0 )
           {
               menuItem.operators.map(operatorItem=>
               {
                   if (_.find(filterOperatorHrefs, item => _.isEqual(item, operatorItem.uuid))) {
                       existOperators.push(operatorItem);
                   }
                   else
                   {
                       console.log('filterOperaotrForMenuItem remove not exist operator  name: ' + operatorItem.name);
                   }
               })

               menuItem.operators = existOperators;
           }
    }

    filterMenuGroups(srcMenuGroup,filterMenuHrefs,filterOperatorHrefs,bGetAll)
    {
        //console.log('filterMenuGroups sub menugroup  name: ' + srcMenuGroup.name);

        if(srcMenuGroup.subMenuGroups.length > 0)
        {
            let tempSubMenus = [];
            srcMenuGroup.subMenuGroups.map((menuGroupItem,menuGroupindex) =>
            {
                this.filterMenuGroups( srcMenuGroup.subMenuGroups[menuGroupindex],filterMenuHrefs,filterOperatorHrefs,bGetAll);
                if( (srcMenuGroup.subMenuGroups[menuGroupindex].menus&&srcMenuGroup.subMenuGroups[menuGroupindex].menus.length > 0 )
                    || srcMenuGroup.subMenuGroups[menuGroupindex].subMenuGroups.length > 0)
                {
                    tempSubMenus.push(srcMenuGroup.subMenuGroups[menuGroupindex]);
                }
                else
                {
                    console.log('filterMenuGroups remove has no menu groups  name: '
                        + srcMenuGroup.subMenuGroups[menuGroupindex].name);
                }
            });

            srcMenuGroup.subMenuGroups = tempSubMenus;
        }


        if(srcMenuGroup.menus && srcMenuGroup.menus.length > 0)
        {
            let ExistShelfMenus = [];
            srcMenuGroup.menus.map((menuItem,menuIndex) =>
                {
                    if(bGetAll)
                    {
                        ExistShelfMenus.push(menuItem);
                    }
                    else
                    {
                        if (_.find(filterMenuHrefs, item => _.isEqual(item, menuItem.uuid))) {

                            this.filterOperaotrForMenuItem(menuItem,filterOperatorHrefs);
                            ExistShelfMenus.push(menuItem);
                        }
                        else
                        {
                            console.log('filterMenuGroups remove not exist menu  name: ' + menuItem.name);
                        }
                    }

                }
            );

            srcMenuGroup.menus = ExistShelfMenus;
        }

    }


    filterMenuList(srcMenulist,filterMenuHrefs,filterOperatorHrefs,bGetAll = false)
    {
        let tempRootMenus = [];
       if(srcMenulist.subMenuGroups.length > 0)
       {

           srcMenulist.subMenuGroups.map( (item,index) =>
           {
              // console.log('filterMenuList first menu list menu name: ' + item.name);
               this.filterMenuGroups(srcMenulist.subMenuGroups[index],filterMenuHrefs,filterOperatorHrefs,bGetAll);
               if(srcMenulist.subMenuGroups[index].subMenuGroups.length > 0 ||
                   (srcMenulist.subMenuGroups[index].menus&&srcMenulist.subMenuGroups[index].menus.length > 0 ) )
               {
                   tempRootMenus.push(srcMenulist.subMenuGroups[index]);
               }
               else
               {
                   console.log('filterMenuGroups remove root menu ,has no menu groups or menus  name: '
                       + srcMenulist.subMenuGroups[index].name);
               }
            }
           )
       }

        srcMenulist.subMenuGroups = tempRootMenus;
        console.log('filterMenuList end.');
    }




    async syncAppMenus(data) {
        let applicationObj = await  applicationProxy.list({name: `*${data.applicationName}*`});
        if (applicationObj.items.length <= 0) {
            console.error('syncAppMenus no  applicationHref for appName!!!');
            devUtils.Error('Error', 404, 1599, `no applicationHref :${data.applicationName} `);
        }

        let applicationHref = applicationObj.items[0].href;

        let applicationUUID = devUtils.getLastResourceUUIDInURL(applicationHref);

        let menuOrganizationsObj = await menuOrganizationsProxy.list({applicationHref: applicationHref});
        let menuOrganizationUUID;
        let menuOrganizationUpData;


        if (menuOrganizationsObj.items.length <= 0) {

            menuOrganizationsObj = {};
            menuOrganizationUUID = devUtils.createUUID();
            menuOrganizationUpData = {
                uuid: menuOrganizationUUID,
                applicationHref: applicationHref,
                version: data.version,
                bCreated: true,
            };
        }
        else {
            menuOrganizationsObj = menuOrganizationsObj.items[0];
            if (_.isEqual(menuOrganizationsObj.version, data.version)) {
                return {'ret': 'ok', 'status': 'unChange'};
            }
            else {
                menuOrganizationUUID = devUtils.getLastResourceUUIDInURL(menuOrganizationsObj.href);
                menuOrganizationUpData = {
                    uuid: menuOrganizationUUID,
                    version: data.version,
                    bCreated: false,
                };


            }
        }

        let menuObj = await menuProxy.list({
            menuOrganizationUUID: menuOrganizationUUID
            , expand: 'operators'
        });


        let oldMenus = [], oldOperators = [];

        /** 2018/6/4  产生当前系统的菜单和数组列表。
         lpy-modifyed  */
        let orginMenuData = menuObj.items.map(menuItem => {
            let menuUUID = devUtils.getLastResourceUUIDInURL(menuItem.href);
            let menuGroupHref = menuItem.menuGroup.href;

            oldMenus.push({
                uuid: menuUUID, menuGroupHref: menuGroupHref
                , name: menuItem.name, menuId: menuItem.menuId
            });

            menuItem.operators.items.map(operatorItem => {
                let operatorUUID = devUtils.getLastResourceUUIDInURL(operatorItem.href);
                let menuUUID = devUtils.getLastResourceUUIDInURL(operatorItem.menu.href);

                oldOperators.push({
                    uuid: operatorUUID, menuUUID: menuUUID
                    , name: operatorItem.name, operatorId: operatorItem.operatorId
                });
            });
        });

        let curMenuDatas = data.menus;

        let addMenus = [], addOperators = [], modifiedMenus = [], modifiedOperators = [];

        let newMenus = [], newOperators = [];


        curMenuDatas.map(curMenuItem => {
            let findInOldMenuItem = _.find(oldMenus, oldMenuItem => _.isEqual(oldMenuItem.menuId, curMenuItem.menuId));
            if (findInOldMenuItem) {
                /** 2018/6/4  如果菜单名称不同，则更新。
                 lpy-modifyed  */
                if (findInOldMenuItem.name != curMenuItem.name) {
                    modifiedMenus.push({uuid: findInOldMenuItem.uuid, name: curMenuItem.name});
                }
                curMenuItem.operators.map(curOperatorItem => {
                    let findInOldOperatorItem = _.find(oldOperators, oldOperatorItem =>
                        _.isEqual(oldOperatorItem.operatorId, curOperatorItem.operatorId));
                    if (findInOldOperatorItem) {
                        /** 2018/6/4 如果操作名称不同，则更新。
                         lpy-modifyed  */
                        if (findInOldOperatorItem.name != curOperatorItem.name) {
                            modifiedOperators.push({uuid: findInOldOperatorItem.uuid, name: curOperatorItem.name});
                        }
                    }
                    else {
                        /** 2018/6/4 如果此操作ID在老系统中不存在，则新增操作。
                         lpy-modifyed  */
                        addOperators.push({
                            name: curOperatorItem.name, operatorId: curOperatorItem.operatorId,
                            menuUUID: findInOldMenuItem.uuid
                        });
                    }

                });

            }
            else {
                /** 2018/6/4  如果新菜单ID在老系统中找不到，则此菜单和操作都要新增。
                 lpy-modifyed  */
                let newMenuUUID = devUtils.createUUID();
                addMenus.push({
                    uuid: newMenuUUID, name: curMenuItem.name
                    , menuId: curMenuItem.menuId,
                    menuOrganizationUUID: menuOrganizationUUID
                });
                curMenuItem.operators.map(curOperatorItem => {
                    addOperators.push({
                        name: curOperatorItem.name, operatorId: curOperatorItem.operatorId,
                        menuUUID: newMenuUUID
                    });
                });
            }

            /** 2018/6/4  产生新菜单和新操作的数组列表。
             lpy-modifyed  */
            newMenus.push({menuId: curMenuItem.menuId});
            curMenuItem.operators.map(curOperatorItem => {
                newOperators.push({operatorId: curOperatorItem.operatorId});
            })

        });


        /** 2018/6/4  判断老的菜单和操作是否在新版本中还存在，不存在就要删除。
         lpy-modifyed  */
        let delMenus = [], delOperators = [];
        oldMenus.map(oldMenuItem => {
            let findInNewMenuItem = _.find(newMenus, newMenuItem => _.isEqual(newMenuItem.menuId, oldMenuItem.menuId));
            if (!findInNewMenuItem) {
                delMenus.push(oldMenuItem.uuid);
            }
        });

        oldOperators.map(oldOperatorItem => {
            let findInNewOperatorItem = _.find(newOperators, newOperatorItem =>
                _.isEqual(newOperatorItem.operatorId, oldOperatorItem.operatorId));
            if (!findInNewOperatorItem) {
                delOperators.push(oldOperatorItem.uuid);
            }
        });


        let syncMenuData = {
            menuOrganizationUpData,
            addMenus,
            addOperators,
            modifiedMenus,
            modifiedOperators,
            delMenus,
            delOperators,
        };

        let syncmenuObj = await menuProxy.execute('syncAppMenus', syncMenuData, 'POST');

        return syncmenuObj;

    }

}

let menuBusiness = new MenuBusiness();
module.exports = menuBusiness;