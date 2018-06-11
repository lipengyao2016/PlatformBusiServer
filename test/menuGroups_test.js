/**
 * Created by Administrator on 2016/9/25.
 */
const request = require('common-request').request;
const expect = require('chai').expect;
const _ = require('lodash');
const common = require('./common');
const url = common.url;
const utils = require('componet-service-framework').utils;


describe('menuGroup Test Case:',()=>{
    let menuGroupTestCase = {
        name: '门店管理www',
        description: 'datagg',
        uiOrder: 1,
      //  upLevelMenuGroupHref:'http://localhost:6001/api/v1.0.0/menuGroups/ESQmj0c7OkWXYclyPxhU7w',
      //  menuOrganizationHref: 'http://localhost:6001/api/v1.0.0/menuOrganizations/PMM7M1sFnSTlDalZXqvPmQ',
      //  ownerHref:'http://localhost:5000/api/v1.0.0/businessFormats/ESQmj0c7OkWXYclyPxhU7w',
      //  applicationHref:'http://192.168.7.26:6000/api/v1.0.0/applications/Sad9YHDXhm9cyMeoNvr2ig',
        ownerType:'businessFormat',
        ownerUUID:'ESQmj0c7OkWXYclyPxhU7w',
        applicationName:'LaiKoo-Platform',
    };
    let applicationUUID = 'AppUUIDForTestCase';
    let menuGroupUUID = null;

    let tenantUUID = null;
    let tenantURL = null;

    tenantURL = url /*+ '/directories' + '/zbDG5Ul3MHzHOEBFYyIalQ' */;

   // menuGroupUUID = '8pyNRzO52CiVjCP3Nfbvvw';

    describe('create test case:',  ()=>{
        it('success create an menuGroup',  ()=> {
            //this.timeout(0);

            return request.post(`${tenantURL}/menuGroups`,menuGroupTestCase).then( ( {statusCode, body, headers, request} )=>{
                expect(statusCode).to.equal(201);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                expect(body.name).to.equal(menuGroupTestCase.name);

                menuGroupUUID = utils.getResourceUUIDInURL(body.href,'menuGroups');

                console.log('menuGroups test  create  menuGroupUUID  :' + menuGroupUUID + ' body:'+JSON.stringify(body,null,2));
            });
        });
    });


});