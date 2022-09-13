import {MP_WECHAT_APPID, PLATFORM_ID, REGION_ID, MP_APPLET_APPID} from './config'
import Cookies from 'js-cookie'
import consts from './const'
import Vue from 'vue'
import {getOpenId} from "../api/platformgouc";

export const authLogin = ({success}) => {
    /*目前uni.login除h5以外均可以支持*/
    uni.setStorageSync('openId', '111111');
    uni.login({
        success: loginRes => {
            //微信小程序情况下获取微信用户信息
            // #ifdef MP-WEIXIN
            uni.getUserInfo({
                provider: 'weixin',
                success: function (infoRes) {}
            });
            // #endif
            // 执行登录并获取code
            getOpenId({
                code: loginRes.code,
            }, {
                errorRedirect: false
            }).then(res => {
                //保存注册接口返回信息
                uni.setStorageSync('openId', res.data);
            })
        }
    })
}

// 获取当前窗口url中param参数的值
function getQueryVariable(variable) {
    let query = window.location.hash.substring(3);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}

//对应公众号h5情况下进行登录
export const authLoginH5 = ({success}, options) => {
    // 进行链接风格，如果有存在/#/之前的链接名称有pageType = 101的情况下，作为查看类型页面，直接返回成功，用于进行openId查看
    let hrefInfo = (window.location.href).split('/#/')[0]
    console.log('window.location.href', window.location.href, hrefInfo)
    if (hrefInfo.indexOf('pageType=101') > -1) {
        //获取公众号转入的token
        let token = Cookies.get('token') || ''
        console.log('token', token)
        uni.setStorageSync('mspToken', token)
        return
    }

    let ordinary = 'ordinaryUnionpay'       // 默认使用普通云闪付
    //如果连接中存在桌台号就获取
    if (options.query && (options.query.deskNo || options.query.d)) {
        let deskNo = options.query.d || options.query.deskNo
        // 存入桌台号
        uni.setStorageSync('deskNo', deskNo)
    }

    //判断当前扫码进入h5的相关客户端
    if (uni.getStorageSync('h5OpenForm') === 'WECHAT' || uni.getStorageSync('h5OpenForm') === 'ALIPAY') {
        //获取公众号转入的token
        let token = Cookies.get('token') || ''
        uni.setStorageSync('mspToken', token)
    } else if (uni.getStorageSync('h5OpenForm') === 'UNIONPAY' || uni.getStorageSync('h5OpenForm') === 'UNIONPAYAPPLET') {
        // 非数字餐厅的情况，默认使用云闪付默认的登录方式，云闪付小程序以及云闪付h5使用的相同流程
        if (ordinary === 'ordinaryUnionpay') {
            if (uni.getStorageSync('h5OpenForm') === 'UNIONPAYAPPLET') {
                // 云闪付小程序进入
                // upsdk初始化
                upsdk.appletAuth({
                    success: function (data) {
                        // 云闪付小程序通过regionNO获取对应的appid
                        let myAppId = MP_APPLET_APPID
                        if (options && options.query && options.query.regionNo) {
                        } else {
                            getApplet(myAppId, data, success)
                        }
                    },
                    fail: function (error) {
                        // alert(JSON.stringify(error))
                        // error={errcode:’xxx’, errmsg:’xxx’}
                    }
                })
            } else {
                // 云闪付h5扫码进入
                let myToken = Cookies.get('token') || ''
                uni.setStorage({
                    key: 'mspToken',
                    data: myToken,
                    success: function () {}
                });
            }
        } else {
            //云闪付数字餐厅的情况下使用其他登录方式，确定是否属于云闪付登录后的链接
            if (options.query.openId) {
                //云闪付数字餐厅存入外部导入的数据
                uni.setStorageSync('unionpayOptions', options.query)
            } else {
                let myHref = 'https://cater.95516.com/web1/test/order.html?spId=sp000002&redirectUri=' + escape(window.location.href)
                window.location.replace(myHref)
            }
        }
    }
}

// 云闪付小程序调用的相关方法
export const getApplet = (myAppId, data, success) => {}


//h5情况下获取regionNo获取相关信息
export const authGetRegionNo = (options) => {
    // 存在桌台号的情况下title使用桌台号名称
    if (options.query && (options.query.deskNo || options.query.d)) {
        let deskNo = options.query.d || options.query.deskNo
        // 存入桌台号
        uni.setStorageSync('regionName', '桌台号：' + deskNo)
        return
    }
}

//判断h5情况下当前是被客户端打开来源
export const authOpenForm = (options) => {
    let openForm = consts.OPEN_TYPE.NONE
    // 微信
    if (/MicroMessenger/.test(window.navigator.userAgent)) {
        openForm = consts.OPEN_TYPE.WECHAT
    }
    // 支付宝
    if (/AlipayClient/.test(window.navigator.userAgent)) {
        openForm = consts.OPEN_TYPE.ALIPAY
    }
    // 云闪付：这里注意云闪付h5以及云闪付小程序在软件中都是h5打开，
    // 所以这里只能判断到属于云闪付打开，需要判断额外链接中的参数确定是云闪付h5还是云闪付小程序
    // IsApplet=true：云闪付小程序 否则都是h5
    if (/UnionPay/.test(window.navigator.userAgent)) {
        if (options.query && options.query.IsApplet && options.query.IsApplet === 'true') {
            openForm = consts.OPEN_TYPE.UNIONPAYAPPLET
        } else {
            openForm = consts.OPEN_TYPE.UNIONPAY
        }
    }
    //h5客户端开启方式
    uni.setStorageSync('h5OpenForm', openForm)
    return openForm
}
