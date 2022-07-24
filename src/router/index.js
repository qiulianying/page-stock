let testArray = [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
    {
        "path": "pages/index/index",
        "style": {
            "enablePullDownRefresh": true,
            "backgroundTextStyle": "light", // 下拉刷新loading小圆点颜色，白底+白色小圆点可以实现“隐藏”原生小圆点哦
            "navigationStyle": "custom" // 自定义导航栏(不自定义导航栏也可以使用本组件哦，只不过就只能使用原生小圆点样式了，无法自定义下拉刷新样式)
            // "backgroundColor": "#34A2E8" // 页面背景底色
        }
    },{
        "path": "pages/shop/shop-check",
        "style": {
            "navigationBarTitleText": "买单"
        }
    },
    {
        "path": "pages/shop/shop-check-success"
    },
    {
        "path": "pages/shop/categories",
        "style": {
            "enablePullDownRefresh": true,
            "backgroundTextStyle": "light", // 下拉刷新loading小圆点颜色，白底+白色小圆点可以实现“隐藏”原生小圆点哦
            "navigationStyle": "custom" // 自定义导航栏(不自定义导航栏也可以使用本组件哦，只不过就只能使用原生小圆点样式了，无法自定义下拉刷新样式)
            // "backgroundColor": "#34A2E8" // 页面背景底色
        }
    },	{
        "path": "pages/shop/search"
    },
    {
        "path": "pages/shop/goods-detail"
    },
    {
        "path": "pages/shop/goods-list"
    },
    {
        "path": "pages/shop/order-submit"
    },
    {
        "path": "pages/shop/map-edit"
    },
    {
        "path": "pages/shop/settlement"
    },
    {
        "path": "pages/shop/remarks"
    },
    {
        "path": "pages/shop/shopSearch"
    },
    {
        "path": "pages/shop/list-detail"
    },
    {
        "path": "pages/shop/user/user-deal-record-detail",
        "style": {
            "navigationBarTitleText": "新建地址"
        }
    },
    {
        "path": "pages/shop/user/user-address-list",
        "style": {
            "navigationBarTitleText": "收货地址"
        }
    },
    {
        "path": "pages/shop/user/user-address-manage"
    },
    {
        "path": "pages/shop/user/user"
    }
]
modules.exports = testArray
