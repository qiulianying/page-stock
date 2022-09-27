// 修改devTest
import Vue from 'vue'
import {BASE, BASE_URL, PLATFORM_ID} from './config'

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
    console.log(data)
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
                if (res.data.code === 1) {
                    console.log('报的情错况，需要进行额外判断是否是由于没有权限')
                    console.log(res)
                    if (res.data.data && res.data.data.code && (res.data.data.code == '100002' || res.data.data.code == '100003')) {
                        // 这里直接跳转登录页面让用户进行登录处理
                        uni.navigateTo({
                            url: '/pages/login/login'
                        })
                    }
                    // // #ifndef H5
                    // // 重新调用登录接口获取token
                    // authLogin({
                    //     success: res => {
                    //         try {
                    //             uni.setStorageSync('mspToken', res)
                    //             showToast(httpLang.loginSuccessful)
                    //             http(url, data, option, apiType).then((res)=>{
                    //                 resolve(res) //把队列形态的promise 的resolve的res 在这里完成 两级resolve
                    //             }).catch(err => {
                    //                 reject(err.errmsg || err.error)
                    //             })
                    //         } catch (e) {
                    //             console.error(e)
                    //         }
                    //     }
                    // })
                    // #endif
                } else if (res.data.code === 0) {
                    // 执行成功的情况
                    let result = res.data
                    resolve(result)
                } else {
                    // 其他情况默认失败
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
