// router.js
import {RouterMount,createRouter} from 'uni-simple-router';
import store from "../store";
const router = createRouter({
    platform: process.env.VUE_APP_PLATFORM,
    routes: [...ROUTES]
});
// 获取到的全部的路由数据
if (ROUTES.length > 0) {
    // 路由数据存入缓存
    uni.setStorageSync('myRouter', ROUTES)
}

//全局路由前置守卫
router.beforeEach((to, from, next) => {
    next();
});
// 全局路由后置守卫
router.afterEach((to, from) => {
    store.dispatch('changeRouterNow', to.path)
    // 调用父类全局方法
    if (!parent.getOption) {
        return
    }
    parent.getOption(to.path)
})

export {
    router,
    RouterMount
}
