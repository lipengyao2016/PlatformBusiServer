
const _ = require('lodash');
const devUtils = require('develop-utils');
const messagePushServerProxy = require('../proxy/messagePushServerProxy');
const cabinetServerProxy = require('../proxy/cabinetServerProxy');
const weixinMgrServerProxy = require('../proxy/weixinMgrServerProxy');


const noticerHref = 'http://192.168.7.150:5003/api/v1.0.0/userOrganizations/WbmY5fQqhDTEpZr414YSpg/users/OSU4FWmXO88AyFnKc3JlBw';
class CabinetBusiness{
    constructor(){}
    async register(cabinetNumber,registrationId,cabinetData={}){
        let cabinetList = await cabinetServerProxy.queryCabinets({number:cabinetNumber});
        let cabinet = _.get(cabinetList,'items[0]');
        if( !cabinet ){ // 没有则创建
            cabinetData.number = cabinetNumber;
            cabinetData.noticerHref = noticerHref;
            cabinet = await cabinetServerProxy.createCabinet(cabinetData);
        }
        else { // 如果有，则更新
            cabinetServerProxy.updateCabinetByURL(_.get(cabinet,'href'),cabinetData)
                .then(data=>console.log(`[register updateCabinetByURL] --> ${cabinetNumber} ${_.get(cabinet,'href')}}`))
                .catch(error=>console.error(`[register updateCabinetByURL] --> ${cabinetNumber} ${_.get(cabinet,'href')}`,error));
        }
        let cabinetUUID = devUtils.getResourceUUIDInURL(_.get(cabinet,'href'),'cabinets');
        let regInfo = await messagePushServerProxy.register(cabinetUUID,registrationId);
        console.log(`register -> `,JSON.stringify(regInfo));
        return {status: 'success'};
    }

    async genOpenCabinetQRCodes(cabinetNumber, boxNumber){
        // todo: 通过盒子找到对应用的商户，再从对应的商户找到微信号
        let weixinNumber = 'iCar-Service'; let type = 'QRCode';
        let url = await weixinMgrServerProxy.queryWeiXinServerMapURL(weixinNumber, type);
        if( !url ){
            devUtils.Error('Error',404,1599,`Not find ORCode function URL by weixinNumber ( ${weixinNumber} )`);
        }
        let QRstring = `${cabinetNumber}-${boxNumber}`;
        let QRCodeUrl = await weixinMgrServerProxy.getQRCodeURL(url,QRstring);
        if(!QRCodeUrl){
            devUtils.Error('Error',404,5000,`generate ORCode failed by ${url}`);
        }
        return {cabinetNumber,boxNumber,QRCodeUrl: QRCodeUrl};
    }

    async scanQRCodeOpenBox(weixinNumber,openId,QRCodeData){

        let [cabinetNumber,boxNumber] = QRCodeData.split('-');

        let cabinetList = await cabinetServerProxy.queryCabinets({number:cabinetNumber});
        let cabinet = _.get(cabinetList,'items[0]');
        if( !cabinet ){ // 没有则创建
            cabinet = await cabinetServerProxy.createCabinet({number:cabinetNumber});
        }
        let cabinetUUID = devUtils.getResourceUUIDInURL(_.get(cabinet,'href'),'cabinets');

        let title = '通知';
        let type = 'openOne';
        let message = `${type}-${cabinetNumber}-${boxNumber}`;
        console.log('JPush sendMessage:',{type,cabinetNumber,boxNumber});
        let ret = await messagePushServerProxy.sendMessage(cabinetUUID,title,message,{type: 'openOne',cabinetNumber,boxNumber});
        // weixinMgrServerProxy.addOpenIDForWeiXin(weixinNumber,openId)
        //     .then(data=>console.log(`[addOpenIDForWeiXin] --> ${weixinNumber} ${openId}\n${JSON.stringify(data,null,2)}`))
        //     .catch(error=>console.error(`[addOpenIDForWeiXin] --> ${weixinNumber} ${openId}`,error));
        return {status: 'success'};
    }

    async openAllBoxes(cabinetNumber){
        let cabinetList = await cabinetServerProxy.queryCabinets({number:cabinetNumber});
        let cabinet = _.get(cabinetList,'items[0]');
        if( !cabinet ){
            devUtils.Error('Error',404,1599,`Not find cabinet ${cabinetNumber}`);
        }
        let cabinetUUID = devUtils.getResourceUUIDInURL(_.get(cabinet,'href'),'cabinets');
        let title = '通知';let type = 'openAll';let message = `${type}-${cabinetNumber}`;
        let ret = await messagePushServerProxy.sendMessage(cabinetUUID,title,message,{type,cabinetNumber});
        return {status: 'success'};
    }

    async uploadCabinetStatus(statusInfo){
        let cabinetList = await cabinetServerProxy.queryCabinets({number:statusInfo.number});
        let cabinet = _.get(cabinetList,'items[0]');
        if( !cabinet ){ // 没有则创建
            statusInfo.address = '深圳市宝安区创业二路创锦一号';
            statusInfo.noticerHref = noticerHref;
            cabinet = await cabinetServerProxy.createCabinet(statusInfo);
        }
        else {
            cabinet = await cabinetServerProxy.updateCabinetByURL(cabinet.href, statusInfo);
        }
        return {status: 'success'};
    }

    async listByUserUUID(userUUID,qs={}){
        qs.noticerUUID = userUUID;
        qs.pick = 'name|number|address|boxCount|usedCount|status|createdAt|modifiedAt';
        let cabinets = await cabinetServerProxy.queryCabinets(qs);
        return cabinets;
    }
}

module.exports = new CabinetBusiness();

// module.exports.register('a0001','a1GEfq12ba2EFaw3er6raH').then(ret=>{
//     console.log('ret:',JSON.stringify(ret,null,2));
// }).catch(e=>{console.error(e)});

// module.exports.uploadCabinetStatus({number: 'a0005',boxCount: 10,usedCount:5}).then(ret=>{
//     console.log('ret:',JSON.stringify(ret,null,2));
// }).catch(e=>{console.error(e)});

// let userUUID = 'OSU4FWmXO88AyFnKc3JlBw';
// module.exports.listByUserUUID(userUUID).then(ret=>{
//     console.log('ret:',JSON.stringify(ret,null,2));
// }).catch(e=>{console.error(e)});