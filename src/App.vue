<style lang="scss">
    /* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
    @import "uview-ui/index.scss";
</style>
<script>
    import Vue from 'vue'
    import {
        authLogin,
        authLoginH5,
        authGetRegionNo,
        authOpenForm
    } from './common/auth'
    import {
        getSysParametersApi
    } from './api/shopmall'
    import {
        getMerchantDetail,
        getFindById
    } from './api/infouser'
    import store from "./store";
    export default {
        data() {
            return {}
        },
        onLaunch: async function(options) {
            let _this = this
            console.log('App Launch')


            // #ifdef MP-WEIXIN
            //通过缓存设置当前的主题样色
            //uni.setStorageSync('themeColor', '#34A2E8')
            uni.setStorageSync('themeColor', '#353D96')
            uni.setStorageSync('themeShadow', '#4753F6')
            //给微信小程序ios情况下默认固定值大概范围，修复
            Vue.prototype.StatusBar = 44
            Vue.prototype.CustomBar = 95
            // #endif

            // 中英文国际化处理
            this.changeLang()

            // #ifdef H5
            //h5情况下，需要验证是通过什么软件进入h5链接的
            store.dispatch('changeSetNowLoading', true)
            uni.setStorageSync('deskNo', null)
            authOpenForm(options)
            // #endif

            try {
                uni.removeStorageSync('mspIsMember');
            } catch (e) {
                console.error(e)
            }

            // #ifdef H5
            //调用登录接口
            await this.userLogin(options)

            authGetRegionNo(options)
            // #endif

            // #ifdef MP
            this.mpUpdate()
            // #endif

            //调用获取变量接口
            await this.getSysParametersApiInfo()

            uni.getSystemInfo({
                success: function(e) {
                    _this.$nextTick(function() {
                        // #ifndef MP
                        Vue.prototype.StatusBar = e.statusBarHeight;
                        if (e.platform == 'android') {
                            Vue.prototype.CustomBar = e.statusBarHeight + 50;
                        } else {
                            Vue.prototype.CustomBar = e.statusBarHeight + 45;
                        }
                        // #endif
                        // #ifdef MP-WEIXIN || MP-QQ
                        Vue.prototype.StatusBar = e.statusBarHeight;
                        let capsule = wx.getMenuButtonBoundingClientRect();

                        //修复colorui组件的bug，当ios手机情况下有时候获取气泡按钮的数据为0
                        if (capsule) {
                            Vue.prototype.Custom = capsule;
                            // Vue.prototype.capsuleSafe = uni.upx2px(750) - capsule.left + uni.upx2px(750) - capsule.right;
                            Vue.prototype.CustomBar = capsule.bottom + capsule.top - e
                                .statusBarHeight;
                            if (capsule.bottom === 0 || capsule.top === 0) {
                                Vue.prototype.CustomBar = e.statusBarHeight + 40;
                            }
                        } else {
                            Vue.prototype.CustomBar = e.statusBarHeight + 40;
                        }
                        console.log('当前输出' + e.statusBarHeight)
                        console.log('最终' + Vue.prototype.CustomBar)
                        // #endif

                        // #ifdef MP-ALIPAY
                        Vue.prototype.StatusBar = e.statusBarHeight;
                        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
                        // #endif
                    })
                }
            })

        },
        onShow: function(options) {
            console.log('App Show:')
            // #ifdef MP-WEIXIN
            if (options.scene === 1011) {
                store.dispatch('changeSetNowLoading', true)
            }
            //调用登录接口
            this.userLogin(options)
            // #endif
        },
        onHide: function() {
            console.log('App Hide')
        },
        methods: {
            mpUpdate() {
                const updateManager = uni.getUpdateManager()

                updateManager.onCheckForUpdate(res => {
                    if (res.hasUpdate) {
                        uni.showModal({
                            content: '发现新版本',
                            showCancel: false,
                            confirmText: '升级',
                            success: res => {
                                if (res.confirm) {
                                    updateManager.onUpdateReady(res => {
                                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                        updateManager.applyUpdate()
                                    })

                                    updateManager.onUpdateFailed(res => {
                                        // 新的版本下载失败
                                        uni.showModal({
                                            content: '下载失败，请删除当前小程序后重新打开',
                                            showCancel: false,
                                            confirmText: '知道了'
                                        })
                                    })
                                }
                            }
                        })
                    }
                })
            },
            // 微信小程序区分不同情况下的跳转
            weixinAuthLogin(pageType, id, price, takeout) {
                if (pageType == '4' && id) {
                    uni.redirectTo({
                        url: `/pages/shop/shop-check?merchantNo=${id}&price=${price}&pageType=${pageType}`,
                        success: res => {},
                        fail: (
                            res
                        ) => {
                            console
                                .log(
                                    '跳转失败'
                                )
                            console
                                .log(
                                    res
                                )
                        },
                        complete: () => {
                            store.dispatch('changeSetNowLoading', false)
                        }
                    })
                } else if (pageType == '2' && id) {
                    if (takeout) {
                        //直接跳转到商城页面
                        uni.removeStorageSync('ISORDER')
                    } else {
                        //直接跳转到点单页面，进入点单模式
                        uni.setStorageSync(
                            'ISORDER',
                            true)
                    }
                    uni.redirectTo({
                        url: `/pages/shop/categories?pageType=1&id=${id}&pageType=${pageType}`,
                        success: res => {},
                        fail: (
                            res
                        ) => {
                            console
                                .log(
                                    '跳转失败'
                                )
                            console
                                .log(
                                    res
                                )
                        },
                        complete: () => {
                            store.dispatch('changeSetNowLoading', false)
                        }
                    })
                }
            },
            userLogin(options) {
                // #ifndef H5
                //除了h5平台的其他平台编译
                authLogin({
                    success: res => {
                        try {
                            this.$isResolve()
                            if (res) {
                                if (options.query && options.query.q) {
                                    console.log(options)
                                    // 获取微信端返回的普通链接
                                    let url = decodeURIComponent(options.query.q)
                                    console.log(url)
                                    let id = this.getQueryVariable('id', url)
                                    let pageType = this.getQueryVariable('pageType', url)
                                    let price = this.getQueryVariable('price', url)
                                    let qid = this.getQueryVariable('qid', url)
                                    let takeout = this.getQueryVariable('takeout', url)
                                    // 如果存在qid，有限使用qid进行对应点属性获取
                                    if (qid) {
                                        // 调用接口获取存在的所有所有数据内容并加入缓存
                                        getFindById({
                                            id: qid
                                        }).then(res => {
                                            // 对应的数据存入缓存，需要获取的数据进行对应判断
                                            if (res.object) {
                                                console.log('res.object-----------')
                                                uni.setStorageSync('qidInfo', res.object);
                                                console.log(res.object.pageType)
                                                if (res.object.pageType) pageType = res.object.pageType
                                                if (res.object.merchantNo) id = res.object.merchantNo
                                                let postPrice
                                                if (res.object.price) {
                                                    postPrice = res.object.price
                                                } else {
                                                    postPrice = price
                                                }
                                                // if (res.object.price) price = res.object.price
                                                this.weixinAuthLogin(pageType, id, postPrice, takeout)
                                            }
                                        })
                                    } else {
                                        this.weixinAuthLogin(pageType, id, price, takeout)
                                    }
                                }
                            }
                        } catch (e) {
                            console.error(e)
                        }
                    }
                })
                // #endif

                /*h5情况下的登录：如果是公众号页面就获取cookie中的token*/
                // #ifdef H5
                authLoginH5({
                    success: (res) => {
                        try {
                            this.$isResolve()
                            if (res) {
                                //h5的情况下，需要判断当前进入的路由情况以及对应参数，如果存在某些特殊情况需要进行直接跳转，对应pageType的不同直接进入不同页面
                                // 进入首页的时候保存所有连接相关内容
                                if (options.query) {
                                    uni.setStorageSync('optionAllInfo', options.query)
                                }
                                if (options.query && options.query.pageType) {
                                    if (options.query.pageType == '4' && options.query.id) {
                                        //直接跳转对应的收款码页面，由于这里只有门店号，所以需要通过吗，门店号反向获取regionNo
                                        getMerchantDetail({
                                            merchantNo: options.query.id
                                        }).then(res => {
                                            Vue.prototype.$regionId = res.object.regionNo
                                            //链接跳转必须在缓存已修改的情况下进行，使用异步
                                            uni.setStorage({
                                                key: 'regionNo',
                                                data: res.object.regionNo,
                                                success: function() {
                                                    uni.setStorage({
                                                        key: 'regionName',
                                                        data: res.object.region,
                                                        success: function() {
                                                            store.dispatch(
                                                                'changeSetNowLoading',
                                                                false)
                                                            uni.redirectTo({
                                                                url: `/pages/shop/shop-check?merchantNo=${options.query.id}`,
                                                                success: res => {},
                                                                fail: (
                                                                    res
                                                                ) => {
                                                                    console
                                                                        .log(
                                                                            '跳转失败'
                                                                        )
                                                                    console
                                                                        .log(
                                                                            res
                                                                        )
                                                                },
                                                                complete: () => {}
                                                            })
                                                        }
                                                    });
                                                }
                                            });
                                        })
                                    } else if (options.query.pageType == '1' && options.query.id) {
                                        // 进入门店会员中心
                                        getMerchantDetail({
                                            merchantNo: options.query.id
                                        }).then(res => {
                                            console.log('resres', res)
                                            Vue.prototype.$regionId = res.object.regionNo
                                            uni.setStorage({
                                                key: 'regionNo',
                                                data: res.object.regionNo,
                                                success: function() {
                                                    uni.setStorage({
                                                        key: 'regionName',
                                                        data: res.object.region,
                                                        success: function() {
                                                            // 进入门店会员中心
                                                            store.dispatch(
                                                                'changeSetNowLoading',
                                                                false)
                                                            if (res.object.enableMember == 1) {
                                                                let shopInfo = {
                                                                    merchantNo: res.object.merchantNo,
                                                                    merchantName: res.object.merchantName,
                                                                    id: res.object.id,
                                                                    linkPhone: res.object.linkPhone,
                                                                    origin: res.object.origin,
                                                                    userId: res.object.userId,
                                                                }
                                                                shopInfo = JSON.stringify(shopInfo)
                                                                uni.redirectTo({
                                                                    url: `/myPackageA/pages/member/index?shopInfo=${shopInfo}`,
                                                                    success: res => {},
                                                                    fail: (
                                                                        res
                                                                    ) => {
                                                                        console
                                                                            .log(
                                                                                '跳转失败'
                                                                            )
                                                                        console
                                                                            .log(
                                                                                res
                                                                            )
                                                                    },
                                                                    complete: () => {}
                                                                })
                                                            } else {
                                                                store.dispatch('changeSetNowLoading', false)
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        })
                                    } else if (options.query.pageType == '2' && options.query.id) {
                                        getMerchantDetail({
                                            merchantNo: options.query.id
                                        }).then(res => {
                                            Vue.prototype.$regionId = res.object.regionNo
                                            uni.setStorage({
                                                key: 'regionNo',
                                                data: res.object.regionNo,
                                                success: function() {
                                                    uni.setStorage({
                                                        key: 'regionName',
                                                        data: res.object.region,
                                                        success: function() {
                                                            if (options.query.takeout && options.query.takeout == 'true') {
                                                                //直接跳转到商城页面
                                                                uni.removeStorageSync('ISORDER')
                                                            } else {
                                                                //直接跳转到点单页面，进入点单模式
                                                                uni.setStorageSync(
                                                                    'ISORDER',
                                                                    true)
                                                            }
                                                            store.dispatch('changeSetNowLoading', false)
                                                            let myUrl = `/pages/shop/categories?pageType=2&id=${ options.query.id }`
                                                            if (options.query.d || options.query.deskNo) {
                                                                let d = options.query.d || options.query.deskNo
                                                                myUrl = `/pages/shop/categories?pageType=2&deskNo=${d}&id=${ options.query.id }`
                                                            }
                                                            uni.redirectTo({
                                                                url: myUrl,
                                                                success: res => {},
                                                                fail: (
                                                                    res
                                                                ) => {
                                                                    console
                                                                        .log(
                                                                            '跳转失败'
                                                                        )
                                                                    console
                                                                        .log(
                                                                            res
                                                                        )
                                                                },
                                                                complete: () => {}
                                                            })
                                                        }
                                                    });
                                                }
                                            });
                                        })
                                    } else {
                                        store.dispatch('changeSetNowLoading', false)
                                    }
                                } else {
                                    store.dispatch('changeSetNowLoading', false)
                                }
                            }
                        } catch (e) {
                            console.error(e)
                        }
                    },
                }, options)
                // #endif
            },
            getSysParametersApiInfo() {
                //获取变量
                getSysParametersApi({}, {
                    errorRedirect: true
                }).then(() => {})
            },
            changeLang() {
                let lang = 'zh-CN'
                try {
                    lang = uni.getSystemInfoSync().language
                } catch (err) {
                    console.error(err)
                }
                if (lang.indexOf('en') === 0) {
                    this.$i18n.locale = 'en-US'
                } else if (lang.indexOf('zh') === 0) {
                    this.$i18n.locale = 'zh-CN'
                }
            },
            // 获取当前窗口url中param参数的值
            getQueryVariable(variable, url) {
                let query = url.split('?')[1]
                let vars = query.split("&");
                for (let i = 0; i < vars.length; i++) {
                    let pair = vars[i].split("=");
                    if (pair[0] == variable) {
                        return pair[1];
                    }
                }
                return false;
            }
        }
    }
</script>

<style>
    /*每个页面公共css */
    @import "colorui/main.css";
    @import "colorui/icon.css";
    @import "style/icon.css";
    @import "style/new-icon.css";
</style>
<style lang="scss">
    @import "app.scss";
</style>
