<template>
    <view>
        <view class="home">
            <view class="header">
                <view class="container">
                    <view class="header_ui">
                        <span class="title">fhuview-ui组件库
                        </span>
                    </view>
                </view>
            </view>
            <view class="main">
                <view class="sidebar" id="sidebarId">
                    <ul class="pure-menu-list">
                        <li :key="index" class="nav-item" v-for="(item, index) in rightRouter">
                            <a :class="{'active':index === nowIndex}"
                               @click="toShowRouter(item.path, index)">{{item.style && item.style.navigationBarTitleText ? item.style.navigationBarTitleText : '暂无标题'}}</a>
                        </li>
                    </ul>
                </view>
                <view class="content">
                    <!--显示卡槽代码内容-->
                    <slot name="code"/>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {ENV_BASE_URL} from "../../../common/env";

    /**
     * @author: 冯耀华
     * @Date: 2022/03/28 15:02
     */
    export default {
        data() {
            return {
                rightRouter: [],
                codePath: '',
                myPath: '',
                myHost: '',
                showPath: '',
                codeHost: 'https://gitlab.51zcm.cc/fzsp/pageStock/raw/devTest/src',
            }
        },
        props: {
            nowIndex: {
                type: Number,
                default: 0
            }
        },
        created() {
            // 获取缓存路由
            this.rightRouter = uni.getStorageSync('myRouter').filter((item) => {
                return item.name === 'myPackageB' && !item.hideRouter
            })
            // 获取当前域名情况
            this.myHost = ENV_BASE_URL + '/page-stock/h5/'
            this.myPath = this.myHost + window.location.hash
            this.showPath = this.myHost + window.location.hash
            this.codePath = this.codeHost + window.location.hash + '.vue'
        },
        methods: {
            toShowRouter(path, index) {
                if (path === window.location.hash.split('#')[1]) return
                // 页面定位
                this.nowIndex = index
                this.myPath = this.myHost + path
                this.showPath = this.myHost + path
                this.codePath = this.codeHost + path + '.vue'
                uni.navigateTo({
                    url: path
                });
            },
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
            }
        }
    }
</style>
