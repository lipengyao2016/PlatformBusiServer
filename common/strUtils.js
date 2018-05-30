const _ = require('lodash');

exports.makeArrayStr= function(objArray) {
    return objArray.map(item=>{
        return _.keys(item).map(key=>`${key}:${item[key]}`).join('|');
    }).join(',');
}


exports.parseArrayStr = function(objArrayStr) {

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
