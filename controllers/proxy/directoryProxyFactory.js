const DirectoryProxy = require('./directoryProxy');
const resourceURI = require('../resource/resourceURI');
const URIParser = resourceURI.v1;
const config = require('../../config/config');

let goodsDirectoryProxy = new DirectoryProxy(URIParser.baseResourcesURI(config.serverIndexs.Goods_Server,'directories'));
let DirectoryType =
    {
      Dir_Good:0,
    };

function getDirectory(type) {
    let directoryProxy = null;
    switch (type)
    {
        case DirectoryType.Dir_Good:
            directoryProxy = goodsDirectoryProxy;
            break;

    }
    return directoryProxy;
}


exports.getDirectory = getDirectory;
exports.DirectoryType = DirectoryType;