import {MP_WECHAT_APPID, PLATFORM_ID, REGION_ID, MP_APPLET_APPID} from './config'
import {userLogin} from '../api/platformgouc'
import {getAppIdOpenId, memberRegister} from '../api/infomember'
import Cookies from 'js-cookie'
import {getRegionData, getAppid} from '../api/infouser'
import {registerMemberSz} from '../api/shopmall'
import consts from './const'
import Vue from 'vue'

export const authLogin = ({success}) => {
    /*目前uni.login除h5以外均可以支持*/
    uni.login({
        success: loginRes => {
            //微信小程序情况下获取微信用户信息
            // #ifdef MP-WEIXIN
            uni.getUserInfo({
                provider: 'weixin',
                success: function (infoRes) {
                    console.log(infoRes)
                }
            });
            // #endif

            //调用登录接口，这里的code是属于微信小程序才会存在的code，如果是h5的话需要调用其他的登录接口
            userLogin({
                appId: MP_WECHAT_APPID,
                code: loginRes.code,
                op: 3,
                project: PLATFORM_ID
            }, {
                errorRedirect: true
            }).then(res => {
                //获取到对应的登录信息
                let token = res.object.token
                //保存token
                uni.setStorageSync('mspToken', token)
                //保存登录接口用户信息
                uni.setStorageSync('loginInfo', JSON.stringify(res.object));
                //调用注册接口
                memberRegister({
                    regionId: REGION_ID,
                    appid: MP_WECHAT_APPID,
                    appType: 1,
                    dataSource: 1,
                }, {
                    errorRedirect: true
                }).then(res => {
                    const phone = res.object.phone
                    //保存注册接口返回信息
                    uni.setStorageSync('loginInfo', JSON.stringify(res.object));
                    if (phone != null && phone !== '') {
                        uni.setStorageSync('mspIsMember', true)
                    }
                    if (success) {
                        success(token)
                    }
                })
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
        uni.redirectTo({
            url: '/pages/openId-page/index',
            success: res => {},
            fail: (res) => {
                console.log('跳转失败')
                console.log(res)
            },
            complete: () => {}
        })
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

        console.log('扫码进入h5的相关客户端', token)
        uni.setStorageSync('mspToken', token)
        //如果是h5公众号页面需要获取公众号appId
        getAppIdOpenId().then(res => {
            Vue.prototype.$appid = res.object.appId		//存入对应公众号appId
            memberRegister({
                regionId: REGION_ID,
                appid: res.object.appId || MP_WECHAT_APPID,
                appType: 1,
                dataSource: 1,
            }, {
                errorRedirect: true
            }).then(res => {
                let phoneH5 = res.object.phone
                //保存注册接口返回信息
                uni.setStorageSync('loginInfo', JSON.stringify(res.object));
                if (phoneH5 != null && phoneH5 !== '') {
                    uni.setStorageSync('mspIsMember', true)
                }
                if (success) {
                    success(token)
                }
            })
        })
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
                            // 获取当前渠道的appid
                            getAppid({
                                subjectType: 5,
                                subjectId: options.query.regionNo
                            }).then(res => {
                                if (res.object && res.object.unionPayCodeAppId) {
                                    getApplet(res.object.unionPayCodeAppId, data, success)
                                } else {
                                    getApplet(myAppId, data, success)
                                }
                            })
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
                    success: function () {
                        //如果是h5公众号页面需要获取公众号appId
                        getAppIdOpenId().then(res => {
                            Vue.prototype.$appid = res.object.appId		//存入对应公众号appId
                            memberRegister({
                                regionId: REGION_ID,
                                appid: res.object.appId || MP_WECHAT_APPID,
                                appType: 1,
                                dataSource: 1,
                            }, {
                                errorRedirect: true
                            }).then(res => {
                                let phoneH5 = res.object.phone
                                //保存注册接口返回信息
                                uni.setStorageSync('loginInfo', JSON.stringify(res.object));
                                if (phoneH5 != null && phoneH5 !== '') {
                                    uni.setStorageSync('mspIsMember', true)
                                }
                                if (success) {
                                    success(myToken)
                                }
                            })
                        })
                    }
                });
            }
        } else {
            //云闪付数字餐厅的情况下使用其他登录方式，确定是否属于云闪付登录后的链接
            if (options.query.openId) {
                //云闪付数字餐厅存入外部导入的数据
                uni.setStorageSync('unionpayOptions', options.query)
                //如果是h5公众号页面需要获取公众号appId
                getAppIdOpenId().then(resopnse => {
                    Vue.prototype.$appid = resopnse.object.appId		//存入对应公众号appId
                    //登录数字餐厅
                    registerMemberSz({
                        "openId": options.query.openId, //openId
                        "nonce": options.query.nonce, //随机数
                        "unionId": "", //云闪付用户标识
                        "phoneNo": "", //电话号
                        "subjectId": REGION_ID, //主体Id
                        "subjectType": 5 //主体类型 1，门店 5机构
                    }).then(res => {
                        uni.setStorageSync('mspToken', res.object.token || '')
                        uni.setStorageSync('loginInfo', JSON.stringify(res.object))
                        uni.setStorageSync('mspIsMember', true)
                        if (success) {
                            success(res.object.token)
                        }
                    })
                })
            } else {
                let myHref = 'https://cater.95516.com/web1/test/order.html?spId=sp000002&redirectUri=' + escape(window.location.href)
                window.location.replace(myHref)
            }
        }
    }
}

// 云闪付小程序调用的相关方法
export const getApplet = (myAppId, data, success) => {
    //调用登录接口，这里的code是属于微信小程序才会存在的code，如果是h5的话需要调用其他的登录接口
    userLogin({
        appId: myAppId,      //使用云闪付默认appid进行测试
        code: data.code,     // 通过云闪付app获取到的code，但是注意的是code
        op: 10,              // 云闪付小程序传10
        project: PLATFORM_ID
    }, {
        hideLoading: true,
        hideMsg: true,
        errorRedirect: false

        // errorRedirect: true
    }).then(res => {
        //获取到对应的登录信息
        let token = res.object.token
        //保存token
        uni.setStorageSync('mspToken', token)
        //保存登录接口用户信息
        uni.setStorageSync('loginInfo', JSON.stringify(res.object));
        //调用注册接口
        memberRegister({
            regionId: REGION_ID,
            appid: myAppId,
            appType: 1,
            dataSource: 1,
        }, {
            errorRedirect: true
        }).then(res => {
            const phone = res.object.phone
            //保存注册接口返回信息
            uni.setStorageSync('loginInfo', JSON.stringify(res.object));
            // 必须要存在手机号的时候才能够进行会员信息注册保存
            if (phone != null && phone !== '') {
                uni.setStorageSync('mspIsMember', true)
            }
            if (success) {
                success(token)
            }
        })
    }).catch(error => {
        // 这里写入一个默认的token
        success('gouc_5157d265ae374635905b1702bf7a487a')
        console.log(error)
    })
}


//h5情况下获取regionNo获取相关信息
export const authGetRegionNo = (options) => {
    // 存在桌台号的情况下title使用桌台号名称
    if (options.query && (options.query.deskNo || options.query.d)) {
        let deskNo = options.query.d || options.query.deskNo
        // 存入桌台号
        uni.setStorageSync('regionName', '桌台号：' + deskNo)
        return
    }
    if (REGION_ID && REGION_ID !== '' && REGION_ID !== null) {
        getRegionData({
            id: REGION_ID
        }).then(res => {
            uni.setStorageSync('regionName', res.object.regionName)
        })
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
    //uni.setStorageSync('h5OpenForm', 'UNIONPAY');
    return openForm
}
