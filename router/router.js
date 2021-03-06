/**
 * Created by Administrator on 2016/8/18.
 */
const Router = require('koa-router');
let router = new Router();
const rolesInterface = require('../controllers/interface/rolesInterface');
const userInterface = require('../controllers/interface/userInterface');
const menuInterface = require('../controllers/interface/menuInterface');

//获取角色下的菜单和操作权限列表，按照菜单目录树形结构返回。
router.get('/api/:version/roleDetails',rolesInterface.getRoleDetails);

/** 2018/5/31  注册用户的同时，创建账号，绑定角色。
 lpy-modifyed  */
router.post('/api/:version/registerUser',userInterface.registerUser);

router.post('/api/:version/deleteUser',userInterface.deleteUser);


router.post('/api/:version/syncAppMenus',menuInterface.syncAppMenus);

/** 2018/6/5 创建角色,支持对象UUID。
 lpy-modifyed  */
router.post('/api/:version/roles',rolesInterface.create);

/** 2018/6/5  更新角色,支持对象UUID。
 lpy-modifyed  */
router.post('/api/:version/roles/:roleUUID',rolesInterface.update);


/** 2018/6/12  不走业务组件，改走网关路由过滤。
 lpy-modifyed  */
/* 2018/6/11 创建菜单分组,支持应用名称，拥有者UUID,加拥有者类型。
 lpy-modifyed  */
//router.post('/api/:version/menuGroups',menuInterface.createMenuGroups);



/** 2018/6/11 列表树形菜单分组，支持应用名称，拥有者UUID,加拥有者类型。
 lpy-modifyed  */
//router.get('/api/:version/treeMenus',menuInterface.treeMenus);


/** 2018/6/11 列表元菜单，支持应用名称，拥有者UUID。
 lpy-modifyed  */
//router.get('/api/:version/metaMenus',menuInterface.listMetaMenus);


/** 2018/6/8 此接口废除，改为GRAPHQL
 lpy-modifyed  */
//router.get('/api/:version/roles',rolesInterface.list);

module.exports = router;
