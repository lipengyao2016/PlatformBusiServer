/**
 * Created by Administrator on 2016/8/18.
 */
const Router = require('koa-router');
let router = new Router();
const rolesInterface = require('../controllers/interface/rolesInterface');



//获取角色下的菜单和操作权限列表，按照菜单目录树形结构返回。
router.get('/api/:version/roleDetails',rolesInterface.getRoleDetails);



module.exports = router;
