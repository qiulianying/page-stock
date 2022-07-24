<template>
    <view>
        <view class="home">
            <view class="header">
                <view class="container">
                    <view class="header_ui">
                        <span class="title">页面库
                        </span>
                    </view>
                    <!--右侧对应路由页面-->
                    <view class="moRouter">
                        <ul class="moRouter_ul">
                            <li v-for="(item, index) in otherRouter" :key="index">
                                <a :class="{'active':nowIndex == item.id}" :href="item.path" :target="item.target ? '_blank' : '_self'" >
                                    {{item.title}}
                                </a>
                            </li>
                        </ul>
                    </view>
                </view>
            </view>
            <view class="main">
                <view class="sidebar" id="sidebarId">
                    <ul class="pure-menu-list">
                        <li :key="index" class="nav-item" v-for="(item, index) in rightRouter">
                            <a :class="{'active':index === nowIndex}"
                                @click="toShowRouter(item.path, index)">{{index+1}} ·
                                {{item.style && item.style.navigationBarTitleText ? item.style.navigationBarTitleText : '暂无标题'}}</a>
                        </li>
                    </ul>
                </view>
                <view class="content" id="router_view_box">
                    <!--展示对应的页面信息-->
                    <view class="content_pageInfo">
                        <view  v-if="!showLoading">
                            <view>
                                <h3>导读介绍</h3>
                                <p>该页面库之前主要作为福元宝小程序以及各类适配h5公众号的商家页面，可以针对商家商户，购物，买单，初步银行类型页面等需求进行快速的页面开发</p>
                            </view>
                            <view style="margin-top: 20px">
                                <h3>对应页面信息</h3>
                                <p style="color: red">路径：<span>{{this.showPath}}</span></p>
                                <p style="color: red">当前页面代码： <a :href="codePath" target="_blank">点击打开链接即可查看该页面源码</a></p>

                                <p style="font-weight:bold;margin-top:10px">注意：</p>
                                <p style="color: red">1、右侧页面可以直接类似手机点击交互页面查看，(我的)中存在换肤配置</p>
                                <p>2、浏览器展示页面与实际手机移动端呈现的样式交互存在略微差异（如有些文字在浏览器页面上看起来会很大，但在手机上是正常的）。</p>
                                <p>3、该文档内容样式目前只适配了pc端，右侧手机中部分交互无法复现（点击跳转、弹窗可以正常使用），可以手机扫描以下二维码浏览当前页面。</p>
                                <!--根据域名生成二维码-->
                                <view style="width:100%;margin:6px auto;">
                                    <tki-qrcode ref="qrcode" onval icon="/static/logo.png" :val="myPath" :size="280"
                                                :icon-size="60" :load-make="true" :show-loading="false" :using-components="false">
                                    </tki-qrcode>
                                </view>
                                <p style="color: red">4、对应路径与文件路径一致</p>
                                <p>5、该页面库已完成微信、支付宝、云闪付小程序页面适配，适用于h5或者微信，支付宝等公众号，较大程度适配抖音，百度小程序，能够基础适配通过android sdk打包成为软件页面
                                </p>

                            </view>
                        </view>
                        <view v-show="showLoading">
                            页面加载中，首页图片多加载较慢，请稍后！
                        </view>
                    </view>
                    <!--iframe组件展示-->
                    <iframe-item :myPath="myPath"></iframe-item>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    /**
     * @author: 冯耀华
     * @Date: 2022/03/28 15:02
     */
    import {
        ENV_BASE_URL
    } from '../../../../src/common/env'
    export default {
        data() {
            return {
                // 侧边栏其他链接
                otherRouter: [{
                    target: '_blank',
                    title: 'uni-app自编组件库',
                    path: '#/myPackageB/pages/explames/componentsred'
                }, {
                    title: '微信小程序常用需求文档库',
                    path: 'https://note.youdao.com/s/X02TWADm',
                    target: '_blank'
                }],
                nowIndex: 0,
                rightRouter: [],
                myPath: '',
                myHost: '',
                codeHost: 'https://gitlab.51zcm.cc/fzsp/pageStock/raw/devTest/src',
                codePath: '',
                showLoading: true
            }
        },
        onLoad() {
            // 获取缓存路由
            this.rightRouter = uni.getStorageSync('myRouter').filter((item) => {
                return item.name !== 'myPackageB'
            })
            // 获取当前域名情况
            this.myHost = ENV_BASE_URL + '/page-stock/h5/#'
            this.myPath = this.myHost + '/pages/index/index'
            this.showPath = this.myHost + '/pages/index/index'
            this.codePath = this.codeHost + '/pages/index/index' + '.vue'
            this.hideLoading()
        },
        mounted() {
            const _this = this
            // 写入父类公用方法
            window.getOption = _this.getOption
        },
        watch: {
            nowMyRouter(newVal) {},
        },
        computed: {
            nowMyRouter() {
                return this.$store.state.routerNow
            }
        },
        methods: {
            hideLoading() {
                setTimeout(() => {
                    this.showLoading = false
                }, 3000)
            },
            toShowRouter(path, index) {
                // 未加载完成不能点击
                if (this.showLoading) {
                    uni.showToast({
                        title: '页面加载中，首页图片多加载较慢，请稍后！',
                        icon: 'none',
                        duration: 3000
                    })
                    return
                }
                // 页面定位
                this.nowIndex = index
                this.myPath = this.myHost + path
                this.showPath = this.myHost + path
                this.codePath = this.codeHost + path + '.vue'
            },
            // 滚动条移动
            toLeftScroll(index) {
                document.getElementById('sidebarId').scrollTop = index * 30
            },
            // 父类全局方法
            getOption(data) {
                // 遍历获取index
                let myIndex = 0
                this.rightRouter.forEach((item, index) => {
                    if (item.path === data) {
                        myIndex = index
                    }
                })
                // 左滚动条定位
                this.toLeftScroll(myIndex)
                // 页面定位
                this.nowIndex = myIndex
                this.showPath = this.myHost + data
                this.codePath = this.codeHost + data + '.vue'
            }
        }
    }
</script>

<style lang="scss" scoped>
    .home {
        width: 100%;
        min-height: 100%;
        position: fixed;
        background-color: #ffffff;
        -webkit-user-select: text;

        .header {
            z-index: 100;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 80px;
            line-height: 80px;
            background: #fff;

            .container {
                height: 100%;
                width: 1140px;
                margin: 0 auto;
                padding: 0 10px;
                border-bottom: 1px solid #dcdfe6;

                .header_ui {
                    float: left;

                    .title {
                        // color: $--color-primary;
                        color: #409eff;
                        font-size: 26px;
                        font-weight: 500;
                        font-family: '微软雅黑';
                    }
                }

                .moRouter {
                    float: right;

                    .moRouter_ul {
                        list-style: none;

                        li {
                            cursor: pointer;
                            display: inline-block;
                            vertical-align: middle;
                            margin-right: 20px;

                            &:last-child {
                                margin-right: 0;
                            }

                            a {
                                text-decoration: none;
                                color: #666666;

                                &:hover {
                                    color: #409eff;
                                    text-decoration: underline #409eff;
                                }
                            }

                            .active {
                                color: #409eff;
                                text-decoration: underline #409eff;
                            }
                        }
                    }
                }
            }
        }

        .main {
            position: relative;
            width: 1180px;
            height: -webkit-calc(100% - 80px);
            height: -moz-calc(100% - 80px);
            height: calc(100% - 80px);
            margin: 0 auto;
            padding: 10px 0;
            top: 80px;
            display: flex;

            .sidebar {
                position: fixed;
                margin-right: 40px;
                width: 200px;
                height: 80%;
                top: 95px;
                visibility: hidden;
                overflow: auto;
                padding-bottom: 30px;

                &:hover {
                    visibility: visible;
                }

                >ul {
                    visibility: visible;
                }

                .nav-item {
                    list-style: none;
                    line-height: 30px;
                    height: 30px;
                    cursor: pointer;
                }

                .pure-menu-list {
                    padding-left: 15px;

                    a {
                        margin: 0;
                        padding: 0 10px;
                        text-decoration: none;
                        display: block;
                        position: relative;
                        transition: 0.15s ease-out;
                        color: #444;
                        font-size: 14px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        font-weight: 400;

                        &:hover {
                            color: #409eff;
                        }
                    }

                    .active {
                        color: #409eff;
                        font-weight: 700;
                        // text-decoration: underline;
                        background-color: #c8e3fc;
                        border-radius: 3px;
                    }
                }
            }

            .content {
                flex: 1;
                width: 100%;
                margin-left: 240px;
                height: 8rem;
                overflow-y: auto;
                padding-bottom: 30px;

                .content_pageInfo {
                    display: inline-block;
                    vertical-align: top;
                    width: calc(100% - 310px);
                }
            }
        }
    }
</style>
