import Vue from 'vue'
import App from './App'
import store from './store'
import VueI18n from 'vue-i18n'
import util from './common/util'
import shopMall from './common/shopMall'
import {
	FILE_URL,
	UPLOAD_URL,
	MP_WECHAT_APPID,
	MP_APPLET_APPID,
	REGION_ID,
	REGION_ID_DRUG,
	SPMATE_FILE_URL,
	EVN_APP_PROCESS,
	BASE_Software_Park
} from './common/config'
import consts from './common/const'
import upload from './common/upload'
import appPlugin from './plugins/app'
import {
	globalMixins
} from './mixins/global'
import cuCustom from './colorui/components/cu-custom.vue'
// import share from './common/share'
//引入uView，uView在小程序以及h5的组件兼容方面还可以
import uView from "uview-ui";
import {IMG_PRE_URL} from './common/env'

// 针对uni-app自动化代理处理
import {router,RouterMount} from './router/router.js'  //路径换成自己的
Vue.use(router)


// 测试引入弹窗组件
import DialogTest from './components/dialogTest/index'
let Profile = Vue.extend(DialogTest)
let instance = new Profile().$mount()
// document.body.appendChild(instance.$el)
//import instance from './components/dialogTest/instance'
//Vue.prototype.$errorMsg = instance
Vue.prototype.$errorMsg = instance

/*
* 引入云闪付授权组件：主要用于云闪付小程序或者h5打开情况下使用
* 这里需要注意的是，这里不是用云闪付适配vue.js的情况，而是使用云闪付适配uni-app的情况，所以这里common.js需要修改
* 参考git：https://gitee.com/openunionpay  uni-app demo
* 需要注意的是云闪付组件和在微信小程序里面会报错，这里需要保证云闪付h5或者云闪付小程序需要在h5情况下使用
* */
// #ifdef H5
import VueCupUI from './static/vue-cup-ui/lib/vue-cup-ui.common.js'
import './static/vue-cup-ui/lib/vue-cup-ui.css'
Vue.use(VueCupUI)
// #endif

Vue.use(uView); //使用uView
Vue.use(VueI18n)
Vue.component('cu-custom', cuCustom)
Vue.config.productionTip = false

const i18n = new VueI18n({
	locale: 'zh-CN',
	messages: {
		'en-US': require('./locales/lang/en-US.js'),
		'zh-CN': require('./locales/lang/zh-CN.js')
	}
})
Vue.prototype._i18n = i18n

Vue.mixin(globalMixins)
Vue.prototype.$store = store
Vue.prototype.$util = util
Vue.prototype.$shopMall = shopMall
Vue.prototype.$fileURL = FILE_URL
Vue.prototype.$spMatefileURL = SPMATE_FILE_URL
// 封装的uni-app文件流上传方式
Vue.prototype.$upload = upload
Vue.prototype.$const = consts
Vue.prototype.$plugin = {
	app: appPlugin
}
Vue.prototype.$platform = appPlugin.getPlatform()
Vue.prototype.$onLaunched = new Promise(resolve => {
	Vue.prototype.$isResolve = resolve
})

// #ifdef MP-WEIXIN
Vue.prototype.$appid = MP_WECHAT_APPID //对应小程序的appId，其他情况下通过其他方式获取
// #endif
// #ifdef H5
Vue.prototype.$appid = MP_APPLET_APPID //对应的appId，h5的情况下都是使用的是其他的appid
// #endif

Vue.prototype.$imgUrl = IMG_PRE_URL || ''

Vue.prototype.$regionId = REGION_ID
Vue.prototype.$regionIdDrug = REGION_ID_DRUG
Vue.prototype.$process = EVN_APP_PROCESS
Vue.prototype.$Software = BASE_Software_Park
Vue.prototype.$imageFixStr = (width, height) => {
	let fixStr = `?x-oss-process=image/resize,m_fill,h_${height},w_${width}&x-image-process=image/resize,m_fill,h_${height},w_${width}` //图片后缀
	return fixStr
}
Vue.prototype.$isMemmber = () => {
	let isMember = false
	try {
		isMember = uni.getStorageSync('mspToken') || false
	} catch (e) {
		console.error(e)
	}
	return isMember
}

/*
* 在uni-app中自定义编写
* page：路径
* * mustReg：是否需要确保登录后获取了token情况下才能跳转
* isRedirect：是否需要直接跳转或者保存当前路径跳转
* isPackage：是否分包
* */
Vue.prototype.$toView = (page, mustReg = false, isRedirect = false, isPackage = false) => {
	let url = ''
	if (!isPackage) {
		// 如果不是分包里面的路由
		url = mustReg && !Vue.prototype.$isMemmber() ?
			`/pages/login/login?fromurl=${encodeURIComponent(`/pages/${page}`)}` : `/pages/${page}`
	} else {
		url = mustReg && !Vue.prototype.$isMemmber() ?
			`/pages/login/login?fromurl=${encodeURIComponent(`${page}`)}` : `${page}`
	}
	if (isRedirect) {
		uni.redirectTo({
			url: url
		})
	} else {
		uni.navigateTo({
			url: url
		})
	}
}
App.mpType = 'app'

const app = new Vue({
	i18n,
	store,
	...App
})

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app,router,'#app')
// #endif


// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
