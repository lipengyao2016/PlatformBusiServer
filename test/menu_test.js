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
   // applicationName: 'LaiKoo-Platform',
    applicationHref:'http://localhost:5000/api/v1.0.0/applications/RQZNqVpEbFxyZ7ayW7x2yA',
    //applicationHref:'http://192.168.7.26:6000/api/v1.0.0/applications/J7A2GmLnJRhJxX3EfOy3Rw',
    version: '1.0.2',
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
                        name:'添加插件xx',
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
    /*    {
            name: '商品管理',
            menuId:'268434D6-FF41-4C61-824A-1E04E6FD052F',
            operators:
                [
                    {
                        name:'商品列表',
                        operatorId:'4D3653AA-30A9-4777-BA61-90B4C5D7C04E',
                    },

                ]
        },
        {
            name: '订单管理',
            menuId:'2545DAFC-7CAA-4A8D-9B90-72D7EB25C548',
            operators:
                [
                    {
                        name:'订单列表',
                        operatorId:'28412bcb-e010-4fc4-81d2-2ff4b1b855f2',
                    },

                ]
        },*/



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



