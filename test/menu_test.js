/**
 * Created by Administrator on 2016/9/25.
 */

const request = require('common-request').request;
const expect = require('chai').expect;
const _ = require('lodash');
const common = require('./common');
const url = common.url;
const utils = require('componet-service-framework').utils;


let menusTestCase = {
    applicationName: 'LaiKoo-Platform',
    version: '1.0.0',
    menus: [
        {
            name: '菜单管理aa',
            menuId:'5350A6A5-F274-4CCE-AD2A-866D04579CE8',
            operators:
                [
                    {
                        name:'菜单列表',
                        operatorId:'0E353358-75B4-417E-AFEA-7E5A7CE56AA2',
                    },
                    {
                        name:'新增菜单',
                        operatorId:'9175DE46-1DFD-4646-AC9E-1F66AD724511',
                    },
                ]
        },
        {
            name: '插件管理',
            menuId:'64D05948-36AD-41A0-AF78-75FA23D657C5',
            operators:
                [
                    {
                        name:'插件列表xx',
                        operatorId:'6129CC59-116C-4DD5-9BB2-74A83712F86A',
                    },
                ]
        },
        {
            name: '用户管理',
            menuId:'FCD1FDA4-A7A2-43D9-B4E1-3890A86E924C',
            operators:
                [
                    {
                        name:'用户列表',
                        operatorId:'4CE44A21-68DA-4ADA-B7EE-371187327F75',
                    },
                    {
                        name:'新增用户',
                        operatorId:'DCFE6EF3-60CD-4DA0-B360-53590321A7B9',
                    },
                ]
        },


    ]
};



describe('create test case:',  ()=>{
    it('success syncAppMenus an menus',  ()=> {
        //this.timeout(0);

        return request.post(`${url}/syncAppMenus`,menusTestCase).then(function ({statusCode,body,headers,request}) {
            console.log('syncAppMenus body:',JSON.stringify(body,null,2));
            expect(statusCode).to.equal(200);
        })

    });
});


