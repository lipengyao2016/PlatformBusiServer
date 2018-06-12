/**
 * Created by Administrator on 2018/1/8.
 */
const log4js = require('./log4js');
const package = require('./package.json');
const config = require('./config/config');
const router = require('./router/router');

// 依次从系统环境变量、配置文件（配置环境或文件）读取服务端口，默认为3000
const utils = require('develop-utils');

const server_name = package.name;
const ip = config.server.domain;
const port = process.env.PORT || config.server.port || '3000';


const Koa = require('koa');


const logger = require('koa-logger');
const bodyparser = require('koa-bodyparser');

//const app = new Koa();
const appKoa = new Koa();
const app =require('koa-qs')(appKoa, 'extended');

const jsonExpand = require('koa-json-url-expand');
const jwt = require('koa-jwt');
const _  =require('lodash');



app.use(logger());
app.use(bodyparser({jsonLimit: '10mb'}));



// JWT
/*app.use(async (ctx,next)=>{
    console.log('query:',ctx.query);
    let jwt_opt = { secret: config.jwt.public_key, algorithms: ['RS256'] ,passthrough:true};
    //优先使用Header头信息中的认证信息，若没有则使用query中的token
    if(!ctx.header.authorization){
        jwt_opt.getToken = function(){
            return ctx.query.token;
        };
    }

    if(!ctx.query.token && !ctx.header.authorization)
    {
        console.log(' no token in header and query!!!');
         await  next();
    }
    else
    {
        try {
            await jwt(jwt_opt).call(null,ctx,next);
        }
        catch (err){
            console.error(' user jwt error :' + err);
            let error = new Error();
            error.name = err.name;
            error.code = 9999;
            error.message = err.message;
            error.description = '';
            ctx.status = 401;
            ctx.body = error;
        }
    }



});
app.use(async (ctx,next)=>{
    if (ctx.state && ctx.state.user)
    {
        console.log('tokenInfo:',ctx.state.user);
       // utils.checkRequiredParams(ctx.state.user,['user','merchant']);
        let {user,merchant}=ctx.state.user;
        let userHref = ctx.state.user.user.href;
        let merchantHref = ctx.state.user.merchant.href;
        ctx.jwt = _.cloneDeep(ctx.state.user);
        ctx.jwt.userUUID = utils.getResourceUUIDInURL(userHref,'users');
        ctx.jwt.merchantUUID = utils.getResourceUUIDInURL(merchantHref,'merchants');
        console.log(`merchant: ${ctx.jwt.merchantUUID} , user: ${ctx.jwt.userUUID}`);
    }

    await next();
});*/



app.use(async (ctx,next)=>{

   // await requestFilter.filter(ctx);

    if(ctx.method == 'POST' || ctx.method == 'PUT'){
        console.log(`body:\n${JSON.stringify(ctx.request.body,null,2)}`);
    }
    await next();
});
app.use(jsonExpand.routerPlugin);

app.use(router.routes());
let server = app.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Event listener for HTTP server "error" event.
function onError(error) {
    if(error.syscall !== 'listen'){ throw error; }
    let bind = typeof port === 'string' ? (`pipe ${port}`) : (`port ${port}`);
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error('[Server Start] --> '+bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error('[Server Start] --> '+bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
//Event listener for HTTP server "listening" event.
function onListening() {
    let addr = this.address();
    // let bind = typeof addr === 'string' ? (`pipe ${addr}`) : (`port ${addr.port}`);

    console.log(`[Server Start] --> ${server_name} listening on ${ip}:${addr.port}`);
}


