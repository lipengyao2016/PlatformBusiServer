/**
 * Created by Administrator on 2016/9/25.
 */

const request = require('common-request').request;
const expect = require('chai').expect;
const _ = require('lodash');
const common = require('./common');
const url = common.url;
const utils = require('componet-service-framework').utils;

let header =
    {

        //192.168.7.210 + data Authoritys + 三个数据权限都为1
        "authorization": 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyIjp7ImhyZWYiOiJodHRwOi8vMTkyLjE2OC43LjIxMDo1MDAzL2FwaS92MS4wLjAvdXNlck9yZ2FuaXphdGlvbnMvZUN5YXNkM3hVZjBrczZYN0ZWZDRjQS91c2Vycy90UWdROHc5cDdJVlN2N2hhbjJHVlR3IiwibmFtZSI6ImFkbWluIiwidXNlck9yZ2FuaXphdGlvbiI6eyJocmVmIjoiaHR0cDovLzE5Mi4xNjguNy4yMTA6NTAwMy9hcGkvdjEuMC4wL3VzZXJPcmdhbml6YXRpb25zL2VDeWFzZDN4VWYwa3M2WDdGVmQ0Y0EifX0sImFjY291bnQiOnsiaHJlZiI6Imh0dHA6Ly8xOTIuMTY4LjcuMjEwOjUwMDAvYXBpL3YxLjAuMC9hY2NvdW50cy9Mc0xJVXh6Qk14SEpwaVdURVpQNkdnIiwibmFtZSI6ImFkbWluIn0sIm1lcmNoYW50Ijp7ImhyZWYiOiJodHRwOi8vMTkyLjE2OC43LjIxMDo1MDA2L2FwaS92MS4wLjAvbWVyY2hhbnRzL2FSNVVqNXFiWnc3eWppUDB6RHFteVEiLCJuYW1lIjoiS1BF5bmz5Y-w5byA5Y-R5ZWGIn0sInJvbGUiOnsicm9sZU9yZ2FuaXphdGlvbiI6eyJocmVmIjoiaHR0cDovLzE5Mi4xNjguNy4yMTA6NTAwNS9hcGkvdjEuMC4wL3JvbGVPcmdhbml6YXRpb25zL01CTDJlY3JadnFYcVp5TXRiOWVJbmcifSwicm9sZXMiOlsiaHR0cDovLzE5Mi4xNjguNy4yMTA6NTAwNS9hcGkvdjEuMC4wL3JvbGVPcmdhbml6YXRpb25zL01CTDJlY3JadnFYcVp5TXRiOWVJbmcvcm9sZXMvR1V1NFp6MDc4OE51Z2hScnpZaDdkdyJdLCJkYXRhQXV0aG9yaXR5cyI6W119LCJpYXQiOjE0OTM3NzY1MDIsImV4cCI6MTkyNTc3NjUwMn0.hwxVwECPzll7Juh9SObvm214XQnQFYCZf9raAYBiUeKCQNx8sT_f1EHx4J97LUZPML1MgqD8zKh4rJOctUIbC6HDvH20IH4mg9q7rHFrqREysJ9SV6U0TMQEJSXXY4qunbM-Xz0e_rX-n_RWKZvHwCWi2xVObTSFwh-UGZzfAx8',

        //测试TOKEN
        // "authorization": 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyIjp7ImhyZWYiOm51bGx9LCJtZXJjaGFudCI6eyJocmVmIjpudWxsfSwiaWF0IjoxNTAzMDUwMTE0LCJleHAiOjE3Mzg5NzYxMTR9.NL0CvxAUZ7s-lInwpQA-kRGinAV3NHiHvmj0qqIcMGtfP_Z3FFx33io5A__jzHPUmtKrUXt4FJWUeVtuKKCP-y6eD-1rSXpR7qZovFu87OfRcP8kEBHUzHbK9yRe2MV9yPUsi6JWcH6_pgM3PFhkZcChXW4AGT4jBcVBZQ_VFRw',
    };

let options = {
    //headers: header,
};

let rolesTestCase = {
    name:'经理',
    description:'data',
    applicationHref:'http://192.168.7.151:6000/api/v1.0.0/applications/Sad9YHDXhm9cyMeoNvr2ig',
    merchantHref:'http://192.168.7.151:6004/api/v1.0.0/merchants/0BlAQi3BXAEEEurhYkVcgA',
    permissions:[
        {
            objectUUID:'8KMwPfurIZoEHfENAShS6g',
            objectType:'menu',
            // applicationHref:'http://192.168.7.151:6000/api/v1.0.0/applications/Sad9YHDXhm9cyMeoNvr2ig',
        },
        {
            objectUUID:'mzNYalrUcBWrGsbxEsQcAQ',
            objectType:'menu',
            // applicationHref:'http://192.168.7.151:6000/api/v1.0.0/applications/Sad9YHDXhm9cyMeoNvr2ig',
        },
        {
            objectUUID:'RCHSP38ZgDXF7pYCxrupTQ',
            objectType:'operator',
            // applicationHref:'http://192.168.7.151:6000/api/v1.0.0/applications/Sad9YHDXhm9cyMeoNvr2ig',
        },
    ],
};



describe('create test case:',  ()=>{
    it('success create an roles',  ()=> {
        //this.timeout(0);

        return request.post(`${url}/roles`,rolesTestCase).then( ( {statusCode, body, headers, request} )=>{
            expect(statusCode).to.equal(201);
            expect(headers['content-type']).to.equal('application/json; charset=utf-8');

            console.log('roless test  create ' + ' body:'+JSON.stringify(body,null,2));
        });
    });
});

describe('update test case:', function () {
    it('success update an roles', function () {
        //this.timeout(0);
        let  rolesUUID = '4HEuxTbqUmUhd2JGEVEGFw';
        let updateInfo = {
            name:'经理yy',
            permissions:[
                {
                    objectUUID:'z2X3usRDBUWIUWggz8CBfg',
                    objectType:'menu',
                    //applicationHref:'http://localhost:5000/api/v1.0.0/applications/CQZNqVpEbFxyZ7ayW7x2yA',
                },
                {
                    objectUUID:'afwMjzj4t2usQNy3DKYvBQ',
                    objectType:'operator',
                    // applicationHref:'http://localhost:5000/api/v1.0.0/applications/CQZNqVpEbFxyZ7ayW7x2yA',
                },
                {
                    objectUUID:'2ErRZmmFUJidbOD7QkYGKA',
                    objectType:'operator',
                    /*applicationHref:'http://localhost:5000/api/v1.0.0/applications/CQZNqVpEbFxyZ7ayW7x2yA',*/
                },
            ],
        };
        updateInfo.description = 'lpy descript';
        return request.post(`${url}/roles/${rolesUUID}`,updateInfo).then( ( { statusCode,body,headers,request} )=>{

            console.log('roless test update   :' + JSON.stringify(body,null,2));

            expect(statusCode).to.equal(200);
            expect(headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(body.description).to.equal(updateInfo.description);
            //expect(uriReg.applicationURIReg.test(res.headers['location'])).to.be.true;
        });
    });
});


describe('Role Test Case:',function () {
    describe('Role test case:',  function (){

        it('get a Role details test case:',  function (){
            //this.timeout(0);
            let  qs = {
              /*  roleHref:'http://localhost:6002/api/v1.0.0/roles/ujoQyy5P95WoR1KOFjuG5g',
                applicationHref:'http://localhost:5000/api/v1.0.0/applications/CQZNqVpEbFxyZ7ayW7x2yA',*/

                roleUUID:'GUu4Zz0788NughRrzYh7dw',
                //roleHref:'http://localhost:6002/api/v1.0.0/roles/jmVlM29n94ZRRIRXhW1d6w',
                applicationHref:'http://192.168.7.26:5000/api/v1.0.0/applications/Sad9YHDXhm9cyMeoNvr2ig',
            };

            return request.get(`${url}/roleDetails`,qs,options).then(function ({statusCode,body,headers,request}) {
                    console.log('body:',JSON.stringify(body,null,2));
                    expect(statusCode).to.equal(200);
                })
        });


        it('list roless  ', function () {
            //this.timeout(0);
            let merchantLists = [
                'RQZNqVpEbFxyZ7ayW7x2yA',
                'PQZNqVpEbFxyZ7ayW7x2yA'];
            let qs = {
                //  name:'*good*',
                //uuid:['3UCHOeNl5tVmN83fkyQfNQ','V1bg0v8SlXKs8OXApykNzg'],
                /*               offset:0,
                               limit:1,
                               createdAt:'[,2018-04-18 18:13:28]'*/

            };
            return request.get(`${url}/roles`,qs).then( ( { statusCode,body,headers,request} )=>{

                console.log('roless test list   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                //expect(uriReg.applicationURIReg.test(res.headers['location'])).to.be.true;
            });
        });

    });
});


