/**
 * Created by licp on 2016-10-13.
 */
"use strict";
const config = require('../../config/config');
const _ = require('lodash');


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




}

let menuBusiness = new MenuBusiness();
module.exports = menuBusiness;