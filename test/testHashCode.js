const _ = require('lodash');
const utils = require('componet-service-framework').utils;
const process = require('process');

function hashCode(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (let k = 0; k < str.length; k++) {
        char = str.charCodeAt(k);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}


function genNumber(){
    let dateTimestamp = new Date().getTime() + '';
    //console.log('dateTime:' + dateTimestamp);

   // let rand = _.pad(_.random(0,999999999),9,'0');
    //console.log('rand:'+rand);

    let  hrTime1 = _.pad(process.hrtime()[1],9,'0');
    //console.log('hrTime1:' + hrTime1);

    /*let uuid = utils.createUUID();
    //console.log('uuid:' + uuid );
    let uuidHash = hashCode(uuid) + ' ';
    if(uuidHash[0] == '-')
    {
        uuidHash = uuidHash.substring(1);
    }

    if(uuidHash.length > 9)
    {
        uuidHash = uuidHash.substring(0,9);
    }
    else if(uuidHash.length < 9)
    {
        uuidHash = _.pad(uuidHash,9,'0');
    }*/


    //let t3 = process.uptime()*1000;
   // console.log('hashCode:' + uuidHash);

/*    let dateStr = utils.getDateStr(new Date()).substring(2);
    console.log(dateStr);*/


    return dateTimestamp.substring(1)+ hrTime1;
}

console.log(genNumber());

let numberMap = {};
let i = 0;
let prevTime = new Date().getTime() ;
let curTime;

let repeatCnt = 0;

/*
while(true)
{
    let number = genNumber() + '';
    if(!numberMap.hasOwnProperty(number))
    {
        numberMap[number] = number;
    }
    else
    {
        console.error('number has repeated number:',number);
        repeatCnt ++;
    }
    if(i%10000 == 0)
    {
        console.log('loop 1000,number:' + number + ',i:' + i + ',repeatCnt:' + repeatCnt);
        curTime = new Date().getTime();
        if(curTime-prevTime > 1000)
        {
            console.log(' reset map data...' );
            numberMap = {};
            prevTime = curTime;
        }

    }
    i++;
}
*/



/*
console.log(hashCode('Gfoc1C82RirimHQvHMgSdg'));
console.log(hashCode('Gfoc1C82RirimHQvHMgsDG'));*/
