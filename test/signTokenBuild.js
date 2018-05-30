/**
 * Created by Administrator on 2017/4/11.
 */
const generateSign = require('develop-utils').generateSign;
const verify = require('develop-utils').verify;
const _ = require('lodash');
const config = require('../config/config');

exports.makeSignToken= function(data){
    let curTimeStamp =Date.now();
    data.timeStamp = curTimeStamp.toString();
    let signTokenRet = generateSign(config.signKey,data);

    data.sign = signTokenRet;
   // console.log('makeSignToken data:',data);
    return data;
}



/*
let data = {
    sn:'1234567890123456',
    appid: 'wxd930ea5d5a258f4f',
    mch_id: '10000100',
    device_info: '1000',
    body: 'test',
};
*/

let goods =  [
        {
            type:'01',     //01:衣服，02:裤子，03:包包,04:鞋子,05:其它。
            weight:2.6,    //重量，单位kg
        },
        {
            type:'02',
            weight:2.1,
        },
        {
            type:'03',
            weight:2.2,
        },
        {
            type:'04',
            weight:2.3,
        },
        {
            type:'05',
            weight:2.4,
        },
    ];

let  data = {
    packageId: '8018042510170680',
    goods:  JSON.stringify(goods) ,  //分拣后每种类型的称重信息。
    sortedAt:'2017-8-5 10:00:00', //分拣时间。
    sortedAddress:'nanshan',        //分拣地址。
    sortedOperator:'liu',          //分拣人。
    sortedPlace:'22017',         //分拣的工位。

};

/*
let signData = this.makeSignToken(data);

signData.timeStamp = signData.timeStamp  ;

console.log(verify(signData.sign,config.signKey,signData));*/



/*console.log(_.isObject('sdgs'));
console.log(_.isObject(data.goods));*/





