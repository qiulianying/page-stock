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
            // this.userLogin(options)
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
            userLogin(options) {
                // #ifndef H5
                //除了h5平台的其他平台编译
                authLogin({
                    success: res => {
                        try {
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
                        } catch (e) {
                            console.error(e)
                        }
                    },
                }, options)
                // #endif
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
            }
        }
    }
</script>

<style>
    /*每个页面公共css，这里也引入了colorui */
    @import "colorui/main.css";
    @import "colorui/icon.css";
    @import "style/icon.css";
    @import "style/new-icon.css";
</style>
<style lang="scss">
    @import "app.scss";
</style>
