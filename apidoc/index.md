
# API DOC

*** 所有的接口，返回的结果成功状态由http的状态码来标志，每个接口均会写出成功的状态码，其它的一律表示失败。***


### 1、 创建包裹

```

POST  http://192.168.7.150:5802/api/v1.0.0/goodsPackages

body:
{
   name: 'wwww de baoguo',    //名字。
   weight: 3.5,               //重量。
   deliverySource: 'cabinet', //客户来源。cabinet:智能柜子， greenFrog:绿青蛙，idleFish:闲鱼。
   deliveryHref: 'http://192.168.7.150:5027/customers/Hyh9P6DdMLL5BaSubP3oAw',           //投递者链接。
   merchantHref:'http://192.168.7.210:5006/api/v1.0.0/merchants/aR5Uj5qbZw7yjiP0zDqmyQ', //商户链接。
}

Response：

HTTP statusCode: 201
body: {
        "href": "http://localhost:5702/api/v1.0.0/goodsPackages/dMopQXMmW5g5nCuDZduTKQ",
        "packageId": "8018042410335345",    //包裹编号。
        "name": "wwww de baoguo",           //名称。
        "quatity": 0,                       //数量。
        "weight": 3.5,                      //重量。
        "deliverySource": null,             //投递来源。
        "status": "created",
        "createdAt": "2018-04-24 10:33:53",
        "modifiedAt": "2018-04-24 10:33:53",
        "delivery":    //投递者链接。
        {
          "href": "http://192.168.7.150:5027/customers/Hyh9P6DdMLL5BaSubP3oAw"
        },
        "directory":  //目录。
        {
          "href": "http://localhost:5702/api/v1.0.0/directories/tg6gRLAYJ7GKTnOzruJItA"
        },
        "goods":      //货物信息。
        {
          "href": "http://localhost:5702/api/v1.0.0/goodsPackages/dMopQXMmW5g5nCuDZduTKQ/goods"
        },
        "sortedRecords":  //分拣记录。
        {
          "href": "http://localhost:5702/api/v1.0.0/goodsPackages/dMopQXMmW5g5nCuDZduTKQ/sortedRecords"
        }
      }

```


### 2、分拣货物

```

POST  http://192.168.7.150:5802/api/v1.0.0/sortGoods


body:
{
    packageId: '8018042317554332',   //包裹ID,必填.

    //分拣后每种类型的称重信息,支持以下两种方式，如果是APP端调用，因为后面要加入签名机制，需要第一种方式。
    goods:"[{\"type\":\"01\",\"weight\":2.643354},{\"type\":\"02\",\"weight\":2.1}]",

    goods:
        [
            {
                type:'01',     //01:衣服，02:裤子，03:包包,04:鞋子,05:其它。
                weight:2.6,    //重量，单位g
            },
        ],
    sortedAt:'2017-8-5 10:00:00', //分拣时间,必填。
    sortedAddress:'nanshan',        //分拣地址。
    sortedOperator:'liu',          //分拣人。
    sortedPlace:'22017',         //分拣的工位。
}

Response：

HTTP statusCode: 200
body:
{
  "packageId": "2524735392798625",   //包裹ID.
  "retCode": "success",              //返回码。
  "customerName": "weixin-name",     //客户姓名。
  "statistics":                      //统计信息。
  {
    "sortRecordCnt": 2,              //总分拣次数。
    "totalWeight": 23.3780,        //总分拣重量。
    "details":                       //每种类型的总分拣重量。
    [
      {
        "type": "01",                //类型。
        "sumWeight": 5.2868        //重量总和。
      },
    ]
  }
}

其它状态码
body:
{
  "name": "DBError",
  "statusCode": 500,
  "code": 5100,
  "message": "Database server instruction execution fail.",
  "description": "ER_DUP_ENTRY(1062 insert into `SortedRecords` (`createdAt`, `goodsPackageUUID`, `modifiedAt`, `sortedAddress`, `sortedAt`, `sortedOperator`, `sortedPlace`, `uuid`) values ('2018-04-27 11:07:56', 'wWopNgM0tFFcpEes0oBWvA', '2018-04-27 11:07:56', 'nanshanxx', '2017-8-15 11:00:20', 'liuxx', '22017', 'Z9uM5Afp2V4z1wXccCpHZw') - ER_DUP_ENTRY: Duplicate entry 'wWopNgM0tFFcpEes0oBWvA-2017-08-15 11:00:20' for key 'sortRecord_packageUUID_idx_idx'",
  "stack": "Error: ER_DUP_ENTRY: Duplicate entry 'wWopNgM0tFFcpEes0oBWvA-2017-08-15 11:00:20' for key 'sortRecord_packageUUID_idx_idx'\n    at Query.Sequence._packetToError (/usr/local/node/deploy/GoodsServer/node_modules/mysql/lib/protocol/sequences/Sequence.js:52:14)\n    at Query.ErrorPacket (/usr/local/node/deploy/GoodsServer/node_modules/mysql/lib/protocol/sequences/Query.js:77:18)\n    at Protocol._parsePacket (/usr/local/node/deploy/GoodsServer/node_modules/mysql/lib/protocol/Protocol.js:279:23)\n    at Parser.write (/usr/local/node/deploy/GoodsServer/node_modules/mysql/lib/protocol/Parser.js:76:12)\n    at Protocol.write (/usr/local/node/deploy/GoodsServer/node_modules/mysql/lib/protocol/Protocol.js:39:16)\n    at Socket.<anonymous> (/usr/local/node/deploy/GoodsServer/node_modules/mysql/lib/Connection.js:103:28)\n    at emitOne (events.js:116:13)\n    at Socket.emit (events.js:211:7)\n    at addChunk (_stream_readable.js:263:12)\n    at readableAddChunk (_stream_readable.js:250:11)\n    at Socket.Readable.push (_stream_readable.js:208:10)\n    at TCP.onread (net.js:607:20)\n    --------------------\n    at Protocol._enqueue (/usr/local/node/deploy/GoodsServer/node_modules/mysql/lib/protocol/Protocol.js:145:48)\n    at Connection.query (/usr/local/node/deploy/GoodsServer/node_modules/mysql/lib/Connection.js:208:25)\n    at /usr/local/node/deploy/GoodsServer/node_modules/knex/lib/dialects/mysql/index.js:161:18\n    at Promise._execute (/usr/local/node/deploy/GoodsServer/node_modules/bluebird/js/release/debuggability.js:303:9)\n    at Promise._resolveFromExecutor (/usr/local/node/deploy/GoodsServer/node_modules/bluebird/js/release/promise.js:483:18)\n    at new Promise (/usr/local/node/deploy/GoodsServer/node_modules/bluebird/js/release/promise.js:79:10)\n    at Client_MySQL._query (/usr/local/node/deploy/GoodsServer/node_modules/knex/lib/dialects/mysql/index.js:155:12)\n    at Client_MySQL.query (/usr/local/node/deploy/GoodsServer/node_modules/knex/lib/client.js:206:17)\n    at Runner.<anonymous> (/usr/local/node/deploy/GoodsServer/node_modules/knex/lib/runner.js:155:36)\n    at Runner.tryCatcher (/usr/local/node/deploy/GoodsServer/node_modules/bluebird/js/release/util.js:16:23)\n    at Runner.query (/usr/local/node/deploy/GoodsServer/node_modules/bluebird/js/release/method.js:15:34)\n    at /usr/local/node/deploy/GoodsServer/node_modules/knex/lib/runner.js:61:21\n    at tryCatcher (/usr/local/node/deploy/GoodsServer/node_modules/bluebird/js/release/util.js:16:23)\n    at /usr/local/node/deploy/GoodsServer/node_modules/bluebird/js/release/using.js:185:26\n    at tryCatcher (/usr/local/node/deploy/GoodsServer/node_modules/bluebird/js/release/util.js:16:23)\n    at Promise._settlePromiseFromHandler (/usr/local/node/deploy/GoodsServer/node_modules/bluebird/js/release/promise.js:512:31)\n    at Promise._settlePromise (/usr/local/node/deploy/GoodsServer/node_modules/bluebird/js/release/promise.js:569:18)\n    at Promise._settlePromise0 (/usr/local/node/deploy/GoodsServer/node_modules/bluebird/js/release/promise.js:614:10)\n    at Promise._settlePromises (/usr/local/node/deploy/GoodsServer/node_modules/bluebird/js/release/promise.js:693:18)\n    at Promise._fulfill (/usr/local/node/deploy/GoodsServer/node_modules/bluebird/js/release/promise.js:638:18)\n    at PromiseArray._resolve (/usr/local/node/deploy/GoodsServer/node_modules/bluebird/js/release/promise_array.js:126:19)\n    at PromiseArray._promiseFulfilled (/usr/local/node/deploy/GoodsServer/node_modules/bluebird/js/release/promise_array.js:144:14)",
  "packageId": "2524736343650360"  //包含packageId
}

```


