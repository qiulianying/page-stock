// 修改devTest
import Vue from 'vue'
import {BASE, BASE_URL, PLATFORM_ID} from './config'
import {authLogin} from './auth'
import store from '../store/index'

const showToast = (title) => {
    uni.showToast({
        title: title,
        icon: 'none',
        duration: 5000
    })
}
const http = (url, data = {}, option = {}, apiType) => {
    let hideLoading = option.hideLoading || false
    let hideMsg = option.hideMsg || false
    let contentType = option.contentType || 'application/json'
    let errorRedirect = option.errorRedirect || false
    let token = ''
    //根据高毓锋2021.8.30日要求，以下下单接口，包括商品和权益的下单，强制参数中添加formId，参数内容随意
    if ((url.indexOf('api/v1/order') !== -1 && url.indexOf('jft/api/v1/order') === -1) || url.indexOf('api/v2/order') !== -1 || url.indexOf('order/pay') !== -1 || url.indexOf('api/v1/takeout/order') !== -1) {
        data.formId = '123456789'
    }

    try {
        token = uni.getStorageSync('mspToken')
    } catch (e) {
        console.error(e)
    }
    if (!hideLoading) {
        uni.showLoading({
            title: Vue.prototype.$t('pub').loading,
            mask: true
        })
    }
    return new Promise((resolve, reject) => {
        const httpLang = Vue.prototype.$t('js.http')
        let myurl
        if (apiType && apiType !== 'justBase') {
            myurl = `${BASE_URL}/${apiType}/${url}`
        } else if (apiType === 'justBase') {
            myurl = `${BASE}/${url}`
        } else {
            myurl = `${BASE_URL}/${url}`
        }
        uni.request({
            url: myurl,
            method: option.method || 'POST',
            header: {
                'platform-id': PLATFORM_ID,
                'token': token,
                'request-source': Vue.prototype.$platform,
                'content-type': contentType
            },
            data: data,
            success: res => {
                if (!hideLoading) uni.hideLoading()
                if (res.statusCode === 401) {
                    // showToast(httpLang.loginTimeout)

                    // #ifndef H5
                    // 重新调用登录接口获取token
                    authLogin({
                        success: res => {
                            try {
                                uni.setStorageSync('mspToken', res)
                                showToast(httpLang.loginSuccessful)
                                http(url, data, option, apiType).then((res)=>{
                                    resolve(res) //把队列形态的promise 的resolve的res 在这里完成 两级resolve
                                }).catch(err => {
                                    reject(err.errmsg || err.error)
                                })
                            } catch (e) {
                                console.error(e)
                            }
                        }
                    })
                    // #endif
                } else if (res.statusCode === 200) {
                    let result = res.data
                    if (result.errcode === '0' || result.errcode === '404003') {
                        //判断是否是member/account接口，如果是的话，就获取相关的接口数据进行验证
                        if (url === 'member/account') {
                            if (result.object.account) {
                                if (result.object.account[0].enableMemberPassword === 1) {
                                    store.dispatch('changeEnableMember', {
                                        type: 1
                                    })
                                } else {
                                    store.dispatch('changeEnableMember', {
                                        type: 0
                                    })
                                }
                                if (result.object.account[0].hasPassword === 1) {
                                    store.dispatch('changeHasPassword', {
                                        type: 1
                                    })
                                } else {
                                    store.dispatch('changeHasPassword', {
                                        type: 0
                                    })
                                }
                            }
                        }
                        resolve(result)
                        return
                    }
                    reject(result.errmsg || result.error)
                    if (!hideMsg) {
                        if (errorRedirect) {
                            uni.redirectTo({
                                url: '/pages/error/error?error=' + encodeURIComponent(result.errmsg || result.error)
                            })
                        } else {
                            if (result.errmsg === '该用户未开户，请检查!') {
                                // #ifdef MP-WEIXIN
                                showToast('钱包未开通，请开通钱包!')
                                // #endif
                            } else {
                                showToast(result.errmsg || result.error)
                            }

                        }
                    }
                } else {
                    if (!hideMsg) {
                        if (errorRedirect) {
                            uni.redirectTo({
                                url: '/pages/error/error?error=' + encodeURIComponent('[' + res.statusCode + '] ' + httpLang.sysErr)
                            })
                        } else {
                            showToast('[' + res.statusCode + '] ' + httpLang.sysErr)
                        }
                    }
                    reject('[' + res.statusCode + '] ' + httpLang.sysErr)
                }
            },
            fail: (err) => {
                if (!hideLoading) uni.hideLoading()
                if (err.errMsg != 'request:fail abort') {
                    if (!hideMsg) {
                        if (errorRedirect) {
                            uni.redirectTo({
                                url: '/pages/error/error?error=' + encodeURIComponent(httpLang.networkErr)
                            })
                        } else {
                            showToast(httpLang.networkErr)
                        }
                    }
                    reject(httpLang.networkErr)
                }
            }
        })
    })
}
export default http
