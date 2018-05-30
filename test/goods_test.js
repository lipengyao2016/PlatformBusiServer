/**
 * Created by Administrator on 2016/9/25.
 */

const request = require('common-request').request;
const expect = require('chai').expect;
const _ = require('lodash');
const common = require('./common');
const url = common.url;
const utils = require('componet-service-framework').utils;
const signTokenBuild = require('./signTokenBuild');


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


function makeArrayStr(objArray) {
    return objArray.map(item=>{
        return _.keys(item).map(key=>`${key}:${item[key]}`).join('|');
    }).join(',');
}


function parseArrayStr(objArrayStr) {

   let objStrs = objArrayStr.split(',');
   let dataArray = objStrs.map(objStr=>{
       let singleObjStrs = objStr.split('|');
       let singleObj = singleObjStrs.reduce((obj,keyValueStrs)=>
       {
          let keyValus = keyValueStrs.split(':');
          obj[keyValus[0]] = keyValus[1];
          return obj;
       },{});

       return singleObj;
   })

    return dataArray;
}

describe('Goods Test Case:',function () {
    describe('Goods test case:',  function (){
        it('create a sortGoods test case:',  function (){
            //this.timeout(0);

            let goods =   [
                {
                    type:'01',     //01:衣服，02:裤子，03:包包,04:鞋子,05:其它。
                    weight:264.33,    //重量，单位kg
                },
                {
                    type:'02',
                    weight:200.3,
                },
                {
                    type:'03',
                    weight:224.56,
                },
                {
                    type:'04',
                    weight:230.0,
                },
                {
                    type:'05',
                    weight:240.0,
                },
            ];


            let goodsStr;
            goodsStr = JSON.stringify(goods);
            //let newGoodsObj = JSON.parse(goodsStr);

/*            let goodsStr = makeArrayStr(goods);

            console.log('parse start');
            let newGoodsObj = parseArrayStr(goodsStr);
            console.log('parse end');

            newGoodsObj.map(goods=>{
                goods.weight = parseFloat(goods.weight);
            })

            console.log('goodsStr:' + goodsStr);*/


            let  body = {

                packageId: '2525226534716222',

                //分拣后每种类型的称重信息。
                goods:goodsStr /*goods*/,

	            sortedAt:'2018-5-1 11:00:21', //分拣时间。
                sortedAddress:'nanshanxx',        //分拣地址。
                sortedOperator:'liuxx',          //分拣人。
                sortedPlace:'22017',         //分拣的工位。
            };

           // let signData = signTokenBuild.makeSignToken(body);

            //signData.timeStamp = signData.timeStamp + '1';


            return request.post(`${url}/sortGoods`,body,options)
                .then(function ({statusCode,body,headers,request}) {
                    console.log('statusCode:',statusCode);
                    console.log('body:',JSON.stringify(body,null,2));
                    expect(statusCode).to.equal(200);

                })
        });

     
    });
});


