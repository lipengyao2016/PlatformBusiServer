/**
 * Created by Administrator on 2016/9/25.
 */

const request = require('common-request').request;
const expect = require('chai').expect;
const _ = require('lodash');
const common = require('./common');
const url = common.url;
const utils = require('../common/utils');

describe('Cabinet Test Case:',function () {
    describe('cabinet test case:',  function (){
        it('create a cabinet test case:',  function (){
            //this.timeout(0);
            let  body = {
                cabinetNumber: 'a0001',
                boxNumber: '001',
            };

            return request.post(`${url}/openCabinetQRCodes`,body)
                .then(function ({statusCode,body,headers,request}) {
                    expect(statusCode).to.equal(201);
                    console.log('statusCode:',statusCode);
                    console.log('body:',JSON.stringify(body,null,2));
                })
        });
        it('create a cabinet test case:',  function (){
            //this.timeout(0);
            let  body = {
                cabinetNumber: 'a0001',
                boxNumber: '001',
            };

            return request.get(`${url}/openCabinetQRCodes`,body)
                .then(function ({statusCode,body,headers,request}) {
                    expect(statusCode).to.equal(201);
                    console.log('statusCode:',statusCode);
                    console.log('body:',JSON.stringify(body,null,2));
                })
        });

        it('scanQRCodeOpenBox test case:',  function (){
            //this.timeout(0);
            let  body = {
                weixinNumber: 'iCar-Service',
                openId: 'iCar-Service-openId-test',
                QRCodeData: 'a0001-001',
            };

            return request.post(`${url}/scanQRCodeOpenBox`,body)
                .then(function ({statusCode,body,headers,request}) {
                    expect(statusCode).to.equal(200);
                    console.log('statusCode:',statusCode);
                    console.log('body:',JSON.stringify(body,null,2));
                })
        });
    });
});


// describe('Cabinet Test Case:',function () {
//     let directoryUUID  = null;
//     describe('cabinet test case:',  function (){
//         let cabinetUUID = null;
//         it('create a cabinet test case:',  function (){
//             //this.timeout(0);
//             let  options = {
//                 body: {
//                     name:'测试-柜子',
//                     number: '00001',
//                     address: '富贵小区一栋',
//                     boxCount: 50,
//                     usedCount: 20,
//                     noticerHref: `http://192.168.7.150:5003/api/v1.0.0/userOrganizations/WbmY5fQqhDTEpZr414YSpg/users/OSU4FWmXO88AyFnKc3JlBw`
//                 },
//                 json: true, simple: true, resolveWithFullResponse: true
//             };
//
//             return request.post(`${url}/cabinets`,options)
//                 .then(function ({statusCode,body,headers,request}) {
//                     expect(statusCode).to.equal(201);
//                     console.log('statusCode:',statusCode);
//                     console.log('body:',JSON.stringify(body,null,2));
//                     cabinetUUID = utils.getResourceUUIDInURL(body.href,'cabinets');
//                 })
//
//
//         });
//         it('get a cabinet test case:',  function (){
//             //this.timeout(0);
//
//             let  options = {
//                 json: true, simple: true, resolveWithFullResponse: true
//             };
//             return request.get(`${url}/cabinets/${cabinetUUID}`,options)
//                 .then(function ({statusCode,body,headers,request}) {
//                     expect(statusCode).to.equal(200);
//                     console.log('statusCode:',statusCode);
//                     console.log('body:',JSON.stringify(body,null,2));
//                 })
//         });
//         it('update a cabinet test case:',  function (){
//             //this.timeout(0);
//
//             let  options = {
//                 body:{usedCount: 30},
//                 json: true, simple: false, resolveWithFullResponse: true
//             };
//             return request.post(`${url}/cabinets/${cabinetUUID}`,options)
//                 .then(function ({statusCode,body,headers,request}) {
//                     expect(statusCode).to.equal(200);
//                     console.log('statusCode:',statusCode);
//                     console.log('body:',JSON.stringify(body,null,2));
//                 })
//         });
//
//         it('list cabinets test case:',  function (){
//             //this.timeout(0);
//
//             let  options = {
//                 qs: {limit: 3},
//                 json: true, simple: true, resolveWithFullResponse: true
//             };
//             return request.get(`${url}/cabinets`,options)
//                 .then(function ({statusCode,body,headers,request}) {
//                     expect(statusCode).to.equal(200);
//                     console.log('statusCode:',statusCode);
//                     console.log('body:',JSON.stringify(body,null,2));
//                 })
//         });
//         // it('delete a cabinet test case:',  function (){
//         //     //this.timeout(0);
//         //
//         //     let  options = {
//         //         json: true, simple: false, resolveWithFullResponse: true
//         //     };
//         //     return request.delete(`${url}/cabinets/${cabinetUUID}`,options)
//         //         .then(function ({statusCode,body,headers,request}) {
//         //             expect(statusCode).to.equal(204);
//         //             console.log('statusCode:',statusCode);
//         //             console.log('body:',JSON.stringify(body,null,2));
//         //         })
//         // });
//     });
// });