#Remark
1.目前所有的测试环境请求IP都是经过网关，所以统一走网关的主机和端口，并在URL前面加上userServer的前缀.

6101的端口为业务组件，前缀为PlatformBusiServer。



###1.创建用户(同时创建账号，绑定角色)

创建一个新的用户。

http://localhost:6101/api/v1.0.0/registerUser

**http**

 post

**request**

此接口当从参数中没有找到merchantHref时，默认会从请求头的JWT TOKEN中获取商户链接。

```

{
  user:{
          name: 'liufei',
          email: 'liufei@sina.com',
          roleHref:'http://192.168.7.151:6002/api/v1.0.0/roles/crIuZ8AcUHBdJAxVVSlHHQ',
          ownerHref:'http://192.168.7.151:6004/api/v1.0.0/merchants/0BlAQi3BXAEEEurhYkVcgA',
        },
account:
     {
        "name": "liufei",          // 账户名
        "password": new Buffer("888888").toString('base64'),
        applicationName:'LaiKoo-Platform',
        merchantNumber :'90000017',
     }
 };

```

**response**

```
{
  "account": {
    "href": "http://192.168.7.151:6000/api/v1.0.0/accounts/VLixzkpQI9CqBc2xHx03ag",
    "merchantNumber": "90000017",
    "name": "liufei",
    "number": null,
    "mobile": null,
    "email": null,
    "description": null,
    "status": "enabled",
    "createdAt": "2018-05-31 10:55:31",
    "modifiedAt": "2018-05-31 10:55:31",
    "application": {
      "href": "http://192.168.7.151:6000/api/v1.0.0/applications/Sad9YHDXhm9cyMeoNvr2ig"
    },
    "logRecords": {
      "href": "http://192.168.7.151:6000/api/v1.0.0/accounts/VLixzkpQI9CqBc2xHx03ag/logRecords"
    },
    "logStatuses": {
      "href": "http://192.168.7.151:6000/api/v1.0.0/accounts/VLixzkpQI9CqBc2xHx03ag/logStatuses"
    }
  },
  "user": {
    "href": "http://192.168.7.151:6003/api/v1.0.0/users/54ReiQTCUNrpPCXmvo85zA",
    "name": "liufei",
    "description": null,
    "email": "liufei@sina.com",
    "sex": null,
    "mobile": null,
    "address": null,
    "age": 0,
    "type": 0,
    "headImgHref": null,
    "status": "enabled",
    "createdAt": "2018-05-31 10:55:32",
    "modifiedAt": "2018-05-31 10:55:32",
    "account": {
      "href": "http://192.168.7.151:6000/api/v1.0.0/accounts/VLixzkpQI9CqBc2xHx03ag"
    },
    "userOrganization": {
      "href": "http://192.168.7.151:6003/api/v1.0.0/userOrganizations/POHJvEs96Onc7SxMLQBNjw"
    },
    "department": {
      "href": null
    },
    "userRoleMemberShips": {
      "href": "http://192.168.7.151:6003/api/v1.0.0/users/54ReiQTCUNrpPCXmvo85zA/userRoleMemberShips"
    }
  }
}
```


###2.删除用户同时删除账号

删除用户同时删除账号，且解绑用户角色。

http://localhost:6101/api/v1.0.0/deleteUser

**http**

 post

**request**


```
{
  userHref:'http://192.168.7.151:6003/api/v1.0.0/users/wFkx4Dbmhzr2pzUIHrX8bg',
};

```

**response**

HTTP的状态码，成功返回200，失败返回其它错误码。




###3.获取角色的详情以及角色下的菜单列表(树形结构返回)

获取角色详细信息，以及角色下面所有关联的菜单以及操作权限，

http://localhost:6101/api/v1.0.0/roleDetails

**http**

 get

**request**

```
{
   roleHref:'http://localhost:6002/api/v1.0.0/roles/jmVlM29n94ZRRIRXhW1d6w',
    roleUUID:'GUu4Zz0788NughRrzYh7dw',  //支持角色UUID。
   applicationHref:'http://localhost:5000/api/v1.0.0/applications/BQZNqVpEbFxyZ7ayW7x2yA',
}

```

**response**

```
{
   {
     "href": "http://localhost:6002/api/v1.0.0/roles/jmVlM29n94ZRRIRXhW1d6w",
     "name": "工程师",
     "description": "345dfsf",
     "type": null,
     "status": "enabled",
     "createdAt": "2018-05-30 14:18:55",
     "modifiedAt": "2018-05-30 14:18:55",
     "application": {
       "href": "http://localhost:5000/api/v1.0.0/applications/BQZNqVpEbFxyZ7ayW7x2yA"
     },
     "merchant": {
       "href": "http://localhost:5006/api/v1.0.0/applications/bCqavvEkybc3ZZj65Vc05g"
     },
     "subMenuGroups":  //角色下的菜单信息。
     [

       {
         "uuid": "To5k6vVGDxh7OYBk8VRgOg",
         "name": "平台管理",
         "description": "datagg",
         "uiOrder": 2,
         "upLevelMenuGroupUUID": null,
         "status": "enabled",
         "subMenuGroups": [],
         "menus": [
           {
             "uuid": "n5vTUuqIhF3dO5sI3v1KHg",
             "name": "用户管理",
             "description": "sadfsaga",
             "type": 0,
             "number": "01",
             "menuId": "4578sdfs875c3",
             "iconHref": null,
             "uiOrder": 3,
             "menuGroupUUID": "To5k6vVGDxh7OYBk8VRgOg",
             "status": "enabled",
             "operators": [
               {
                 "uuid": "NEioVGygotPxrXR8lYjZwg",
                 "name": "用户列表",
                 "operatorId": "wefasdgsagsc6",
                 "uiOrder": 0,
                 "menuUUID": "n5vTUuqIhF3dO5sI3v1KHg",
                 "status": "enabled"
               }
             ]
           },
         ]
       }
     ]
   }

```


###4.同步系统菜单和操作权限

前端系统每次起来，调用此接口同步最新的菜单和操作权限，每次变化时版本也要跟随修改，

http://localhost:6101/api/v1.0.0/syncAppMenus

**http**

 POST

**request**

```
{
    applicationName: 'LaiKoo-Platform',
    version: '1.0.0',
    menus: [
        {
            name: '菜单管理aa',
            menuId:'5350A6A5-F274-4CCE-AD2A-866D04579CE8',
            operators:
                [
                    {
                        name:'菜单列表',
                        operatorId:'0E353358-75B4-417E-AFEA-7E5A7CE56AA2',
                    },
                    {
                        name:'新增菜单',
                        operatorId:'9175DE46-1DFD-4646-AC9E-1F66AD724511',
                    },
                ]
        },
        {
            name: '插件管理',
            menuId:'64D05948-36AD-41A0-AF78-75FA23D657C5',
            operators:
                [
                    {
                        name:'插件列表xx',
                        operatorId:'6129CC59-116C-4DD5-9BB2-74A83712F86A',
                    },
                ]
        },
        {
            name: '用户管理',
            menuId:'FCD1FDA4-A7A2-43D9-B4E1-3890A86E924C',
            operators:
                [
                    {
                        name:'用户列表',
                        operatorId:'4CE44A21-68DA-4ADA-B7EE-371187327F75',
                    },
                    {
                        name:'新增用户',
                        operatorId:'DCFE6EF3-60CD-4DA0-B360-53590321A7B9',
                    },
                ]
        },


    ]
}

```

**response**

```
{
  "menuOrganizationUpData": //返回最新的版本信息。
  {
    "uuid": "4DIFWtyPmwC22v0DJ0SIpg",
    "version": "1.0.0",
    "modifiedAt": "2018-06-05 11:17:51"
  }
}

```