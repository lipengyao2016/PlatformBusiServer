/**
 * Created by Administrator on 2016/9/25.
 */

const request = require('common-request').request;
const expect = require('chai').expect;
const _ = require('lodash');
const common = require('./common');
const url = common.url;
const utils = require('componet-service-framework').utils;


describe('metaMenus Test Case:',()=>{
    let metaMenusTestCase =
        {
        name: '业态管理',
        menuId: '4578sdfs875d6',
        applicationHref:'http://localhost:5000/api/v1.0.0/applications/RQZNqVpEbFxyZ7ayW7x2yA',
    };


    let applicationUUID = 'AppUUIDForTestCase';
    let metaMenusUUID = null;

    let tenantUUID = null;
    let tenantURL = null;

    tenantURL = url /*+ '/directories' + '/zbDG5Ul3MHzHOEBFYyIalQ' + '/metaMenusPackages' + '/n97eIgDCIO6wecGkvc19UQ'*/ ;

   // metaMenusUUID = 'KXJbx0rfcWc62wI5oWAQpA';

    describe('create test case:',  ()=>{

        it('success create an metaMenus',  ()=> {
            //this.timeout(0);
            return request.post(`${url}/metaMenus`,metaMenusTestCase).then( ( {statusCode, body, headers, request} )=>{
                expect(statusCode).to.equal(201);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                expect(body.name).to.equal(metaMenusTestCase.name);

                metaMenusUUID = utils.getResourceUUIDInURL(body.href,'metaMenus');

                console.log('metaMenus test  create  metaMenusUUID  :' + metaMenusUUID + ' body:'+JSON.stringify(body,null,2));
            });
        });
    });
    describe('retrieve test case:', function () {
        it('success retrieve an metaMenus  ', function () {
            //this.timeout(0);

            return request.get(`${tenantURL}/metaMenus/${metaMenusUUID}`,{}).then( ( { statusCode,body,headers,request} )=>{

                console.log('metaMenus test retrieve   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                //expect(uriReg.applicationURIReg.test(res.headers['location'])).to.be.true;
               // expect(body.name).to.equal(metaMenusTestCase.name);
            });
        });
    });
    describe('update test case:', function () {
        it('success update an metaMenus', function () {
            //this.timeout(0);
           // metaMenusUUID = '7O1PwyXNuUOEXxvRfvbyrQ';
            let updateInfo = {};
            updateInfo.status = 'created';
            return request.post(`${tenantURL}/metaMenus/${metaMenusUUID}`,updateInfo).then( ( { statusCode,body,headers,request} )=>{

                console.log('metaMenus test update   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                expect(body.description).to.equal(updateInfo.description);
                //expect(uriReg.applicationURIReg.test(res.headers['location'])).to.be.true;
            });
        });

    });
    describe('list test case:', function () {


        it('list metaMenus  ', function () {
            //this.timeout(0);
            let qs = {
                //applicationHref:'http://localhost:5000/api/v1.0.0/applications/CQZNqVpEbFxyZ7ayW7x2yA',
                applicationName:'LaiKoo-Platform',

            };
            return request.get(`${url}/metaMenus`,qs).then( ( { statusCode,body,headers,request} )=>{

                console.log('metaMenus test list   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                //expect(uriReg.applicationURIReg.test(res.headers['location'])).to.be.true;
            });
        });

    });

    describe('delete test case:',()=>{
        it('success delete an metaMenus', function () {
            //this.timeout(0);

           /* return request.delete(`${tenantURL}/metaMenus/${metaMenusUUID}`).then( ( { statusCode,body,headers,request} )=>{
                expect(statusCode).to.equal(204);
            });*/
        });
    });
});