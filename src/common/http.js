// 修改devTest
import Vue from 'vue'
import {BASE, BASE_URL, PLATFORM_ID} from './config'
import {authLogin} from './auth'

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
                if (res.data.statusCode === 401) {
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
                } else if (res.data.code === 0) {
                    let result = res.data.data
                    console.log(34234)
                    console.log(result)
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
