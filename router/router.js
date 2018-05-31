/**
 * Created by Administrator on 2016/8/18.
 */
const Router = require('koa-router');
let router = new Router();
const rolesInterface = require('../controllers/interface/rolesInterface');
const userInterface = require('../controllers/interface/userInterface');


//获取角色下的菜单和操作权限列表，按照菜单目录树形结构返回。
router.get('/api/:version/roleDetails',rolesInterface.getRoleDetails);

/** 2018/5/31  注册用户的同时，创建账号，绑定角色。
 lpy-modifyed  */
router.post('/api/:version/registerUser',userInterface.registerUser);

router.post('/api/:version/deleteUser',userInterface.deleteUser);

module.exports = router;
